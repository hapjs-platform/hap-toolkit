/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export function postHook(webpackConf, defaultsOptions) {
  // 用于接收定制配置
  let customConf
  if (defaultsOptions.ideConfig) {
    customConf = defaultsOptions.ideConfig
    if (customConf.webpack) {
      customConf = customConf.webpack
    }
  } else {
    customConf = {
      module: {
        rules: []
      },
      plugins: []
    }
  }

  const rules = (customConf && customConf.module && customConf.module.rules) || []

  // 放到全局webpack配置规则中
  webpackConf.module.rules.push(...rules)
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
