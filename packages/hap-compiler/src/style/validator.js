/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import {
  camelCaseToHyphened,
  hyphenedToCamelCase,
  isEmptyObject,
  splitAttr,
  isValidValue,
  resolvePath
} from '../utils'

const colorNames = {
  aliceblue: '#F0F8FF',
  antiquewhite: '#FAEBD7',
  aqua: '#00FFFF',
  aquamarine: '#7FFFD4',
  azure: '#F0FFFF',
  beige: '#F5F5DC',
  bisque: '#FFE4C4',
  black: '#000000',
  blanchedalmond: '#FFEBCD',
  blue: '#0000FF',
  blueviolet: '#8A2BE2',
  brown: '#A52A2A',
  burlywood: '#DEB887',
  cadetblue: '#5F9EA0',
  chartreuse: '#7FFF00',
  chocolate: '#D2691E',
  coral: '#FF7F50',
  cornflowerblue: '#6495ED',
  cornsilk: '#FFF8DC',
  crimson: '#DC143C',
  cyan: '#00FFFF',
  darkblue: '#00008B',
  darkcyan: '#008B8B',
  darkgoldenrod: '#B8860B',
  darkgray: '#A9A9A9',
  darkgreen: '#006400',
  darkgrey: '#A9A9A9',
  darkkhaki: '#BDB76B',
  darkmagenta: '#8B008B',
  darkolivegreen: '#556B2F',
  darkorange: '#FF8C00',
  darkorchid: '#9932CC',
  darkred: '#8B0000',
  darksalmon: '#E9967A',
  darkseagreen: '#8FBC8F',
  darkslateblue: '#483D8B',
  darkslategray: '#2F4F4F',
  darkslategrey: '#2F4F4F',
  darkturquoise: '#00CED1',
  darkviolet: '#9400D3',
  deeppink: '#FF1493',
  deepskyblue: '#00BFFF',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1E90FF',
  firebrick: '#B22222',
  floralwhite: '#FFFAF0',
  forestgreen: '#228B22',
  fuchsia: '#FF00FF',
  gainsboro: '#DCDCDC',
  ghostwhite: '#F8F8FF',
  gold: '#FFD700',
  goldenrod: '#DAA520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#ADFF2F',
  grey: '#808080',
  honeydew: '#F0FFF0',
  hotpink: '#FF69B4',
  indianred: '#CD5C5C',
  indigo: '#4B0082',
  ivory: '#FFFFF0',
  khaki: '#F0E68C',
  lavender: '#E6E6FA',
  lavenderblush: '#FFF0F5',
  lawngreen: '#7CFC00',
  lemonchiffon: '#FFFACD',
  lightblue: '#ADD8E6',
  lightcoral: '#F08080',
  lightcyan: '#E0FFFF',
  lightgoldenrodyellow: '#FAFAD2',
  lightgray: '#D3D3D3',
  lightgreen: '#90EE90',
  lightgrey: '#D3D3D3',
  lightpink: '#FFB6C1',
  lightsalmon: '#FFA07A',
  lightseagreen: '#20B2AA',
  lightskyblue: '#87CEFA',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#B0C4DE',
  lightyellow: '#FFFFE0',
  lime: '#00FF00',
  limegreen: '#32CD32',
  linen: '#FAF0E6',
  magenta: '#FF00FF',
  maroon: '#800000',
  mediumaquamarine: '#66CDAA',
  mediumblue: '#0000CD',
  mediumorchid: '#BA55D3',
  mediumpurple: '#9370DB',
  mediumseagreen: '#3CB371',
  mediumslateblue: '#7B68EE',
  mediumspringgreen: '#00FA9A',
  mediumturquoise: '#48D1CC',
  mediumvioletred: '#C71585',
  midnightblue: '#191970',
  mintcream: '#F5FFFA',
  mistyrose: '#FFE4E1',
  moccasin: '#FFE4B5',
  navajowhite: '#FFDEAD',
  navy: '#000080',
  oldlace: '#FDF5E6',
  olive: '#808000',
  olivedrab: '#6B8E23',
  orange: '#FFA500',
  orangered: '#FF4500',
  orchid: '#DA70D6',
  palegoldenrod: '#EEE8AA',
  palegreen: '#98FB98',
  paleturquoise: '#AFEEEE',
  palevioletred: '#DB7093',
  papayawhip: '#FFEFD5',
  peachpuff: '#FFDAB9',
  peru: '#CD853F',
  pink: '#FFC0CB',
  plum: '#DDA0DD',
  powderblue: '#B0E0E6',
  purple: '#800080',
  red: '#FF0000',
  rosybrown: '#BC8F8F',
  royalblue: '#4169E1',
  saddlebrown: '#8B4513',
  salmon: '#FA8072',
  sandybrown: '#F4A460',
  seagreen: '#2E8B57',
  seashell: '#FFF5EE',
  sienna: '#A0522D',
  silver: '#C0C0C0',
  skyblue: '#87CEEB',
  slateblue: '#6A5ACD',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#FFFAFA',
  springgreen: '#00FF7F',
  steelblue: '#4682B4',
  tan: '#D2B48C',
  teal: '#008080',
  thistle: '#D8BFD8',
  tomato: '#FF6347',
  turquoise: '#40E0D0',
  violet: '#EE82EE',
  wheat: '#F5DEB3',
  white: '#FFFFFF',
  whitesmoke: '#F5F5F5',
  yellow: '#FFFF00',
  yellowgreen: '#9ACD32'
}

// 支持的伪类选择器
const cssPseudoClasses = [
  'disabled',
  'checked',
  'focus',
  'active',
  'visited',
  'autoplay',
  'selected'
]
// 'not','empty','first-child','last-child','read-only','read-write','link','visited',

// 伪元素
const cssPseudoElements = ['before', 'after', 'first-line', 'first-letter']
// 长度单位
const cssLengthUnits = ['px', '%', 'dp']
// 角度单位
const cssAngleUnits = ['deg']
// 时间单位
const cssTimeUnits = ['ms', 's']
// 日志类型
const logTypes = ['NOTE', 'WARNING', 'ERROR']
// 可能使用到本地资源的css样式
const cssUseLocalResource = [
  'mylocation',
  'mylocationIconPath',
  'backgroundImage',
  'starForeground',
  'starSecondary',
  'starBackground',
  'fontSrc'
]

