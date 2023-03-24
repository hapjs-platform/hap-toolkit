/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { colorconsole } = require('@hap-toolkit/shared-utils')

/**
 * 校验并返回 webpack devtool值（sourcemap）
 * @param {String} mode - webpack mode
 * @param {String} devtool - devtool参数值
 */
module.exports = function getDevtoolValue(mode, devtool) {
  // TODO：https://webpack.js.org/configuration/devtool/#root eval模式在 webpack5 下运行白屏
  // 后续或虑改为：有（source-map）无（false）二元选项
  const sourcemaps = {
    development: {
      default: 'cheap-source-map',
      options: [
        false,
        'cheap-source-map',
        'cheap-module-source-map',
        'inline-cheap-source-map',
        'inline-cheap-module-source-map',
        'source-map',
        'inline-source-map',
        'hidden-source-map',
        'nosources-source-map'
      ]
    },
    production: {
      default: false,
      options: [
        false,
        'cheap-source-map',
        'cheap-module-source-map',
        'source-map',
        'hidden-source-map',
        'nosources-source-map'
      ]
    }
  }
  const sourcemapArr = sourcemaps[mode].options
  const defaultSourcemap = sourcemaps[mode].default
  if (typeof devtool !== 'string' && typeof devtool !== 'boolean') {
    return defaultSourcemap
  }
  if (sourcemapArr.indexOf(devtool) === -1) {
    colorconsole.warn(`${mode} 模式 devtool 不支持 '${devtool}', 改为默认 '${defaultSourcemap}'`)
    return defaultSourcemap
  }

  return devtool
}
