/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { compileOptionsObject } = require('@hap-toolkit/shared-utils/compilation-config')
const { loaderWrapper } = require('@hap-toolkit/packager/lib/common/utils')

/**
 * @param webpackConf webpack配置
 * @param quickappConfig - quickapp.config.js或者hap.config.js的配置
 */
module.exports.postHook = function (webpackConf, { cwd, pathSrc }, quickappConfig) {
  // 用于接收定制配置
  let customConf = {
    module: {
      rules: []
    }
  }
  if (quickappConfig) {
    customConf = quickappConfig
    if (customConf.webpack) {
      customConf = customConf.webpack
    }
  }

  const rules = (customConf && customConf.module && customConf.module.rules) || []

  rules.forEach((rule) => {
    // 对.ts后缀包装
    if (rule.test.exec('.ts')) {
      loaderWrapper(pathSrc, rule)
    }
    // 放到全局webpack配置规则中
    webpackConf.module.rules.push(rule)
  })

  // 放入ux/mix的配置规则，这个对外不暴露，开发者只需要配置ts等语法即可
  webpackConf.module.rules.push({
    test: /\.(ux|mix)/,
    oneOf: [
      {
        resourceQuery: /uxType=app/,
        use: require.resolve('./loaders/app-loader.js')
      },
      {
        resourceQuery: /uxType=(page|comp|card)/,
        use: require.resolve('./loaders/ux-loader.js')
      },
      {
        use: require.resolve('./loaders/ux-loader.js')
      }
    ]
  })

  // 是否启用enableExtractCss插件
  if (compileOptionsObject.enableExtractCss) {
    const ExtractCssPlugin = require('./plugins/extract-css-plugin')
    webpackConf.plugins.push(new ExtractCssPlugin())
  }

  // 合并plugins配置
  webpackConf.plugins.push(...((customConf && customConf.plugins) || []))

  // 合并resolve配置
  Object.keys(webpackConf.resolve).forEach((key) => {
    const item = webpackConf.resolve[key]
    if (item instanceof Array) {
      item.push(...((customConf.resolve && customConf.resolve[key]) || []))
    } else if (typeof item === 'object' && item !== null) {
      Object.assign(item, (customConf.resolve && customConf.resolve[key]) || {})
    }
  })

  Object.keys((customConf && customConf.resolve) || {}).forEach((key) => {
    if (!(key in webpackConf.resolve)) {
      webpackConf.resolve[key] = customConf.resolve[key]
    }
  })
}
