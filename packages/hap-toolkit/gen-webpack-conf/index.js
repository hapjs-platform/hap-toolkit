/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const fs = require('fs')
const webpack = require('webpack')
const {
  readJson,
  colorconsole,
  KnownError,
  getProjectDslName,
  getDefaultServerHost
} = require('@hap-toolkit/shared-utils')
const globalConfig = require('@hap-toolkit/shared-utils/config')

const {
  compileOptionsMeta,
  compileOptionsObject,
  initCompileOptionsObject
} = require('@hap-toolkit/shared-utils/compilation-config')
const { name } = require('@hap-toolkit/packager/lib/common/info')

const ManifestWatchPlugin = require('../lib/plugins/manifest-watch-plugin')
const { resolveEntries } = require('../lib/utils')
const getDevtool = require('./get-devtool')
const {
  getConfigPath,
  cleanup,
  checkBuiltinModules,
  setAdaptForV8Version,
  checkBabelModulesExists
} = require('./helpers')

const {
  validateProject,
  validateManifest,
  valiedateSitemap,
  valiedateSkeleton
} = require('./validate')

const pathMap = {
  packager: require.resolve('@hap-toolkit/packager/lib/webpack.post.js'),
  xvm: require.resolve(`@hap-toolkit/dsl-xvm/lib/webpack.post.js`)
}

const ideConfig = require('./ide.config')

const eventBus = require('@hap-toolkit/shared-utils/event-bus')

const { PACKAGER_BUILD_PROGRESS } = eventBus

// 能使用抽取公共js功能的调试器最低版本
const SPLIT_CHUNKS_SUPPORT_VERSION_FROM = 1080

/**
 * 动态生成 webpack 配置项
 *
 * @param {Object} launchOptions - 命令行参数对象
 * @param {String} [launchOptions.cwd] - 工作目录
 * @param {String} [launchOptions.originType] - 打包来源，ide|cmd
 * @param {String} [launchOptions.devtool=undefined] - devtool(sourcemap)配置
 * @param {boolean} [launchOptions.debug=false] - 是否开启调试
 * @param {boolean} [launchOptions.stats=false] - 是否开启分析
 * @param {boolean} [launchOptions.target=all] - 打包的对象，可选值：card，app，all，默认为all
 * @param {boolean} [launchOptions.disableSubpackages=false] - 是否禁止分包
 * @param {boolean} [launchOptions.optimizeCssAttr=false] - 优化 css 属性
 * @param {boolean} [launchOptions.optimizeDescMeta=false] - 优化 css 描述数据
 * @param {boolean} [launchOptions.optimizeTemplateAttr=false] - 优化模板属性
 * @param {boolean} [launchOptions.optimizeStyleAppLevel=false] - 优化 app 样式等级
 * @param {boolean} [launchOptions.optimizeStylePageLevel=false] - 优化 app 样式等级
 * @param {boolean} [launchOptions.splitChunksMode=undefined] - 抽取公共JS
 * @param {Object} [options.compileOptions] - 编译参数，由IDE传入
 * @param {production|development} mode - webpack mode
 * @returns {WebpackConfiguration}
 */
