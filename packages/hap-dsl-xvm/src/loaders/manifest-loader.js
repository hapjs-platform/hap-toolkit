/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
import path from '@jayfate/path'
import fs from 'fs'
import loaderUtils from 'loader-utils'
import { logWarn } from '@hap-toolkit/shared-utils'

import { isPlainObject } from './common/utils'

const REGEXP_INT = /^[-+]?[0-9]+$/
const REGEXP_URL = /^['"]?([^()]+?)['"]?$/gi
const REGEXP_NAME = /^[a-zA-Z_][a-zA-Z0-9]*$/

const validator = {
  integer: function (v) {
    v = (v || '').toString()
    if (v.match(REGEXP_INT)) {
      return { value: true }
    }
    return {
      value: false,
      reason: function reason(k, v) {
        return 'ERROR: manifest.json的配置项 `' + k + '` 的值 `' + v + '` 无效(仅支持整数)'
      }
    }
  },
  object: function (v) {
    const r = isPlainObject(v)
    return {
      value: isPlainObject(v),
      reason: r
        ? null
        : function reason(k, v) {
            return 'ERROR: manifest.json的配置项 `' + k + '` 的值 `' + v + '` 无效(仅支持对象)'
          }
    }
  },
  url: function (v) {
    v = (v || '').toString().trim()
    const url = v.match(REGEXP_URL)
    if (url) {
      return { value: true }
    }

    return {
      value: false,
      reason: function reason(k, v) {
        return 'ERROR: manifest.json的配置项 `' + k + '` 的值 `' + v + '` 必须是url'
      }
    }
  },
  name: function (v) {
    v = (v || '').toString()
    if (v.match(REGEXP_NAME)) {
      return { value: true }
    }

    return {
      value: false,
      reason: function reason(k, v) {
        return 'ERROR: manifest.json的配置项 `' + k + '` 的值 `' + v + '` 格式不正确'
      }
    }
  }
}

const validatorMap = {
  package: {
    type: validator.string,
    require: true
  },
  name: {
    type: validator.string,
    require: true
  },
  versionCode: {
    type: validator.integer,
    require: true
  },
  icon: {
    type: validator.url,
    require: true
  },
  banner: {
    type: validator.url,
    require: false
  },
  config: {
    type: validator.object,
    require: true
  },
  router: {
    type: validator.object,
    require: true
  }
}

/**
 * 校验属性
 * @param name
 * @param value
 * @returns {{value: *, log: *}}
 */
function validate(name, value) {
  let result, log
  const validator = validatorMap[name]

  if (validator && typeof validator.type === 'function') {
    result = validator.type(value)
    if (result.reason) {
      log = { reason: result.reason(name, value) }
    }
  } else {
    result = { value: true } // 无校验，默认合法
  }

  return {
    value: result.value,
    log: log
  }
}

// 缺省属性
const requireAttrMap = []
;(function initRules() {
  Object.keys(validatorMap).forEach(function (name) {
    const info = validatorMap[name]
    if (info.require) {
      requireAttrMap.push(name)
    }
  })
})()

module.exports = function manifestLoader(source, sourceMap) {
  const loaderQuery = loaderUtils.getOptions(this)
  // 获取query参数
  const srcPath = loaderQuery.path
  const manifest = JSON.parse(fs.readFileSync(path.join(srcPath, 'manifest.json')).toString())
  const logs = []
  if (manifest) {
    // 检测必填属性
    requireAttrMap.forEach(function (name) {
      if (!manifest[name]) {
        logs.push({
          line: 1,
          column: 1,
          reason: 'ERROR: manifest.json缺少配置项 `' + name + '`'
        })
      }
    })

    // 校验属性值
    let value, result
    Object.keys(manifest).forEach((key) => {
      value = manifest[key]
      result = validate(key, value)
      if (result.log) {
        logs.push({
          line: 1,
          column: 1,
          reason: result.log.reason
        })
      }
    })

    // 输出日志
    logWarn(this, logs)

    // 放置到NodeJS全局
    global.framework.manifest = manifest
  }
  this.callback(null, source, sourceMap)
  /*eslint-disable*/
  return
}
