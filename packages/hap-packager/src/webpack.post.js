/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import { sync as resolveSync } from 'resolve'
import { globalConfig, readJson, compileOptionsObject } from '@hap-toolkit/shared-utils'

import {
  WidgetFingerprintPlugin,
  CopyDslPlugin,
  CardPlugin,
  HandlerPlugin,
  ResourcePlugin,
  DeviceTypePlugin,
  ZipPlugin,
  NotifyPlugin,
  SourcemapFixPlugin,
  SplitChunksAdaptPlugin,
  RemoveModulesPlugin,
  CardScriptHandlePlugin
} from './plugins'
import { genPriorities, getBabelConfigJsPath } from './common/utils'
import { getSkeletonConfig } from './common/info'
import SignOnlinePlugin from './plugins/sign-online-plugin'

/**
 * 配置关联
 * @param webpackConf
 * @param defaultsOptions
 * @param quickappConfig - quickapp.config.js或者hap.config.js的配置
 */
function postHook(webpackConf, defaultsOptions, quickappConfig = {}) {
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
    useTreeShaking,
    isCardMinVersion
  } = defaultsOptions

  const manifestObj = readJson(path.join(pathSrc, 'manifest.json'))

  const skeletonConf = getSkeletonConfig(pathSrc)

  const priorities = genPriorities(manifestObj, skeletonConf)

  const jsLoaderList = [
    resolveSync('./loaders/module-loader.js'),
    {
      loader: resolveSync('babel-loader'),
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
        loader: resolveSync('./loaders/device-type-loader.js'),
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
  if (globalConfig.isSmartMode) {
    webpackConf.plugins.push(
      new SplitChunksAdaptPlugin({
        subpackages,
        disableSubpackages: compileOptionsObject.disableSubpackages
      })
    )
  }

  if (isCardMinVersion) {
    // 如果工程中有卡片配置为快应用 2.0 卡片，则使用插件抽取 template 和 style 的 json
    webpackConf.plugins.push(new CardScriptHandlePlugin({ pathSrc }), new RemoveModulesPlugin())
  }
  webpackConf.plugins.push(
    new CardPlugin({ pathSrc, isCardMinVersion }),
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
    new WidgetFingerprintPlugin({
      // must before ZipPlugin, calculate widget fingerprint for ZipPlugin
      pathSrc
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

  if (compileOptionsObject['signOnline']) {
    // 发送接口进行线上签名
    webpackConf.plugins.push(
      new SignOnlinePlugin({
        signOnlineRpks: compileOptionsObject.signOnlineRpks,
        sign: webpackConf.mode === 'development' ? 'debug' : 'release',
        name: appPackageName,
        versionName,
        output: pathDist,
        request: globalConfig.signOnLineConfig.signOnLine,
        headers: globalConfig.signOnLineConfig.headers,
        formData: globalConfig.signOnLineConfig.params
      })
    )
  }

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

export { postHook }