const REGEXP_LENGTH = /^[-+]?[0-9]*\.?[0-9]+(.*)$/
const REGEXP_COLOR_LONG = /^#[0-9a-fA-F]{6}$/
const REGEXP_COLOR_SHORT = /^#[0-9a-fA-F]{3}$/
const REGEXP_COLOR_ALPHA_LONG = /^#[0-9a-fA-F]{8}$/
const REGEXP_COLOR_ALPHA_SHORT = /^#[0-9a-fA-F]{4}$/
const REGEXP_COLOR_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
const REGEXP_COLOR_RGBA = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/
const REGEXP_COLOR_HSL = /^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/
const REGEXP_COLOR_HSLA = /^hsla\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\d*\.?\d+)\s*\)$/
const REGEXP_ARRAYCOLORSTOP =
  /(rgba|rgb)\([0-9,.\spx%]+\)\s?[0-9-+pxdp%]*|[#]?\w+\s?[0-9+-\spxdp%]*/gi
const REGEXP_ARRAYCOLOR = /(?:.+?\s(?=[#a-zA-Z]))|.+/g
const REGEXP_INT = /^[-+]?[0-9]+$/
const REGEXP_URL = /^url\(\s*(['"]?)\s*([^'"()]+?)\s*\1\s*\)$/
const REGEXP_LOCAL = /^local\(\s*(['"]?)\s*([^'"()]+?)\s*\1\s*\)$/
// 支持 foo 或 bar , baz
const REGEXP_NAME = /^([a-zA-Z_]+[a-zA-Z0-9]*\s*,\s*)*[a-zA-Z_]+[a-zA-Z0-9]*$/
const REGEXP_TIME = /^[-+]?[0-9]*\.?[0-9]+(.*)$/
const REGEXP_PROPERTY_NAME = /^[a-zA-Z-]+[a-zA-Z0-9-]*/
/* time must have units */
const REGEXP_TIME_DURATION = /^[0-9]+\.?[0-9]*m?s/

const REGEXP_TRANSFORM_ITEM = /^([0-9a-zA-Z]+)\((.*)\)$/
const REGEXP_GRADIENT_DIRECTION = /^\s*(to|bottom|right|left|top)|[-+]?[0-9]*\.?[0-9]+(.*)/
const REGEXP_ANGLE = /^\s*[-+]?[0-9]*\.?[0-9]+(.*)/
const REGEXP_NUMBER = /^[-+]?[0-9]*\.?[0-9]+$/
const REGEXP_POSITION = /^(center|left|right|top|bottom)$/
const REGEXP_FONT_WEIGHT = /^(normal|bold|lighter|bolder)$/
const REGEXP_INT_ABS = /^[1-9]\d*$/
const REGEXP_CARET = /^(auto|transparent|currentColor)$/

// animation-timing-function cubic-bezier(<x1>, <y1>, <x2>, <y2>) x值 为 0~1：0或0.x或1，不考虑1.0
const REGEXP_CUBIC_BEZIER =
  /cubic-bezier\(\s*(0|1|0.\d+),\s*(\d+|\d+\.\d+),\s*(0|1|0.\d+),\s*(\d+|\d+\.\d+)\s*\)/
// animation-timing-function steps(number_of_steps，direction)
const REGEXP_STEPS =
  /steps\(\s*(\d+)\s*(?:,\s*(jump-start|jump-end|jump-none|jump-both|start|end))?\)/

const wrapperCached = new Map()
/**
 * 封装一个校验器，使其接受 theme. 开头的变量值
 *
 * @param {Function} validator - 校验器
 * @returns {Function}
 */
function builtInVarsWrapper(validator) {
  let cached = wrapperCached.get(validator)
  if (!cached) {
    cached = function wrappedValidator() {
      const result = validator.apply(null, arguments)
      if (!result.value && arguments[0].startsWith('theme.')) {
        result.value = arguments[0]
        result.reason = undefined
      }
      return result
    }
    wrapperCached.set(validator, cached)
  }
  return cached
}

function toCamelCase(str) {
  var re = /-(\w)/g
  return str.replace(re, function ($0, $1) {
    return $1.toUpperCase()
  })
}

const timingFunctions = [
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'cubic-bezier',
  'step-start',
  'step-end',
  'jump-start',
  'jump-end',
  'jump-none',
  'jump-both',
  'start',
  'end'
]

const validateTimingFunction = function (v) {
  const list = timingFunctions
  const index = list.indexOf(v)
  if (index >= 0) {
    return { value: v }
  }
  if (v.startsWith('cubic-bezier')) {
    const inMatch = v.match(REGEXP_CUBIC_BEZIER)
    if (!inMatch) {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR:  属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 须符合 cubic-bezier(<x1>,<y1>,<x2>,<y2>) 格式，详情请查阅文档'
          )
        }
      }
    }
    return {
      value: v
    }
  } else if (v.startsWith('steps')) {
    const inMatch = v.match(REGEXP_STEPS)
    if (!inMatch) {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR:  属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 须符合 steps(<number>,direction) 格式，详情请查阅文档'
          )
        }
      }
    }
    // direction 可缺省，默认值为 end
    const direction = inMatch[2] || 'end'
    const numOfSteps = inMatch[1]
    return {
      value: `steps(${numOfSteps}, ${direction})`
    }
  } else {
    return {
      value: null,
      reason: function reason(k, v) {
        return (
          'ERROR: 属性`' +
          camelCaseToHyphened(k) +
          '` 的值 `' +
          v +
          '` 无效 ` (有效枚举值为: `' +
          list.join('`|`') +
          '`)'
        )
      }
    }
  }
}

const validateTime = function (v) {
  v = (v || '').toString()
  const match = v.match(REGEXP_TIME)

  if (match) {
    // 尝试检查单位
    const unit = match[1]
    if (!unit) {
      return {
        value: parseFloat(v) + cssTimeUnits[0],
        reason: function reason(k) {
          return (
            'WARN: 属性 `' +
            camelCaseToHyphened(k) +
            '` 没有指定单位，默认为 `' +
            cssTimeUnits[0] +
            '`'
          )
        }
      }
    } else if (cssTimeUnits.indexOf(unit.toLowerCase()) >= 0) {
      // 如果单位合法
      return { value: v }
    } else {
      // 其余格式单位，一律默认为ms
      const time = parseFloat(v)
      return {
        value: time + cssTimeUnits[0],
        reason: function reason(k) {
          return (
            'ERROR: 属性 `' +
            camelCaseToHyphened(k) +
            '` 不支持单位 `' +
            unit +
            '`, 目前仅支持 `' +
            JSON.stringify(cssTimeUnits) +
            '`'
          )
        }
      }
    }
  }
  return {
    value: null,
    reason: function reason(k, v) {
      return 'ERROR: 属性 `' + camelCaseToHyphened(k) + '` 的值不正确 `' + v + '` (仅支持数值)'
    }
  }
}
// 灵感组件颜色值
const themeColors = [
  'uxCardColorTheme',
  'uxCardColorAccent',
  'uxCardColorPrimary',
  'uxCardColorSecondary',
  'uxCardColorSecondaryVariant',
  'uxCardColorTertiary',
  'uxCardColorQuaternary',
  'uxCardColorContainer',
  'uxCardBackground',
  'uxCardColorHue',
  'uxCardColorHueSecondary',
  'uxIconColorAccent',
  'uxIconColorPrimary',
  'uxIconColorSecondary',
  'uxIconColorBackground'
]
const validator = {
  /**
   * 整数校验
   * @param {String} v
   * @returns {*}
   */
  transition: function (v) {
    // 预处理 v
    const subStringArr = v.replace(/;$/, '').split(',').filter(Boolean)
    let value = [
      {
        n: 'transitionProperty',
        v: ''
      },
      {
        n: 'transitionTimingFunction',
        v: ''
      },
      {
        n: 'transitionDuration',
        v: ''
      },
      {
        n: 'transitionDelay',
        v: ''
      }
    ]
    // 用于处理 transition-property 包含 none 的情况
    let hasNoneProperty = false
    subStringArr.forEach((m) => {
      m = m.toString().split(' ').filter(Boolean)
      let isDuration = true
      let isProperty = true
      const defaltProperty = {
        transitionProperty: 'all',
        transitionTimingFunction: 'ease',
        transitionDuration: '0s',
        transitionDelay: '0s'
      }
      m.forEach((val) => {
        // cubic-bezier(<number>, <number>, <number>, <number>)、steps(<integer>[, <step-position>]?)不能使用全等判断
        if (timingFunctions.filter((func) => val.startsWith(func)).length) {
          return (defaltProperty.transitionTimingFunction = val)
        }
        // 第一个时间为 transitionDuration
        if (val.match(REGEXP_TIME_DURATION) && isDuration) {
          isDuration = false
          return (defaltProperty.transitionDuration = val)
        }
        if (val.match(REGEXP_TIME_DURATION) && !isDuration) {
          return (defaltProperty.transitionDelay = val)
        }
        if (val.match(REGEXP_PROPERTY_NAME) && isProperty) {
          isProperty = false
          return (defaltProperty.transitionProperty = val)
        }
      })
      Object.keys(defaltProperty).forEach((key) => {
        switch (key) {
          case 'transitionProperty': {
            if (defaltProperty[key].trim() === 'none') {
              hasNoneProperty = true
            }
            value[0].v = (value[0].v + `,${toCamelCase(defaltProperty[key])}`)
              .trim()
              .replace(/^,/, '')
            break
          }
          case 'transitionTimingFunction': {
            value[1].v = (value[1].v + `,${defaltProperty[key]}`).trim().replace(/^,/, '')
            break
          }
          case 'transitionDuration': {
            value[2].v = (value[2].v + `,${defaltProperty[key]}`).trim().replace(/^,/, '')
            break
          }
          default: {
            value[3].v = (value[3].v + `,${defaltProperty[key]}`).trim().replace(/^,/, '')
            break
          }
        }
      })
    })
    if (hasNoneProperty) {
      value = []
      return {
        value
      }
    }
    return {
      value
    }
  },
  transitionProperty: function (v) {
    return {
      value: toCamelCase(v).trim() || ['all']
    }
  },
  transitionDelay: validateTime,
  transitionDuration: validateTime,
  transitionTimingFunction: validateTimingFunction,
  /**
   * 长度值校验
   * @param v
   * @param units 支持的单位
   * @param defaultValueIfNotSupported 如果单位不准确，需要回退的默认值
   * @returns {*}
   * @constructor
   */
  length: function (v, units, defaultValueIfNotSupported) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_LENGTH)
    if (!units) {
      units = cssLengthUnits
    }

    if (match) {
      // 尝试检查单位
      const unit = match[1]
      if (+v === 0 && !unit) {
        return {
          value: +v + units[0]
        }
      } else if (!unit) {
        return {
          value: parseFloat(v) + units[0],
          reason: function reason(k) {
            return (
              'WARN: 属性 `' + camelCaseToHyphened(k) + '` 没有指定单位，默认为 `' + units[0] + '`'
            )
          }
        }
      } else if (units.indexOf(unit.toLowerCase()) >= 0) {
        // 如果单位合法
        return { value: v }
      } else {
        // 如果validator提供了其单位不合法时可以回退的默认值，则应用此默认值
        // 其余情况，一律添加px为其长度单位
        const fixedValue = defaultValueIfNotSupported || parseFloat(v) + units[0]
        return {
          value: fixedValue,
          reason: function reason(k) {
            return (
              'ERROR: 属性 `' +
              camelCaseToHyphened(k) +
              '` 不支持单位 `' +
              unit +
              '`, 目前仅支持 `' +
              JSON.stringify(units) +
              '`'
            )
          }
        }
      }
    }
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性 `' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 不正确(仅支持数值)'
      }
    }
  },
  /**
   * 颜色值校验, 支持 rgb, rgba, #fff, #ffffff, named-color #f0ff #ff00ff00
   * @param v
   * @returns {*}
   * @constructor
   */
  color: function (v) {
    v = (v || '').toString().trim()

    if (
      v.match(REGEXP_COLOR_LONG) ||
      v.match(REGEXP_COLOR_ALPHA_LONG) ||
      v.match(REGEXP_COLOR_ALPHA_SHORT)
    ) {
      return { value: v }
    }

    // 如果是#XXX，则转换为#XXXXXX
    if (v.match(REGEXP_COLOR_SHORT)) {
      return {
        value: '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
      }
    }

    // 如果颜色值为颜色名字符串
    if (colorNames[v]) {
      return {
        value: colorNames[v]
      }
    }

    // rgb/rgbag格式颜色处理
    let arrColor, r, g, b, a

    if (REGEXP_COLOR_RGB.exec(v)) {
      arrColor = REGEXP_COLOR_RGB.exec(v)
      r = parseInt(arrColor[1])
      g = parseInt(arrColor[2])
      b = parseInt(arrColor[3])
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return { value: 'rgb(' + [r, g, b].join(',') + ')' }
      }
    }

    if (REGEXP_COLOR_RGBA.exec(v)) {
      arrColor = REGEXP_COLOR_RGBA.exec(v)
      r = parseInt(arrColor[1])
      g = parseInt(arrColor[2])
      b = parseInt(arrColor[3])
      a = parseFloat(arrColor[4])
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1) {
        return { value: 'rgba(' + [r, g, b, a].join(',') + ')' }
      }
    }
    let h, s, l
    arrColor = REGEXP_COLOR_HSL.exec(v) || REGEXP_COLOR_HSLA.exec(v)
    if (arrColor) {
      h = parseInt(arrColor[1])
      s = parseInt(arrColor[2])
      l = parseInt(arrColor[3])
      a = parseFloat(arrColor[4])
      if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
        if (a >= 0 && a <= 1) {
          return { value: `hsla(${h},${s}%,${l}%,${a})` }
        }
        return { value: `hsl(${h},${s}%,${l}%)` }
      }
    }
    // 透明色
    if (v === 'transparent') {
      return { value: 'rgba(0,0,0,0)' }
    }

    // 无效颜色值
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的颜色值 `' + v + '` 无效`'
      }
    }
  },
  /**
   * 整数/浮点数校验
   * @param {String} v
   * @returns {*}
   */
  number: function (v) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_NUMBER)

    if (match && !match[1]) {
      return { value: parseFloat(v) }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 无效 ` (仅支持数值)'
      }
    }
  },
  /**
   * 数组值(整数/浮点数)校验。 例如：scale
   * @param {Array} names
   * @param {String} v
   */
  arraynumber: function (names, v) {
    v = (v || '').toString().trim()
    // 空格或逗号分隔
    const items = v.split(/[,\s]+/)

    if (items && items.length <= names.length) {
      // logType为当前日志类型在logTypes数组对应的下标
      const values = []
      let result
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        result = validator.number(it)

        // 如果校验成功，则保存转换后的属性值
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      return {
        value: logType < 2 ? splitAttr(names, values) : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },
  /**
   * 整数校验
   * @param {String} v
   * @returns {*}
   */
  integer: function (v) {
    v = (v || '').toString()

    if (v.match(REGEXP_INT)) {
      return { value: parseInt(v, 10) }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 无效 ` (仅支持整数)'
      }
    }
  },
  /**
   * animation-iteration-count校验
   * @param {String} v
   * @returns {*}
   */
  iterationcount: function (v) {
    v = (v || '').toString().trim()

    if (v.match(REGEXP_INT)) {
      return { value: parseInt(v, 10) }
    } else if (/^infinite$/.test(v)) {
      // 动画播放无限次
      return { value: -1 }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 无效 ` (仅支持整数)'
      }
    }
  },
  /**
   * url校验
   * @param v
   * @param options
   * @param options.filePath
   * @returns {*}
   */
  url: function (v, options) {
    v = (v || '').toString().trim()
    if (v.match(/^none$/i)) {
      return { value: 'none' }
    }

    const url = REGEXP_URL.exec(v)
    if (url && url[2].trim()) {
      let value = url[2]
      if (!/^data:/.test(value) && !/^http(s)?:/.test(value)) {
        // 转换为以项目源码为根的绝对路径
        value = resolvePath(value, options.filePath)
      }
      return { value: value }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return (
          'WARN: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 必须是 none 或者 url(...)'
        )
      }
    }
  },
  /**
   * @fontface中src属性校验
   * @param v
   * @param options
   * @returns {*}
   */
  fontSrc: function (v, options) {
    v = (v || '').toString().trim()
    const items = v.split(',')
    if (items && items.length > 0) {
      // logType为当前日志类型在logTypes数组对应的下标
      const values = []
      const logs = []
      let logType = 0
      items.forEach(function (item, index) {
        item = item.trim()
        let result = {}
        // 校验local(系统字体)
        if (/^local/.test(item)) {
          const local = REGEXP_LOCAL.exec(item)
          let localValue
          if (local && local[2].trim()) {
            localValue = 'local://' + local[2]
          }
          result = {
            value: localValue,
            reason: !localValue
              ? function reason(k, v) {
                  return (
                    'WARN: @font-face中属性src`' +
                    camelCaseToHyphened(k) +
                    '`的值`' +
                    v +
                    '` 存在问题'
                  )
                }
              : null
          }
        } else {
          // 校验本地或线上字体
          result = validator.url(item, options)
        }

        // 如果校验成功，则保存转换后的属性值
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), item, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      return {
        value: logType < 2 ? values : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': @font-face中属性 `' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n   ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: @font-face中属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 存在问题'
      }
    }
  },

  /**
   * fontFamily校验
   * @param v
   * @returns {*}
   */
  fontFamily: function (v) {
    v = (v || '').toString().replace(/['"]+/g, '')
    if (v) {
      return { value: v }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 存在问题'
      }
    }
  },

  /**
   * 位置校验(默认为)
   * @param v
   * @returns {*}
   */
  position: function (v, units) {
    v = (v || '').toString()
    if (!units) {
      units = cssLengthUnits
    }

    const items = v.split(/\s+|,/) // 空格或,分隔
    if (items && items.length > 1) {
      const values = []
      let result
      const logs = []
      let logType = 0
      if (items.length > 3) {
        logType = 1
        logs.push('属性数目最多为3个, 忽略多余属性')
      }

      items.forEach((it, index) => {
        result = validator.length(it, units)
        // 如果校验成功，则保存转换后的属性值
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)
          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 命名校验
   * @param {String} v
   * @returns {*}
   */
  name: function (v) {
    v = (v || '').toString()
    if (v.match(REGEXP_NAME)) {
      return { value: v }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 多属性的命名校验
   * @param {string} v
   * @param {object} validatorMap
   * @returns {*}
   */
  multipleAttributesValidator: function (v, validatorMap) {
    v = (v || '').toString().trim()
    // 转成数组
    const items = v.replace(/\)\s+/g, ')|').split('|')
    if (items && items.length) {
      const values = {}
      let result
      const logs = []
      let logType = 0
      // 逐项处理合成对象
      items.forEach((it, index) => {
        const inMatchs = it.match(REGEXP_TRANSFORM_ITEM)
        if (inMatchs) {
          let value = inMatchs[2]
          const key = inMatchs[1]
          const validator = validatorMap[key]
          if (typeof validator === 'function') {
            if (key === 'translate' && !/[,\s]+/.test(value.trim())) {
              // translate(10px) --> translateX(10px),translateY(0px)
              value += ',0px'
            }
            result = validator(value)
            // 返回值为Array
            if (result.value instanceof Array) {
              result.value.forEach((item) => {
                if (isValidValue(item.v)) {
                  values[item.n] = item.v
                }
              })
              // 返回值为number或String
            } else if (isValidValue(result.value)) {
              values[key] = result.value
            }
            if (result.reason) {
              let str = result.reason(key, value, result.value)
              // 提取日志类型
              const match = str.match(/^([A-Z]+):/)
              if (match) {
                const idx = logTypes.indexOf(match[1])
                if (logType < logTypes.indexOf(match[1])) {
                  logType = idx
                }
                str = str.replace(match[0], '').trim()
              }
              logs.push(str)
            }
          } else {
            logs.push('属性 `' + key + '` 不支持')
          }
        } else {
          logType = 2
          logs.push('属性 `' + index + '` 的值格式不正确')
        }
      })
      return {
        value: isEmptyObject(values) ? null : JSON.stringify(values),
        reason:
          logs.length > 0
            ? function (k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  background: function (v) {
    v = (v || '').toString().trim()
    // 预留接口：分解background所有参数，存入数组
    let items = v.split()
    // 处理多组渐变
    if (v.indexOf('-gradient') > 0) {
      const reg = /(repeating-linear|linear)[\s\S]*?(?=\s*(repeating|linear)|$)/g
      items = v.match(reg)
    }
    // 初始化返回对象
    const value = {
      values: []
    }
    if (items && items.length) {
      const logs = []
      let logType = 0
      // 逐项处理，校验后的值存入value
      items.forEach((it) => {
        let key
        let validator

        // 参数分类处理
        // 参数为(repeating-)?linear-gradient(xxx)
        if (it.indexOf('-gradient') >= 0) {
          // (repeating-)?linear-gradient(xxx)按同一种模式校验
          key = it.indexOf('repeating') >= 0 ? 'repeatingLinearGradient' : 'linearGradient'
          validator = backgroundValidatorMap[key]
        }

        if (typeof validator === 'function') {
          const result = validator(it)
          // 如果校验成功，则保存转换后的属性值
          if (isValidValue(result.value)) {
            const parseObj = JSON.parse(result.value)
            value.values.push(parseObj)
          }
          if (result.reason) {
            let str = result.reason(key, it, result.value)
            // 提取日志类型
            const match = str.match(/^([A-Z]+):/)
            if (match) {
              const idx = logTypes.indexOf(match[1])
              if (logType < logTypes.indexOf(match[1])) {
                logType = idx
              }
              str = str.replace(match[0], '').trim()
            }
            logs.push(str)
          }
        } else {
          logType = 2
          logs.push('背景类型 `' + it + '`暂不支持')
        }
      })

      return {
        value: logType < 2 ? JSON.stringify(value) : null,
        reason:
          logs.length > 0
            ? function (k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  backgroundSize: function (v, units) {
    v = (v || '').toString().trim()
    if (!units) {
      units = cssLengthUnits
    }
    let str
    let result
    let logType = 0
    const items = v.split(/\s+/)
    if (items.length === 1) {
      if (['cover', 'contain', 'auto'].indexOf(items[0]) > -1) return { value: items[0] }

      result = validator.length(items[0], units)
      if (result.reason) {
        str = result.reason('0', items[0], result.value)
        const match = str.match(/^([A-Z]+):/)
        if (match) {
          logType = logTypes.indexOf(match[1])
          str = str.replace(match[0], '').trim()
        }
      }
      return {
        value: isValidValue(result.value) ? result.value : null,
        reason: str
          ? function reason(k, v) {
              return (
                logTypes[logType] +
                ': 属性`' +
                camelCaseToHyphened(k) +
                '` 的值 `' +
                v +
                '` 存在问题: \n  ' +
                str
              )
            }
          : null
      }
    } else if (items.length === 2) {
      const values = []
      const logs = []
      items.forEach((it, index) => {
        if (it === 'auto') {
          values.push(it)
          return
        }

        // 如果校验成功，则保存转换后的属性值
        result = validator.length(it, units)
        if (isValidValue(result.value)) {
          values.push(result.value)
        }
        if (result.reason) {
          str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)
          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < idx) logType = idx

            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // 匹配不成功，格式错误
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  backgroundPosition: function (v, units) {
    v = (v || '').toString().trim()
    if (!units) {
      units = cssLengthUnits
    }
    let str
    let result
    let logType = 0
    let values = []
    const logs = []
    const items = v.split(/\s+/)
    if (items.length === 1) {
      if (REGEXP_POSITION.test(items[0])) return { value: items[0] }

      result = validator.length(items[0], units)
      if (result.reason) {
        str = result.reason('0', items[0], result.value)
        const match = str.match(/^([A-Z]+):/)
        if (match) {
          logType = logTypes.indexOf(match[1])
          str = str.replace(match[0], '').trim()
        }
      }
      return {
        value: isValidValue(result.value) ? result.value : null,
        reason: str
          ? function reason(k, v) {
              return (
                logTypes[logType] +
                ': 属性`' +
                camelCaseToHyphened(k) +
                '` 的值 `' +
                v +
                '` 存在问题: \n  ' +
                str
              )
            }
          : null
      }
    } else if (items.length === 2) {
      const val1 = items[0]
      const val2 = items[1]

      if (val1 === 'center') {
        // 第一个值为 center是，第二个值可以是 center, top，right，left，bottom，px，%
        if (REGEXP_POSITION.test(val2)) {
          values = items
        } else {
          result = validator.length(val2, units)
          if (isValidValue(result.value)) {
            values = items
          }

          if (result.reason) {
            str = result.reason('1', val2, result.value)
            const match = str.match(/^([A-Z]+):/)
            if (match) {
              const idx = logTypes.indexOf(match[1])
              if (logType < idx) logType = idx

              str = str.replace(match[0], '').trim()
            }
            logs.push(str)
          }
        }
      } else if (
        ['top', 'bottom'].indexOf(val1) > -1 &&
        ['left', 'right', 'center'].indexOf(val2) > -1
      ) {
        // 第一个值为 top/bottom，第二个值可以是 left/right/center
        values = items
      } else {
        // 第一个值为 px／%／left／right ，第二个值可以是 px/%/top/bottom/center
        result = validator.length(val1, units)
        if (['left', 'right'].indexOf(val1) > -1 || isValidValue(result.value)) {
          if (['top', 'bottom', 'center'].indexOf(val2) > -1) {
            values = items
          } else {
            result = validator.length(val2, units)
            if (isValidValue(result.value)) {
              values = items
            }
            if (result.reason) {
              str = result.reason('1', val2, result.value)
              const match = str.match(/^([A-Z]+):/)
              if (match) {
                const idx = logTypes.indexOf(match[1])
                if (logType < idx) logType = idx

                str = str.replace(match[0], '').trim()
              }
              logs.push(str)
            }
          }
        }
      }
      if (!values.length) {
        logType = 2
        if (!logs.length) logs.push('属性值格式不正确')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    } else if (items.length === 3) {
      const val1 = items[0]
      const val2 = items[1]
      const val3 = items[2]

      if (REGEXP_POSITION.test(val1)) {
        if (
          (REGEXP_POSITION.test(val2) && isValidValue(validator.length(val3, units).value)) ||
          (REGEXP_POSITION.test(val3) && isValidValue(validator.length(val2, units).value))
        ) {
          values = items
        }
      }
      if (!values.length) {
        logType = 2
        if (!logs.length) logs.push('属性值格式不正确')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    } else if (items.length === 4) {
      const val1 = items[0]
      const val2 = items[1]
      const val3 = items[2]
      const val4 = items[3]

      if (
        REGEXP_POSITION.test(val1) &&
        REGEXP_POSITION.test(val3) &&
        isValidValue(validator.length(val2, units).value) &&
        isValidValue(validator.length(val4, units).value)
      ) {
        values = items
      }
      if (!values.length) {
        logType = 2
        if (!logs.length) logs.push('属性值格式不正确')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // 匹配不成功，格式错误
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  fontWeight: function (v, units) {
    v = (v || '').toString().trim()

    if (REGEXP_FONT_WEIGHT.test(v) || REGEXP_INT_ABS.test(v)) return { value: v }
    else
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: 属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 格式不正确，仅支持normal,bold,lighter,bolder或正整数'
          )
        }
      }
  },
  /**
   * 属性校验
   * @param v
   * @returns {*}
   */
  linearGradient: function (v) {
    v = (v || '').toString().trim()
    // 初始化返回对象格式
    const result = {
      type: '',
      directions: ['to', 'bottom'], // 默认从上到下
      values: []
    }

    let objcolor = {}
    let objdirection = {}
    const logs = []
    let logType = 0
    // 分离(repeating-)linear-gradient函数名与参数
    const inMatchs = v.match(/^([0-9a-zA-Z-]+)\(([\s\S]*)\)/)
    if (inMatchs) {
      const key = hyphenedToCamelCase(inMatchs[1])
      result.type = key // type类型
      const valueList = inMatchs[2].split(/,/)

      // 校验direction或angle部分(非必要参数)
      if (REGEXP_GRADIENT_DIRECTION.test(valueList[0])) {
        let directionValidator
        // direction
        if (/(to|bottom|right|left|top)/.test(valueList[0])) {
          directionValidator = backgroundValidatorMap['linearGradientDirection']
          // angle
        } else if (valueList[0].match(REGEXP_ANGLE)) {
          directionValidator = backgroundValidatorMap['linearGradientAngle']
        }

        if (typeof directionValidator === 'function') {
          objdirection = directionValidator(valueList[0])
          // 分离direction或angle，剩下color-stop部分
          valueList.splice(0, 1)
          if (isValidValue(objdirection.value)) {
            result.directions = objdirection.value.split(/\s+/)
          }
          if (objdirection.reason) {
            let str = objdirection.reason(key, valueList[0], objdirection.value)
            if (str) {
              const match = str.match(/^([A-Z]+):/)
              if (match) {
                const idx = logTypes.indexOf(match[1])
                if (logType < logTypes.indexOf(match[1])) {
                  logType = idx
                }
                str = str.replace(match[0], '').trim()
              }
              logs.push(str)
            }
          }
        }
      }

      // 校验color-stop部分
      if (valueList.length > 0) {
        const validator = backgroundValidatorMap['linearGradientColor']
        objcolor = validator(valueList)
        if (isValidValue(objcolor.value)) {
          result.values = JSON.parse(objcolor.value)
        }
        if (objcolor.reason) {
          let str = objcolor.reason(key, valueList, objcolor.value)
          if (str) {
            const match = str.match(/^([A-Z]+):/)
            if (match) {
              const idx = logTypes.indexOf(match[1])
              if (logType < logTypes.indexOf(match[1])) {
                logType = idx
              }
              str = str.replace(match[0], '').trim()
            }
            logs.push(str)
          }
        }
      } else {
        logType = 2
        logs.push('参数 `' + v + '`缺少过渡颜色')
      }

      return {
        value: logType < 2 ? JSON.stringify(result) : null,
        reason:
          logs.length > 0
            ? function (k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // 匹配不成功，格式错误
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },
  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  time: validateTime,

  /**
   * 角度校验
   * @param v
   * @returns {*}
   */
  angle: function (v) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_ANGLE)

    if (match) {
      // 尝试检查单位
      const unit = match[1]
      if (!unit) {
        return {
          value: parseFloat(v) + cssAngleUnits[0],
          reason: function reason(k) {
            return (
              'WARN: 属性 `' +
              camelCaseToHyphened(k) +
              '` 没有指定单位，默认为 `' +
              cssAngleUnits[0] +
              '`'
            )
          }
        }
      } else if (cssAngleUnits.indexOf(unit.toLowerCase()) >= 0) {
        // 如果单位合法
        return { value: v }
      } else {
        // 其余格式单位，一律默认为ms
        let msv = parseFloat(v)
        // TODO: 暂时实现rad到deg的转换
        if (unit.toLowerCase() === 'rad') {
          msv = Math.round((msv * 180) / Math.PI)
          return {
            value: msv + cssAngleUnits[0],
            reason: function reason(k) {
              return (
                'WARN: 属性 `' +
                camelCaseToHyphened(k) +
                '` 不支持单位 `' +
                unit +
                '`, 自动转换为 `' +
                cssAngleUnits[0] +
                '`'
              )
            }
          }
        }

        return {
          value: msv + cssAngleUnits[0],
          reason: function reason(k) {
            return (
              'ERROR: 属性 `' +
              camelCaseToHyphened(k) +
              '` 不支持单位 `' +
              unit +
              '`, 目前仅支持 `' +
              JSON.stringify(cssAngleUnits) +
              '`'
            )
          }
        }
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性 `' + camelCaseToHyphened(k) + '` 的值不正确 `' + v + '` (仅支持数值)'
      }
    }
  },

  /**
   * 枚举值校验
   * @param list
   * @param v
   * @returns {*}
   */
  enum: function (list, v) {
    const index = list.indexOf(v)
    if (index > 0) {
      return { value: v }
    }
    if (index === 0) {
      return {
        value: v,
        // 关闭默认值的提示
        reason:
          false &&
          function reason(k, v) {
            return (
              'NOTE:  属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 是缺省值(可以忽略不写)'
            )
          }
      }
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: 属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 无效 ` (有效枚举值为: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
  },

  /**
   * 动画速度曲线枚举值校验
   * @param list
   * @param v
   * @returns {*}
   */
  animationTimingFunction: validateTimingFunction,

  /**
   * gradient方向校验
   * @param v
   * @returns {*}
   * @constructor
   */
  gradientdirection: function (v) {
    v = (v || '').toString().trim()
    // 空格分开的字符串转化为数组
    const items = v.split(/\s+/)
    let mismatch = []
    const arr = []
    items.forEach((it) => {
      if (it === 'to') {
        arr.push(0)
      } else if ((it === 'top') | (it === 'bottom')) {
        arr.push(1)
      } else if ((it === 'left') | (it === 'right')) {
        arr.push(2)
      } else {
        // 出现(to|left|top|right|bottom)以外的参数
        mismatch.push(it)
      }
    })

    if (mismatch.length === 0 && arr.length > 1 && arr.length < 4) {
      if (arr[0] === 0 && arr[1] !== 0) {
        // 存在第三个参数
        if (arr[2]) {
          // 非相邻组合或第三个参数为‘to’
          if (arr[1] + arr[2] !== 3) {
            mismatch = items
          }
        }
      } else {
        mismatch = items
      }
    } else {
      mismatch = items
    }

    return {
      value: mismatch.length > 0 ? null : items.join(' '),
      reason:
        mismatch.length > 0
          ? function reason(k) {
              return (
                'ERROR:  属性`' +
                camelCaseToHyphened(k) +
                '` 的属性值 `' +
                mismatch.join(' ') +
                '` 格式不正确 `)'
              )
            }
          : null
    }
  },
  /**
   * 整数、auto 长度校验
   * @param {String} v
   * @param {Array} units - 支持的单位
   * @returns {*}
   */
  multipleLength: function (v, units) {
    v = (v || '').toString().trim()
    if (v === 'auto') {
      return { value: v }
    } else if (/^[-+]?[0-9]+.*/.test(v)) {
      return validator.length(v, units)
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 的值不正确'
        }
      }
    }
  },
  /**
   * 数组长度值校验, 包括padding, margin, border-width, translate
   * @param {String} v
   * @param {Array} units - 支持的单位
   * @returns {*}
   */
  arraylength: function (names, v, units) {
    v = (v || '').toString().trim()
    // 空格或逗号分隔
    const items = v.split(/[,\s]+/)

    if (items && items.length <= names.length) {
      // logType为当前日志类型在logTypes数组对应的下标
      const values = []
      let result
      const logs = []
      let logType = 0
      // 是否为margin-* 类型的样式属性
      const isMultipleLength = /^margin.*/.test(names[0])

      items.forEach((it, index) => {
        if (isMultipleLength) {
          result = validator.multipleLength(it, units)
        } else {
          result = validator.length(it, units)
        }
        // 如果校验成功，则保存转换后的属性值
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })
      return {
        value: logType < 2 ? splitAttr(names, values) : null,
        reason:
          logs.length > 0
            ? function reason(k) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 数组颜色值校验, 包括border-color
   * @param v
   * @returns {*}
   * @constructor
   */
  arraycolor: function (names, v) {
    v = (v || '').toString()
    const items = v.match(REGEXP_ARRAYCOLOR)

    if (items && items.length <= 4) {
      // logType为当前日志类型在logTypes数组对应的下标
      const values = []
      let result
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        result = validator.color(it)

        // 如果校验成功，则保存转换后的属性值
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      return {
        value: logType < 2 ? splitAttr(names, values) : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * 渐变参数color-stop值校验, 渐变宽度、百分比
   * @param v
   * @returns {*}
   */
  arraycolorstop: function (v) {
    v = (v || '').toString().trim()
    // 匹配color-stop组合
    const items = v.match(REGEXP_ARRAYCOLORSTOP)

    // 至少指定两种颜色
    if (items && items.length > 1) {
      const value = []
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        // 匹配stop部分
        const arrstop = it.match(/[\s]+[-+0-9]+(px|%|dp)?$/)
        // 存放color与stop校验后的值
        const groupvalue = []

        // 校验stop部分
        if (arrstop) {
          const objstop = validator.length(arrstop[0])
          const num = it.indexOf(arrstop[0])
          // 得到color部分
          it = it.substring(0, num)
          if (isValidValue(objstop.value)) {
            groupvalue.push(objstop.value)
          }

          if (objstop.reason) {
            let str = objstop.reason(index.toString(), arrstop[0], objstop.value)
            // 提取日志类型
            const match = str.match(/^([A-Z]+):/)
            if (match) {
              const idx = logTypes.indexOf(match[1])
              if (logType < logTypes.indexOf(match[1])) {
                logType = idx
              }
              str = str.replace(match[0], '').trim()
            }
            logs.push(str)
          }
        }

        if (it) {
          const objcolor = validator.color(it)
          // 如果校验成功，则保存转换后的属性值
          if (isValidValue(objcolor.value)) {
            // 校验后的color放到stop之前前
            groupvalue.unshift(objcolor.value)
          }

          // 存入校验后的color-stop值
          value.push(groupvalue.join(' '))
          if (objcolor.reason) {
            let str = objcolor.reason(index.toString(), it, objcolor.value)
            // 提取日志类型
            const match = str.match(/^([A-Z]+):/)
            if (match) {
              const idx = logTypes.indexOf(match[1])
              if (logType < logTypes.indexOf(match[1])) {
                logType = idx
              }
              str = str.replace(match[0], '').trim()
            }
            logs.push(str)
          }
        } else {
          logType = 2
          logs.push('参数 `' + v + '` 格式不正确')
        }
      })

      return {
        value: logType < 2 ? JSON.stringify(value) : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return (
          'ERROR: 属性`' +
          camelCaseToHyphened(k) +
          '` 的值 `' +
          v +
          '` 格式不正确，至少指定两种颜色'
        )
      }
    }
  },

  /**
   * mylocation校验: mylocation
   * @param v
   * @param units 支持的单位
   * @returns {*}
   * @constructor
   */
  mylocation: function (v, options) {
    v = (v || '').toString()
    // 空格分隔
    const items = v.split(/\s+/)

    if (items && items.length <= 3) {
      // logType为当前日志类型在logTypes数组对应的下标，typeList记录简写属性对应的类别数组
      const values = []
      let result
      const logs = []
      let logType = 0
      const typeList = []
      let prevType = -1

      items.forEach((it, index) => {
        // 检测简写属性值的合法性，如果校验成功，则保存转换后的属性值和类别
        if (isValidValue(validator.color(it).value)) {
          // 前两个值都是颜色
          typeList.push(index)
          if (index === 0) {
            // 如果只有一个颜色，就按照顺序分给mylocationFillColor
            result = validatorMap['mylocationFillColor'](it)
            values.push({
              n: 'mylocationFillColor',
              v: result.value
            })
          } else if (index === 1) {
            result = validatorMap['mylocationStrokeColor'](it)
            values.push({
              n: 'mylocationStrokeColor',
              v: result.value
            })
          }
        } else if (isValidValue(validator.url(it, options).value)) {
          typeList.push(2)
          result = validatorMap['mylocationIconPath'](it, options)
          values.push({
            n: 'mylocationIconPath',
            v: result.value
          })
        } else {
          result = {}
          logType = 2
          logs.push(
            '属性`' +
              index +
              '` 的值 `' +
              it +
              '` 存在问题: \n  不满足fillColor、strokeColor和iconPath的检验标准'
          )
        }

        if (result && result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      // 检测简写属性值中width、style和color的顺序是否符合标准
      typeList.forEach((it) => {
        if (it > prevType) {
          prevType = it
        } else {
          logType = 2
          logs.push('必须按顺序设置属性fillColor、strokeColor和iconPath')
        }
      })

      return {
        value: logType < 2 ? values : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  /**
   * border校验: border
   * @param v
   * @param units 支持的单位
   * @param position 具体的位置
   * @returns {*}
   * @constructor
   */
  border: function (v, units, position) {
    v = (v || '').toString()

    // 处理颜色内有逗号分割的情况
    v = v.replace(/\s*,\s*/g, ',')
    position = (position || '').toString()
    // 空格分隔
    const items = v.split(/\s+/)

    if (items && items.length <= 3) {
      // logType为当前日志类型在logTypes数组对应的下标，typeList记录简写属性对应的类别数组
      let values = []
      let result
      const logs = []
      let logType = 0
      const typeList = []
      let prevType = -1

      items.forEach((it, index) => {
        // 检测简写属性值的合法性，区分值为width、style和color的情况,如果校验成功，则保存转换后的属性值和类别
        if (isValidValue(validator.length(it, units).value)) {
          typeList.push(0)
          const selName = 'border' + position + 'Width'
          result = validatorMap[selName](it)
          if (result.value instanceof Array) {
            values = values.concat(result.value)
          } else if (position && isValidValue(result.value)) {
            values.push({
              n: selName,
              v: result.value
            })
          }
        } else if (isValidValue(validatorMap['borderStyle'](it).value)) {
          typeList.push(1)
          result = validatorMap['borderStyle'](it)
          values.push({
            n: 'border' + position + 'Style',
            v: it
          })
        } else if (isValidValue(validator.color(it).value)) {
          typeList.push(2)
          const selName = 'border' + position + 'Color'
          result = validatorMap[selName](it)
          if (result.value instanceof Array) {
            values = values.concat(result.value)
          } else if (position && isValidValue(result.value)) {
            values.push({
              n: selName,
              v: result.value
            })
          }
        } else {
          result = {}
          logType = 2
          logs.push(
            '属性`' +
              index +
              '` 的值 `' +
              it +
              '` 存在问题: \n  不满足width、style和color的检验标准'
          )
        }

        if (result && result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // 提取日志类型
          const match = str.match(/^([A-Z]+):/)

          if (match) {
            const idx = logTypes.indexOf(match[1])
            if (logType < logTypes.indexOf(match[1])) {
              logType = idx
            }
            str = str.replace(match[0], '').trim()
          }
          logs.push(str)
        }
      })

      // 检测简写属性值中width、style和color的顺序是否符合标准
      typeList.forEach((it) => {
        if (it > prevType) {
          prevType = it
        } else {
          logType = 2
          logs.push('必须按顺序设置属性width style color')
        }
      })

      return {
        value: logType < 2 ? values : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': 属性`' +
                  camelCaseToHyphened(k) +
                  '` 的值 `' +
                  v +
                  '` 存在问题: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: 属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 格式不正确'
      }
    }
  },

  borderLeft: function (v, units) {
    return validator.border(v, units, 'Left')
  },
  borderRight: function (v, units) {
    return validator.border(v, units, 'Right')
  },
  borderTop: function (v, units) {
    return validator.border(v, units, 'Top')
  },
  borderBottom: function (v, units) {
    return validator.border(v, units, 'Bottom')
  },
  /**
   * display兼容性'block'校验
   * @param v
   * @returns {*}
   * @constructor
   */
  display: function (v) {
    v = (v || '').toString()
    const list = ['flex', 'none']
    const index = list.indexOf(v)
    if (index > 0) {
      return { value: v }
    }
    if (v === 'block') {
      return {
        value: 'flex',
        reason: function reason(k, v) {
          return (
            'ERROR: 属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 需修改为flex ` (有效枚举值为: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
    if (index === 0) {
      return {
        value: v,
        // 关闭默认值的提示
        reason:
          false &&
          function reason(k, v) {
            return (
              'NOTE:  属性`' + camelCaseToHyphened(k) + '` 的值 `' + v + '` 是缺省值(可以忽略不写)'
            )
          }
      }
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: 属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 无效 ` (有效枚举值为: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
  },

  /**
   * 命名校验
   * @param v
   * @returns {*}
   */
  caretColor: function (v, units) {
    v = (v || '').toString().trim()

    if (REGEXP_CARET.test(v) || isValidValue(validator.color(v).value)) return { value: v }
    else
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: 属性`' +
            camelCaseToHyphened(k) +
            '` 的值 `' +
            v +
            '` 格式不正确，仅支持auto,currentColor,transparent或<color>'
          )
        }
      }
  }
}

/**
 * 为各个 validator 加上放行 theme 开头属性校验器
 */
function addBuiltInVarsWrapper() {
  for (const key in validator) {
    const validatorFn = validator[key]
    const noNeed = ['arraynumber', 'arraylength', 'arraycolor', 'arraycolorstop', 'enum']
    if (typeof validatorFn === 'function' && noNeed.indexOf(key) === -1) {
      validator[key] = builtInVarsWrapper(validatorFn)
    }
  }
}

addBuiltInVarsWrapper()

/**
 * 生成指定单位的长度校验函数
 * @param units  单位值
 * @param defaultValueIfNotSupported 如果单位不准确，需要回退的默认值
 * @param value 样式的长度值
 * @returns {validator_length}
 */
function _lengthValidator(units, defaultValueIfNotSupported, value) {
  return validator.length(value, units, defaultValueIfNotSupported)
}

function makeLengthValidator(units, defaultValueIfNotSupported) {
  return _lengthValidator.bind(null, units, defaultValueIfNotSupported)
}

// 同时校验多个属性值的函数，如transform，filter属性
function _multipleAttributesValidator(list, v) {
  return validator.multipleAttributesValidator(v, list)
}
function makeMultipleAttributesValidator(validatorMap) {
  return _multipleAttributesValidator.bind(null, validatorMap)
}

/**
 * 生成枚举类型校验函数
 * @param list
 * @returns {validator_enum}
 */
function makeEnumValidator(list) {
  return builtInVarsWrapper(validator.enum.bind(null, list))
}

/**
 * 生成指定类型的简写属性校验函数
 * @param type  简写属性校验函数类型
 * @param list  拆分后的样式名数组
 * @returns {validator_$type}
 */
function makeAbbrAttrValidator(type, list) {
  return builtInVarsWrapper(validator[type].bind(null, list))
}

// background属性校验表
const backgroundValidatorMap = {
  linearGradient: validator.linearGradient,
  repeatingLinearGradient: validator.linearGradient,
  linearGradientColor: validator.arraycolorstop,
  linearGradientAngle: validator.angle,
  linearGradientDirection: validator.gradientdirection
}

const transformValidatorMap = {
  translate: makeAbbrAttrValidator('arraylength', ['translateX', 'translateY', 'translateZ']),
  translateX: validator.length,
  translateY: validator.length,
  translateZ: validator.length,
  scale: makeAbbrAttrValidator('arraynumber', ['scaleX', 'scaleY', 'scaleZ']),
  scaleX: validator.number,
  scaleY: validator.number,
  scaleZ: validator.number,
  rotate: validator.angle,
  rotateX: validator.angle,
  rotateY: validator.angle,
  rotateZ: validator.angle
}

// css filter 支持的滤镜，现在只支持blur函数
const filterValidatorMap = {
  blur: makeLengthValidator(['px', 'dp'], '0px')
}

// CSS属性校验器映射表
const validatorMap = {
  // boxModel
  transition: validator.transition,
  transitionProperty: validator.transitionProperty,
  transitionDelay: validator.transitionDelay,
  transitionDuration: validator.transitionDuration,
  transitionTimingFunction: validateTimingFunction,
  width: validator.length,
  height: validator.length,
  minHeight: validator.length,
  minWidth: validator.length,
  maxHeight: validator.length,
  maxWidth: validator.length,
  padding: makeAbbrAttrValidator('arraylength', [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft'
  ]),
  paddingLeft: validator.length,
  paddingRight: validator.length,
  paddingTop: validator.length,
  paddingBottom: validator.length,
  margin: makeAbbrAttrValidator('arraylength', [
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft'
  ]),
  marginLeft: validator.multipleLength,
  marginRight: validator.multipleLength,
  marginTop: validator.multipleLength,
  marginBottom: validator.multipleLength,
  border: validator.border,
  borderLeft: validator.borderLeft,
  borderRight: validator.borderRight,
  borderTop: validator.borderTop,
  borderBottom: validator.borderBottom,
  borderWidth: makeAbbrAttrValidator('arraylength', [
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth'
  ]),
  borderLeftWidth: validator.length,
  borderTopWidth: validator.length,
  borderRightWidth: validator.length,
  borderBottomWidth: validator.length,
  borderColor: makeAbbrAttrValidator('arraycolor', [
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor'
  ]),
  borderLeftColor: validator.color,
  borderTopColor: validator.color,
  borderRightColor: validator.color,
  borderBottomColor: validator.color,
  borderStyle: makeEnumValidator(['solid', 'dotted', 'dashed']),
  borderRadius: validator.length,
  borderBottomLeftRadius: validator.length,
  borderBottomRightRadius: validator.length,
  borderTopLeftRadius: validator.length,
  borderTopRightRadius: validator.length,
  indicatorSize: validator.length,
  indicatorTop: validator.length,
  indicatorRight: validator.length,
  indicatorBottom: validator.length,
  indicatorLeft: validator.length,
  filter: makeMultipleAttributesValidator(filterValidatorMap),
  overflow: makeEnumValidator(['hidden', 'visible']),
  // flexbox
  flex: validator.number,
  flexGrow: validator.number,
  flexShrink: validator.number,
  flexBasis: validator.length,
  flexDirection: makeEnumValidator(['row', 'column', 'row-reverse', 'column-reverse']),
  flexWrap: makeEnumValidator(['nowrap', 'wrap', 'wrap-reverse']),
  justifyContent: makeEnumValidator([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around'
  ]),
  alignItems: makeEnumValidator(['stretch', 'flex-start', 'flex-end', 'center']),
  alignContent: makeEnumValidator([
    'stretch',
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around'
  ]),
  alignSelf: makeEnumValidator(['auto', 'flex-start', 'flex-end', 'center', 'baseline', 'stretch']),
  // position
  position: makeEnumValidator(['static', 'fixed', 'relative', 'absolute']),
  top: validator.length,
  bottom: validator.length,
  left: validator.length,
  right: validator.length,
  zIndex: validator.integer,
  // common
  opacity: validator.number,
  background: validator.background,
  backgroundColor: validator.color,
  backgroundImage: validator.url,
  backgroundSize: validator.backgroundSize,
  backgroundRepeat: makeEnumValidator(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']),
  backgroundPosition: validator.backgroundPosition,
  display: validator.display,
  visibility: makeEnumValidator(['visible', 'hidden']),
  objectFit: makeEnumValidator(['fill', 'contain', 'cover', 'none', 'scale-down']),
  altObjectFit: makeEnumValidator(['fill', 'contain', 'cover', 'none', 'scale-down']),
  // text
  lines: validator.integer,
  color: validator.color,
  fontSize: validator.length,
  fontStyle: makeEnumValidator(['normal', 'italic']),
  fontWeight: validator.fontWeight,
  textDecoration: makeEnumValidator(['none', 'underline', 'line-through']),
  textAlign: makeEnumValidator(['left', 'center', 'right', 'justify']),
  lineHeight: validator.length,
  textOverflow: makeEnumValidator(['clip', 'ellipsis']),
  textIndent: makeLengthValidator(['px', 'dp', 'cm', '%', 'em']),
  // animation
  transform: makeMultipleAttributesValidator(transformValidatorMap),
  transformOrigin: validator.position,
  animationName: validator.name,
  animationDuration: validator.time,
  animationTimingFunction: validateTimingFunction,
  pageAnimationName: validator.name,
  pageTransformOrigin: validator.position,
  animationDelay: validator.time,
  animationIterationCount: validator.iterationcount,
  animationFillMode: makeEnumValidator(['none', 'forwards']),
  animationDirection: makeEnumValidator(['normal', 'reverse', 'alternate', 'alternate-reverse']),
  // custom
  placeholderColor: validator.color,
  selectedColor: validator.color,
  textColor: validator.color,
  timeColor: validator.color,
  textHighlightColor: validator.color,
  strokeWidth: validator.length,
  progressColor: validator.color,
  indicatorColor: validator.color,
  indicatorSelectedColor: validator.color,
  slideWidth: validator.length,
  slideMargin: validator.length,
  resizeMode: makeEnumValidator(['cover', 'contain', 'stretch', 'center']),
  columns: validator.number,
  columnSpan: validator.number,
  maskColor: validator.color,
  blockColor: validator.color,
  mylocation: validator.mylocation,
  mylocationFillColor: validator.color,
  mylocationStrokeColor: validator.color,
  mylocationIconPath: validator.url,
  caretColor: validator.caretColor,
  thumbColor: validator.color,
  trackColor: validator.color,
  layerColor: validator.color,
  layoutType: makeEnumValidator(['grid', 'stagger']),
  // custom style
  starBackground: validator.url,
  starForeground: validator.url,
  starSecondary: validator.url,
  // font
  fontSrc: validator.fontSrc,
  fontFamily: validator.fontFamily,
  themeColor: makeEnumValidator(themeColors),
  themeBackgroundColor: makeEnumValidator(themeColors),
  themeLayerColor: makeEnumValidator(themeColors),
  themeThumbColor: makeEnumValidator(themeColors),
  themeTrackColor: makeEnumValidator(themeColors),
  themeSelectColor: makeEnumValidator(themeColors),
  themeBlockColor: makeEnumValidator(themeColors)
}

/**
 * 校验CSS属性
 * @param name
 * @param value
 * @param options
 * @param options.filePath 当前文件路径
 * @returns {{value: *, log: *}}
 */
function validate(name, value, options) {
  let result, log
  const validator = validatorMap[name]

  if (typeof validator === 'function') {
    if (typeof value !== 'function' && value.indexOf('function') < 0) {
      if (mightReferlocalResource(name)) {
        result = validator(value, options)
      } else {
        result = validator(value)
      }
    } else {
      // 如果样式值是函数，则跳过校验
      result = { value: value }
    }

    if (result.reason) {
      log = { reason: result.reason(name, value, result.value) }
    }
  } else {
    // 如果没有类型校验器, 未知样式
    result = { value: value }
    log = { reason: 'WARN: 样式名`' + camelCaseToHyphened(name) + '`不支持' }
  }

  return {
    value: result.value instanceof Array ? result.value : [{ n: name, v: result.value }],
    log: log
  }
}

/**
 * @param name
 * @desc 判断可能引用本地资源的css样式
 */
function mightReferlocalResource(name) {
  return cssUseLocalResource.indexOf(name) > -1
}

function validatePseudoClass(cls) {
  cls = cls.replace(/^(:)/, '')
  return cssPseudoClasses.indexOf(cls.toLowerCase()) >= 0
}

function validatePseudoElement(elm) {
  elm = elm.replace(/^(:)/, '')
  return cssPseudoElements.indexOf(elm.toLowerCase()) >= 0
}

module.exports = {
  colorNames: colorNames,
  validatorMap: validatorMap,
  validator: validator,
  validate: validate,
  validatePseudoClass: validatePseudoClass,
  validatePseudoElement: validatePseudoElement,
  enumValidatorFactory: makeEnumValidator,
  mightReferlocalResource: mightReferlocalResource
}
