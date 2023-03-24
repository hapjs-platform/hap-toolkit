/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')

const { readJson } = require('@hap-toolkit/shared-utils')
const globalConfig = require('@hap-toolkit/shared-utils/config')
const {
  compileOptionsMeta,
  compileOptionsObject
} = require('@hap-toolkit/shared-utils/compilation-config')

const CopyDslPlugin = require('./plugins/copy-dsl-plugin')
const HandlerPlugin = require('./plugins/handler-plugin')
const ResourcePlugin = require('./plugins/resource-plugin')
const DeviceTypePlugin = require('./plugins/device-type-plugin')
const ZipPlugin = require('./plugins/zip-plugin')
const NotifyPlugin = require('./plugins/notify-plugin')
const SourcemapFixPlugin = require('./plugins/sourcemap-fix-plugin')
const SplitChunksAdaptPlugin = require('./plugins/splitchunks-adapt-plugin')
const { genPriorities, getBabelConfigJsPath } = require('./common/utils')
const { getSkeletonConfig } = require('./common/info')

/**
 * 配置关联
 * @param webpackConf
 * @param defaults
 * @param quickappConfig - quickapp.config.js或者hap.config.js的配置
 */
function postHook(webpackConf, defaults, quickappConfig = {}) {
  // 项目目录
  const cwd = path.resolve(globalConfig.projectPath)
  // 环境信息
  const {
    appPackageName,
    appIcon,
    banner = '',
    versionName,
    versionCode,
    pathDist,
    pathBuild,
    pathSignFolder,
    pathSrc,
    subpackages,
    workers,
    originType,
    useTreeShaking
  } = defaults

  const manifestObj = readJson(path.join(pathSrc, 'manifest.json'))

  const skeletonConf = getSkeletonConfig(pathSrc)

  const priorities = genPriorities(manifestObj, skeletonConf)

  const jsLoaderList = [
    require.resolve('./loaders/module-loader.js'),
    {
      loader: require.resolve('babel-loader'),
      options: {
        configFile: getBabelConfigJsPath(cwd, useTreeShaking),
        cwd,
        cacheDirectory: true
      }
    }
  ]

  if (compileOptionsObject.enableIstanbul) {
    jsLoaderList.unshift({
      loader: 'istanbul-instrumenter-loader'
    })
  }

  webpackConf.module.rules.push({
    test: /\.js$/,
    use: jsLoaderList
  })

  webpackConf.module.rules.push({
    test: /\.json$/,
    include: [path.join(pathSrc, 'manifest.json')],
    use: [
      {
        loader: require.resolve('./loaders/device-type-loader.js'),
        options: {
          srcPath: pathSrc
        }
      }
    ]
  })

  // manifest中的值：build命令为true，release命令为false
  const configDebugInManifest = process.env.NODE_PHASE !== 'prod'

  const rpkComment = JSON.stringify({
    // 版本号和 @hap-toolkit/packager 相同
    originType,
    toolkit: require('../package.json').version,
    timeStamp: new Date().toJSON(),
    node: process.version,
    platform: process.platform,
    arch: process.arch
  })

  if (compileOptionsObject.includeDslFromLib) {
    webpackConf.plugins.unshift(
      new CopyDslPlugin({
        cwd,
        config: manifestObj.config
      })
    )
  }

  // 抽取公共js(仅smart模式开启)
  if (compileOptionsObject.splitChunksMode === compileOptionsMeta.splitChunksModeEnum.SMART) {
    webpackConf.plugins.push(
      new SplitChunksAdaptPlugin({
        subpackages,
        disableSubpackages: compileOptionsObject.disableSubpackages
      })
    )
  }

  webpackConf.plugins.push(
    // 框架Handler包装
    new HandlerPlugin({
      pathSrc: pathSrc,
      workers: workers,
      enableE2e: compileOptionsObject.enableE2e,
      useTreeShaking
    }),
    new DeviceTypePlugin({
      srcPath: pathSrc,
      buildPath: pathBuild
    }),
    new ResourcePlugin({
      src: pathSrc,
      dest: pathBuild,
      comment: rpkComment,
      projectRoot: globalConfig.projectPath,
      configDebugInManifest,
      optimizeUnusedResource: compileOptionsObject.optimizeUnusedResource
    }),
    // 打包
    new ZipPlugin({
      name: appPackageName,
      icon: appIcon,
      banner: banner,
      versionName: versionName,
      versionCode: versionCode,
      output: pathDist,
      pathSrc,
      pathBuild,
      pathSignFolder,
      priorities: priorities,
      subpackages,
      comment: rpkComment,
      cwd,
      disableStreamPack: compileOptionsObject.disableStreamPack,
      disableSubpackages: compileOptionsObject.disableSubpackages,
      signMode: compileOptionsObject.signMode,
      buildNameFormat: compileOptionsObject.buildNameFormat,
      buildPreviewRpkOptions: compileOptionsObject.buildPreviewRpkOptions
    }),
    new NotifyPlugin({
      doNotNotifyAtFirst: compileOptionsObject.enableServerWatch
    })
  )

  // 解决错误信息定位问题
  if (compileOptionsObject.matchSourcemap) {
    webpackConf.plugins.push(new SourcemapFixPlugin())
  }

  if (compileOptionsObject.stats) {
    // 分析bundle
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConf.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        excludeAssets: /^@(system|service)\./
      })
    )
  }
}

module.exports = {
  postHook
}
