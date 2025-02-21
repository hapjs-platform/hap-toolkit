/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

// 完整的媒体查询
const RE_MEDIA_QUERY = /(?:(only|not)?\s*)?(\s*[^\s()]+)?(?:(?:\s*(and)\s*)?(.+))?/i

// feture集合表达式
// (foo) and (bar) | (baz)
const RE_MEDIA_FEATURE = /^(\(\s*[^()]+\)\s+[a-zA-Z]+\s+)+\(\s*[^()]+\)\s*$|^\(\s*[^()]+\)$/

// (min-width: 100) 此类表达式
const RE_MQ_DISCRETE_EXPRESSION = /\(\s*([^\s:)]+)\s*(?::\s*([^\s)]+))?\s*\)/

// (width > 100) 此类表达式
// ([-+]?\d*\.?(?:\d+[a-zA-Z]*|\d+\/\d+)) => 如，100、100px、1/1
// (<|>|<=|>=)?\s*) => 如，< 、< 、>= 、<= 、
const RE_MQ_RANGE_EXPRESSION =
  /^\((?:([-+]?\d*\.?(?:\d+[a-zA-Z]*|\d+\s*\/\s*\d+))\s*(<|>|<=|>=)?\s*)?(aspect-ratio|resolution|width|height|device-width|device-height)(?:\s*(<|>|<=|>=)?\s*([-+]?\d*\.?(?:\d+[a-zA-Z]*|\d+\s*\/\s*\d+)))?\)$/

// 媒体查询类型
const mediaQueryTypes = ['screen']

const featureValidatorMap = {
  height: 'number',
  'min-height': 'number',
  'max-height': 'number',
  width: 'number',
  'min-width': 'number',
  'max-width': 'number',
  resolution: 'resolution',
  'min-resolution': 'resolution',
  'max-resolution': 'resolution',
  orientation: 'orientation',
  'aspect-ratio': 'ratio',
  'min-aspect-ratio': 'ratio',
  'max-aspect-ratio': 'ratio',
  'device-height': 'number',
  'min-device-height': 'number',
  'max-device-height': 'number',
  'device-width': 'number',
  'min-device-width': 'number',
  'max-device-width': 'number',
  'prefers-color-scheme': 'preferColorScheme',
  scene: 'scene',
  'widget-size': 'widgetSize',
  'device-type': 'deviceType',
  manufacturer: 'manufacturer'
}

/**
 * 媒体特征各类型的值校验
 */
const featureValidator = {
  number(value) {
    const reg = /^(\d+)(px|dp)?$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return 'ERROR: 媒体特征 `' + feature + '` 的值 `' + value + '` 不正确, 必须为 `数值`'
      }
    }
  },
  resolution(value) {
    const reg = /^\d+(dpi|dppx)$/
    if (reg.test(value)) {
      return { value }
    }

    if (/^\d+$/.test(value)) {
      const newVal = value + 'dpi'
      return {
        value: newVal,
        reason: function (feature) {
          return 'WARN: 媒体特征 `' + feature + '` 的单位为 `dpi | dppx` ' + '自动补齐为 `' + 'dpi`'
        }
      }
    }

    return {
      reason: function (feature) {
        return (
          'ERROR: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `数值 + dpi | dppx`'
        )
      }
    }
  },
  orientation(value) {
    const reg = /^(portrait|landscape)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `portrait | landscape`'
        )
      }
    }
  },
  scene(value) {
    const reg =
      /^(assistantscreen|launcher|globalsearch|calendar|lockscreen|suggestion|voiceassistant|sms|servicecenter)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `assistantscreen | launcher | globalsearch | calendar | lockscreen | suggestion | voiceassistant | sms | servicecenter`'
        )
      }
    }
  },
  widgetSize(value) {
    if (value) {
      let sizeStr = value.trim()
      if (sizeStr[0] === '"' || sizeStr[0] === "'") {
        sizeStr = sizeStr.slice(1, sizeStr.length - 1)
      }
      const reg = /^(1x1|1x2|2x1|2x2|4x2|4x4|4xN)$/
      if (reg.test(sizeStr)) {
        return { value: sizeStr }
      }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `1x1 | 1x2 | 2x1 | 2x2 | 4x2 | 4x4 | 4xN`'
        )
      }
    }
  },
  deviceType(value) {
    const reg = /^(phone|watch|car)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `phone | watch | car`'
        )
      }
    }
  },
  manufacturer(value) {
    const reg = /^(xiaomi|vivo|OPPO|honor)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `xiaomi | vivo | OPPO| honor`'
        )
      }
    }
  },
  ratio(value) {
    const reg = /^(\d+\s*\/\s*\d+|\d+\.\d+|\d+)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' + feature + '` 的值 `' + value + '` 不正确, 必须为 `数值 | 数值/数值`'
        )
      }
    }
  },
  preferColorScheme(value) {
    const reg = /^(light|dark|no-preference)$/
    if (reg.test(value)) {
      return { value }
    }
    return {
      reason: function (feature) {
        return (
          'WARN: 媒体特征 `' +
          feature +
          '` 的值 `' +
          value +
          '` 不正确, 必须为 `light | dark | no-preference`'
        )
      }
    }
  }
}