module.exports = function genWebpackConf(launchOptions, mode) {
  // 项目目录
  if (launchOptions.cwd) {
    globalConfig.projectPath = launchOptions.cwd
  }
  globalConfig.projectPath = path.resolve(globalConfig.projectPath)
  const cwd = globalConfig.projectPath

  const hapConfigPath = getConfigPath(cwd)
  // 用于接受quickapp.config.js 或者 hap.config.js中的配置
  let quickappConfig
  // 接受命令行
  let cli = {}
  if (hapConfigPath) {
    try {
      quickappConfig = require(hapConfigPath)
      if (typeof quickappConfig.cli === 'object') {
        cli = quickappConfig.cli
        launchOptions = Object.assign({}, cli, launchOptions)
      }
    } catch (err) {
      colorconsole.error(`加载webpack配置文件[${hapConfigPath}]出错：${err.message}`)
    }
  }
  // 接收ide命令行
  if (launchOptions.ideConfig && typeof launchOptions.ideConfig.cli === 'object') {
    launchOptions = Object.assign({}, launchOptions.ideConfig.cli, launchOptions)
  }

  // 源代码目录
  const SRC_DIR = path.resolve(cwd, globalConfig.sourceRoot)
  // 签名文件目录
  const SIGN_FOLDER = globalConfig.signRoot
  // 编译文件的目录
  const BUILD_DIR = path.resolve(cwd, globalConfig.outputPath)
  // 最终发布目录：setPreviewPkgPathDir为ide传入的路径，用来保存构建的临时预览包
  const previewPkgPath =
    launchOptions.buildPreviewRpkOptions && launchOptions.buildPreviewRpkOptions.setPreviewPkgPath
  const DIST_DIR = previewPkgPath || path.resolve(cwd, globalConfig.releasePath)
  // 打包配置文件
  const manifestFile = path.resolve(SRC_DIR, 'manifest.json')
  checkBabelModulesExists(cwd)

  // 合并launchOptions到全局
  initCompileOptionsObject(launchOptions)

  // 校验项目工程
  validateProject(manifestFile, SRC_DIR)

  // 清理 BUILD_DIR DIST_DIR
  cleanup(BUILD_DIR, DIST_DIR)
  const targetList = ['app', 'card', 'all']
  // 处理打包对象的校验，默认值之外的，只提示warning，默认为all
  if (!compileOptionsObject.target || targetList.indexOf(compileOptionsObject.target) === -1) {
    colorconsole.warn('target只能取值card、app、all，默认取值为all')
    compileOptionsObject.target = 'all'
  }
  let manifest
  try {
    manifest = readJson(manifestFile)
  } catch (e) {
    throw new KnownError('manifest.json 解析失败！')
  }

  validateManifest(SRC_DIR, manifest, compileOptionsObject)

  valiedateSitemap(SRC_DIR, manifest)

  valiedateSkeleton(SRC_DIR, manifest)

  // 设置合适的v8版本
  setAdaptForV8Version(compileOptionsObject.disableScriptV8V65, manifest, cwd)

  // 页面文件
  const entries = resolveEntries(manifest, SRC_DIR, cwd)

  // 环境变量
  const env = {
    // 平台：native
    NODE_PLATFORM: process.env.NODE_PLATFORM,
    // 阶段: dev|test|release
    NODE_PHASE: process.env.NODE_PHASE
  }
  if (launchOptions.compileOptions) {
    Object.assign(env, {
      NODE_ENV: launchOptions.compileOptions.defineOptions.NODE_ENV
    })
  }
  colorconsole.info(`配置环境：${JSON.stringify(env)}`)

  const definePluginOptions = {
    // 平台：na
    ENV_PLATFORM: JSON.stringify(env.NODE_PLATFORM),
    // 阶段: dev|test|release
    ENV_PHASE: JSON.stringify(env.NODE_PHASE),
    ENV_PHASE_DV: env.NODE_PHASE === 'dev',
    ENV_PHASE_QA: env.NODE_PHASE === 'test',
    ENV_PHASE_OL: env.NODE_PHASE === 'prod',
    // 服务器地址
    QUICKAPP_SERVER_HOST: JSON.stringify(getDefaultServerHost()),
    QUICKAPP_TOOLKIT_VERSION: JSON.stringify(require('../package.json').version)
  }

  if (launchOptions.compileOptions) {
    const defineOptions = launchOptions.compileOptions.defineOptions
    Object.assign(definePluginOptions, {
      'process.env.NODE_ENV': JSON.stringify(defineOptions.NODE_ENV)
    })
    if (defineOptions.OTHER_VARIABLES) {
      let compileObj = {}
      const options = defineOptions.OTHER_VARIABLES.split('&')
      for (let i = 0; i < options.length; i++) {
        const item = options[i].split('=')
        compileObj[item[0]] = item[1]
      }
      Object.assign(definePluginOptions, compileObj)
    }
  }

  const webpackConf = {
    context: cwd,
    mode,
    entry: entries,
    output: {
      globalObject: 'window',
      path: BUILD_DIR,
      filename: '[name].js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|bmp|webp|mp4|wmv|avi|mpg|rmvb|mov|flv|otf|ttf|ttc|woff|eot)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: () => false
          },
          generator: {
            filename: 'assets/[name][ext]'
          }
        }
      ]
    },
    externals: [checkBuiltinModules],
    plugins: [
      new webpack.ProgressPlugin((percentage) => {
        const cb = launchOptions.callback
        if (cb && typeof cb === 'function') {
          const params = { action: 'progress', percentage }
          cb(params)
        }
        eventBus.emit(PACKAGER_BUILD_PROGRESS, { percentage })
      }),
      // 定义环境变量
      new webpack.DefinePlugin(definePluginOptions),
      // 编译耗时
      function BuildTimePlugin() {
        this.hooks.done.tapAsync('end', function (stats, callback) {
          if (!stats.compilation.errors.length) {
            const secs = (stats.endTime - stats.startTime) / 1000
            colorconsole.info(`Build Time Cost: ${secs}s`)
          }
          callback()
        })
      },
      new ManifestWatchPlugin({
        appRoot: cwd,
        root: SRC_DIR
      })
    ],
    resolve: {
      modules: ['node_modules'],
      extensions: ['.webpack.js', '.web.js', '.js', '.json'].concat(name.extList)
    },
    stats: {
      builtAt: false,
      entrypoints: false,
      children: false,
      chunks: false,
      chunkModules: false,
      chunkOrigins: false,
      modules: false,
      version: false,
      assets: false
    },
    optimization: {}
  }

  // 设置抽取公共js
  if (compileOptionsObject.splitChunksMode === compileOptionsMeta.splitChunksModeEnum.SMART) {
    colorconsole.warn(
      `启用 splitChunksMode: "SMART" 模式, 请确保平台版本 >= ${SPLIT_CHUNKS_SUPPORT_VERSION_FROM}`
    )
    // 当前仅smart模式才启用
    webpackConf.optimization.splitChunks = {
      minSize: 1,
      cacheGroups: {
        default: false,
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks(chunk) {
            // 获取需要chunk的模块，卡片模块暂不支持提取公共chunk
            const widgetsConf = manifest.router.widgets || {}
            return !Object.keys(widgetsConf).some((item) => chunk.name.indexOf(item) !== -1)
          },
          minChunks: 2,
          name(module) {
            // 处理node_modules的chunk位置为node_modules下的路径,通过name来控制,如node_modules/vue/dist/vue.runtime.esm;
            const index = module.resource.indexOf('node_modules')
            const chunkPath = module.resource
              .slice(index)
              .replace(/(.+)\.\w\??(.+)?/, ($0, $1) => $1)
            // 兼容windows上的路径
            return chunkPath.replace(/\\/g, '/').split(path.sep).join('/')
          },
          priority: 2,
          reuseExistingChunk: true,
          enforce: true
        },
        // 用于抽离出app.ux引入的组件或者文件
        appPkg: {
          test(module, { chunkGraph }) {
            function isAppRequire(module, chunkGraph) {
              let result = false
              chunkGraph.getModuleChunksIterable(module).forEach((chunk) => {
                if (chunk.name === 'app') {
                  result = true
                  return false
                }
              })
              return result
            }

            function isUxPath(module) {
              // require.context引入的是ContextModule不含有resource
              if (!module.resource) return false
              const queryStriped = module.resource.split('?').shift()
              return path.extname(queryStriped) === '.ux'
            }

            if (isAppRequire(module, chunkGraph) && isUxPath(module)) {
              return true
            }

            return false
          },
          chunks: 'all',
          name(module) {
            // 处理正常chunk的位置为相对src下的路径，通过name来控制,如Common/a;
            const sourcePath = path.join(globalConfig.projectPath, globalConfig.sourceRoot)
            const chunkPath = module.resource
              .slice(sourcePath.length + 1)
              .replace(/(.+)\.\w\??(.+)?/, ($0, $1) => $1)
            // 兼容windows上的路径
            return chunkPath.replace(/\\/g, '/').split(path.sep).join('/')
          },
          // 优先级最低
          priority: 1,
          // 只要app.ux引入即被抽离
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        chunks: {
          test(module) {
            // 过滤掉自定义module，比如抽取css生成*.css.json使用的CssModule
            if (module.constructor.name !== 'NormalModule') {
              return false
            }
            return true
          },
          chunks(chunk) {
            // 获取需要chunk的模块，卡片模块暂不支持提取公共chunk
            const widgetsConf = manifest.router.widgets || {}
            return !Object.keys(widgetsConf).some((item) => chunk.name.indexOf(item) !== -1)
          },
          minChunks: 2,
          name(module) {
            // 处理正常chunk的位置为相对src下的路径，通过name来控制,如Common/a;
            const sourcePath = path.join(globalConfig.projectPath, globalConfig.sourceRoot)
            const chunkPath = module.resource
              .slice(sourcePath.length + 1)
              .replace(/(.+)\.\w\??(.+)?/, ($0, $1) => $1)
            // 兼容windows上的路径
            return chunkPath.replace(/\\/g, '/').split(path.sep).join('/')
          },
          priority: 1,
          reuseExistingChunk: true,
          enforce: true
        },
        async: {
          chunks: 'async',
          name(module) {
            const sourcePath = path.join(globalConfig.projectPath, globalConfig.sourceRoot)
            const chunkPath = module.resource
              .slice(sourcePath.length + 1)
              .replace(/(.+)\.\w\??(.+)?/, ($0, $1) => $1)
            // 兼容windows上的路径
            return chunkPath.replace(/\\/g, '/').split(path.sep).join('/')
          },
          priority: 3,
          enforce: true
        }
      }
    }
  }
  // 加载配置
  loadWebpackConfList()

  // 设置 sourcemap 类型
  webpackConf.devtool = getDevtool(webpackConf.mode, compileOptionsObject.devtool)

  /**
   * 尝试加载每个模块的webpack配置
   */
  function loadWebpackConfList() {
    const moduleList = [
      {
        name: 'packager',
        path: pathMap['packager']
      }
    ]

    const dslName = getProjectDslName(cwd)

    if (dslName === 'vue') {
      colorconsole.error('当前 hap-toolkit 版本暂不支持 Vue 语法的项目编译，请先使用老版本')
      colorconsole.throw(
        '因为升级 Webpack5 带来的 toolkit 对 Vue 语法支持的改动较大，将在下个版本支持'
      )
    }

    moduleList.push({
      name: `${dslName}-post`,
      path: pathMap[dslName]
    })

    const {
      package: appPackageName,
      icon: appIcon,
      versionName,
      versionCode,
      subpackages,
      workers,
      banner = ''
    } = manifest
    for (let i = 0, len = moduleList.length; i < len; i++) {
      const fileConf = moduleList[i].path
      if (fs.existsSync(fileConf)) {
        try {
          const moduleWebpackConf = require(fileConf)
          if (moduleWebpackConf.postHook) {
            moduleWebpackConf.postHook(
              webpackConf,
              {
                appPackageName,
                appIcon,
                banner,
                versionName,
                versionCode,
                nodeConf: env,
                pathDist: DIST_DIR,
                pathSrc: SRC_DIR,
                subpackages,
                pathBuild: BUILD_DIR,
                pathSignFolder: SIGN_FOLDER,
                useTreeShaking:
                  quickappConfig && quickappConfig.useTreeShaking
                    ? !!quickappConfig.useTreeShaking
                    : false,
                workers,
                cwd,
                originType: compileOptionsObject.originType
              },
              quickappConfig
            )
          }
        } catch (err) {
          console.error(`加载 webpack 配置文件[${fileConf}]出错：${err.message}`, err)
        }
      }
    }

    // 增加项目目录的postHook机制
    if (quickappConfig && quickappConfig.postHook) {
      quickappConfig.postHook(webpackConf, compileOptionsObject)
    }
    ideConfig.postHook(webpackConf, launchOptions.ideConfig)
  }
  return webpackConf
}