/**
 * 解析返回媒体查询表达式
 * @param {String} mediaQuery - 媒体查询表达式
 * @returns {Object} object 解析后的结果
 * https://github.com/ericf/css-mediaquery
 */
function parseQuery(mediaQuery) {
  const error = []
  const result = mediaQuery.split(',').map(function (query) {
    query = query.trim()

    const captures = query.match(RE_MEDIA_QUERY)
    const modifier = captures[1]
    const type = captures[2]
    const operator = captures[3] // 分割第一个操作符
    const features = captures[4] || ''
    // @media screen {} 无匹配条件 features 为undefined
    if (features && !features.match(RE_MEDIA_FEATURE)) {
      error.push('WARN: 媒体特征格式错误')
      return
    }

    const parsed = {}

    // 媒体特征前面的标识符
    parsed.modifier = modifier
    // 媒体类型
    parsed.type = type ? type.toLowerCase() : 'screen'

    // Split expressions into a list.
    let expressions = features.match(/\([^)]+\)/g) || []

    parsed.operator = operator

    parsed.expressions = expressions.map(function (expression) {
      const combineReg = new RegExp(
        `\\)\\s+([a-zA-Z]+)?\\s+${expression.replace(/\(/, '\\(').replace(/\)/, '\\)')}`
      )
      const combineMatch = query.match(combineReg)
      // 单条媒体特征前面跟着的连接符："or"、"and"
      let combineSymbol = ''
      if (combineMatch) {
        combineSymbol = combineMatch[1]
        if (combineSymbol !== 'and' && combineSymbol !== 'or') {
          error.push('WARN: 媒体特征连接符必须为 and 或者 or')
          return
        }
      }
      // 是否为: 形式
      let captures = expression.match(RE_MQ_DISCRETE_EXPRESSION)
      if (captures) {
        return {
          type: 'discrete',
          combineSymbol,
          feature: captures[1],
          value: captures[2]
        }
      }
      // 是否为 < > <= >= 形式
      captures = expression.match(RE_MQ_RANGE_EXPRESSION)
      if (captures) {
        return {
          type: 'range',
          combineSymbol,
          beforeValue: captures[1], // 媒体特征左边的值
          beforeSymbol: captures[2], // 媒体特征左边的运算符
          feature: captures[3], // 媒体特征
          afterSymbol: captures[4], // 媒体特征右边的值
          afterValue: captures[5] // 媒体特征右边的运算符
        }
      }
      error.push('WARN: 无效的媒体特征表达式: "' + expression + '"')
    })
    return parsed
  })
  return {
    result,
    error
  }
}

/**
 * 检验(min-width: 100px)此类表达式的值
 * @param {String} exp - 媒体特征表达式
 * @param {String} feature - 媒体特征
 * @param {String} featureType - 媒体特征的类型
 * @param {Array} logReason - log
 * @returns {String} 返回解析后的表达式
 */
function validateDiscreteValue(exp, feature, featureType, logReason) {
  const valResult = featureValidator[featureType](exp.value)
  const { value, reason } = valResult
  let expStr = ''
  if (reason) {
    reason && logReason.push(reason(feature))
  }
  if (value) {
    expStr += `${feature}: ${value}`
  }
  return expStr
}

/**
 * 检验(100 < width < 200)此类表达式的值
 * @param {String} exp - 媒体特征表达式
 * @param {String} feature - 媒体特征
 * @param {String} featureType - 媒体特征的类型
 * @param {Array} logReason - log
 * @returns {String} 返回解析后的表达式
 */
function validateRangeValue(exp, feature, featureType, logReason) {
  function getValue(v) {
    let valResult = featureValidator[featureType](v)
    const { reason, value } = valResult
    reason && logReason.push(reason(feature))
    return value
  }
  // 左边值，左边运算符，右边运算符，右边值
  let { beforeValue, beforeSymbol, afterSymbol, afterValue } = exp
  let expStr = feature
  if (beforeValue) {
    beforeValue = getValue(beforeValue)
    if (beforeValue) {
      expStr = `${beforeValue} ${beforeSymbol} ${expStr}`
    } else {
      return ''
    }
  }
  if (afterValue) {
    afterValue = getValue(afterValue)
    if (afterValue) {
      expStr = `${expStr} ${afterSymbol} ${afterValue}`
    } else {
      return ''
    }
  }
  return expStr
}

/**
 * 检验及解析media query的触发条件, 表达式一处错误，整条失效
 * @param {String} condition - 查询条件
 * @returns {Object} 返回解析后的查询条件
 */
function validateMediaCondition(condition) {
  if (condition) {
    const logReason = []
    const ast = parseQuery(condition)
    if (ast.error.length > 0) {
      ast.error.forEach((err) => {
        err += ', 表达式: `' + condition + '`' + ' 有错误，请检查'
        logReason.push(err)
      })
      return {
        reason: logReason
      }
    }
    const conditionArr = []
    // 当用","表示或的时候解析为数组
    ast.result.forEach((_ast) => {
      const { modifier, type, operator, expressions } = _ast
      // type 需符合指定类型
      if (mediaQueryTypes.indexOf(type) === -1) {
        logReason.push('WARN: 媒体类型 `' + type + '` 不支持')
        return
      }

      let connector = operator || ''
      if (expressions.length > 0 && !operator) {
        connector = 'and'
      }
      let conditionStr = modifier ? `${modifier} ${type} ${connector}` : `${type} ${connector}`

      expressions.forEach((exp) => {
        const { feature, combineSymbol, type: expType } = exp
        // feature 需符合指定类型. 同时寻找对应的校验模式
        const featureType = featureValidatorMap[feature]
        if (!featureType) {
          conditionStr = ''
          logReason.push('WARN: 媒体特征 `' + feature + '` 不支持')
          return
        }
        let expStr = ''
        if (expType === 'discrete') {
          expStr = validateDiscreteValue(exp, feature, featureType, logReason)
        } else if (expType === 'range') {
          expStr = validateRangeValue(exp, feature, featureType, logReason)
        }
        if (expStr) {
          conditionStr += combineSymbol ? ` ${combineSymbol} (${expStr})` : ` (${expStr})`
        } else {
          conditionStr = ''
        }
      })
      // conditionStr形如: "all and (min-height: 400px)"
      conditionArr.push(conditionStr)
    })
    return {
      value: conditionArr.join(' or '),
      reason: logReason
    }
  }
  return {
    value: ''
  }
}

/**
 * 通过传入的条件查找数组里匹配的类
 * @param {Object[]} mediaClasses - 媒体查询的类集合数组
 * @param {String} condition - 查询条件
 * @returns {Object|null} 返回匹配的类或者null
 */
function findMediaClassByCondition(mediaClasses, condition) {
  if (condition) {
    let mediaCls = mediaClasses.find((cls) => {
      return cls.condition === condition
    })
    return mediaCls
  }
  return null
}

/**
 * 生成带有媒体查询的代码
 * @param {String} code - 代码
 * @param {String} mediaquery - 媒体查询条件
 * @returns {String} 返回已加上媒体查询的代码
 */
function wrapMediaCode(code, mediaquery) {
  return `@media ${mediaquery} {\n${code}\n}`
}

module.exports = {
  validateMediaCondition,
  findMediaClassByCondition,
  wrapMediaCode
}
