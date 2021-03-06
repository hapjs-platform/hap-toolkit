/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
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

// ????????????????????????
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

// ?????????
const cssPseudoElements = ['before', 'after', 'first-line', 'first-letter']
// ????????????
const cssLengthUnits = ['px', '%', 'dp']
// ????????????
const cssAngleUnits = ['deg']
// ????????????
const cssTimeUnits = ['ms', 's']
// ????????????
const logTypes = ['NOTE', 'WARNING', 'ERROR']
// ??????????????????????????????css??????
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
const REGEXP_COLOR_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/
const REGEXP_COLOR_RGBA = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d*\.?\d+)\s*\)$/
const REGEXP_COLOR_HSL = /^hsl\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*\)$/
const REGEXP_COLOR_HSLA = /^hsla\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*,\s*(\d*\.?\d+)\s*\)$/
const REGEXP_ARRAYCOLORSTOP = /(rgba|rgb)\([0-9,.\spx%]+\)\s?[0-9-+pxdp%]*|[#]?\w+\s?[0-9+-\spxdp%]*/gi
const REGEXP_ARRAYCOLOR = /(?:.+?\s(?=[#a-zA-Z]))|.+/g
const REGEXP_INT = /^[-+]?[0-9]+$/
const REGEXP_URL = /^url\(\s*(['"]?)\s*([^'"()]+?)\s*\1\s*\)$/
const REGEXP_LOCAL = /^local\(\s*(['"]?)\s*([^'"()]+?)\s*\1\s*\)$/
// ?????? foo ??? bar , baz
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

// animation-timing-function cubic-bezier(<x1>, <y1>, <x2>, <y2>) x??? ??? 0~1???0???0.x???1????????????1.0
const REGEXP_CUBIC_BEZIER = /cubic-bezier\(\s*(0|1|0.\d+),\s*(\d+|\d+\.\d+),\s*(0|1|0.\d+),\s*(\d+|\d+\.\d+)\s*\)/
// animation-timing-function steps(number_of_steps???direction)
const REGEXP_STEPS = /steps\(\s*(\d+)\s*(?:,\s*(jump-start|jump-end|jump-none|jump-both|start|end))?\)/

function toCamelCase(str) {
  var re = /-(\w)/g
  return str.replace(re, function($0, $1) {
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

const validateTimingFunction = function(v) {
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
            'ERROR:  ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ????????? cubic-bezier(<x1>,<y1>,<x2>,<y2>) ??????????????????????????????'
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
            'ERROR:  ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ????????? steps(<number>,direction) ??????????????????????????????'
          )
        }
      }
    }
    // direction ???????????????????????? end
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
          'ERROR: ??????`' +
          camelCaseToHyphened(k) +
          '` ?????? `' +
          v +
          '` ?????? ` (??????????????????: `' +
          list.join('`|`') +
          '`)'
        )
      }
    }
  }
}

const validateTime = function(v) {
  v = (v || '').toString()
  const match = v.match(REGEXP_TIME)

  if (match) {
    // ??????????????????
    const unit = match[1]
    if (!unit) {
      return {
        value: parseFloat(v) + cssTimeUnits[0],
        reason: function reason(k) {
          return (
            'WARNING: ?????? `' +
            camelCaseToHyphened(k) +
            '` ?????????????????????????????? `' +
            cssTimeUnits[0] +
            '`'
          )
        }
      }
    } else if (cssTimeUnits.indexOf(unit.toLowerCase()) >= 0) {
      // ??????????????????
      return { value: v }
    } else {
      // ????????????????????????????????????ms
      const time = parseFloat(v)
      return {
        value: time + cssTimeUnits[0],
        reason: function reason(k) {
          return (
            'ERROR: ?????? `' +
            camelCaseToHyphened(k) +
            '` ??????????????? `' +
            unit +
            '`, ??????????????? `' +
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
      return 'ERROR: ?????? `' + camelCaseToHyphened(k) + '` ??????????????? `' + v + '` (???????????????)'
    }
  }
}

const validator = {
  /**
   * ????????????
   * @param {String} v
   * @returns {*}
   */
  transition: function(v) {
    // ????????? v
    const subStringArr = v
      .replace(/;$/, '')
      .split(',')
      .filter(Boolean)
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
    // ???????????? transition-property ?????? none ?????????
    let hasNoneProperty = false
    subStringArr.forEach(m => {
      m = m
        .toString()
        .split(' ')
        .filter(Boolean)
      let isDuration = true
      let isProperty = true
      const defaltProperty = {
        transitionProperty: 'all',
        transitionTimingFunction: 'ease',
        transitionDuration: '0s',
        transitionDelay: '0s'
      }
      m.forEach(val => {
        // cubic-bezier(<number>, <number>, <number>, <number>)???steps(<integer>[, <step-position>]?)????????????????????????
        if (timingFunctions.filter(func => val.startsWith(func)).length) {
          return (defaltProperty.transitionTimingFunction = val)
        }
        // ?????????????????? transitionDuration
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
      Object.keys(defaltProperty).forEach(key => {
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
  transitionProperty: function(v) {
    return {
      value: toCamelCase(v).trim() || ['all']
    }
  },
  transitionDelay: validateTime,
  transitionDuration: validateTime,
  transitionTimingFunction: validateTimingFunction,
  /**
   * ???????????????
   * @param v
   * @param units ???????????????
   * @param defaultValueIfNotSupported ????????????????????????????????????????????????
   * @returns {*}
   * @constructor
   */
  length: function(v, units, defaultValueIfNotSupported) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_LENGTH)
    if (!units) {
      units = cssLengthUnits
    }

    if (match) {
      // ??????????????????
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
              'WARNING: ?????? `' +
              camelCaseToHyphened(k) +
              '` ?????????????????????????????? `' +
              units[0] +
              '`'
            )
          }
        }
      } else if (units.indexOf(unit.toLowerCase()) >= 0) {
        // ??????????????????
        return { value: v }
      } else {
        // ??????validator??????????????????????????????????????????????????????????????????????????????
        // ???????????????????????????px??????????????????
        const fixedValue = defaultValueIfNotSupported || parseFloat(v) + units[0]
        return {
          value: fixedValue,
          reason: function reason(k) {
            return (
              'ERROR: ?????? `' +
              camelCaseToHyphened(k) +
              '` ??????????????? `' +
              unit +
              '`, ??????????????? `' +
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
        return 'ERROR: ?????? `' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ?????????(???????????????)'
      }
    }
  },
  /**
   * ???????????????, ?????? rgb, rgba, #fff, #ffffff, named-color
   * @param v
   * @returns {*}
   * @constructor
   */
  color: function(v) {
    v = (v || '').toString().trim()

    if (v.match(REGEXP_COLOR_LONG)) {
      return { value: v }
    }

    // ?????????#XXX???????????????#XXXXXX
    if (v.match(REGEXP_COLOR_SHORT)) {
      return {
        value: '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]
      }
    }

    // ????????????????????????????????????
    if (colorNames[v]) {
      return {
        value: colorNames[v]
      }
    }

    // rgb/rgbag??????????????????
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
    // ?????????
    if (v === 'transparent') {
      return { value: 'rgba(0,0,0,0)' }
    }

    // ???????????????
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ???????????? `' + v + '` ??????`'
      }
    }
  },
  /**
   * ??????/???????????????
   * @param {String} v
   * @returns {*}
   */
  number: function(v) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_NUMBER)

    if (match && !match[1]) {
      return { value: parseFloat(v) }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ?????? ` (???????????????)'
      }
    }
  },
  /**
   * ?????????(??????/?????????)????????? ?????????scale
   * @param {Array} names
   * @param {String} v
   */
  arraynumber: function(names, v) {
    v = (v || '').toString().trim()
    // ?????????????????????
    const items = v.split(/[,\s]+/)

    if (items && items.length <= names.length) {
      // logType????????????????????????logTypes?????????????????????
      const values = []
      let result
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        result = validator.number(it)

        // ???????????????????????????????????????????????????
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },
  /**
   * ????????????
   * @param {String} v
   * @returns {*}
   */
  integer: function(v) {
    v = (v || '').toString()

    if (v.match(REGEXP_INT)) {
      return { value: parseInt(v, 10) }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ?????? ` (???????????????)'
      }
    }
  },
  /**
   * animation-iteration-count??????
   * @param {String} v
   * @returns {*}
   */
  iterationcount: function(v) {
    v = (v || '').toString().trim()

    if (v.match(REGEXP_INT)) {
      return { value: parseInt(v, 10) }
    } else if (/^infinite$/.test(v)) {
      // ?????????????????????
      return { value: -1 }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ?????? ` (???????????????)'
      }
    }
  },
  /**
   * url??????
   * @param v
   * @param options
   * @param options.filePath
   * @returns {*}
   */
  url: function(v, options) {
    v = (v || '').toString().trim()
    if (v.match(/^none$/i)) {
      return { value: 'none' }
    }

    const url = REGEXP_URL.exec(v)
    if (url && url[2].trim()) {
      let value = url[2]
      if (!/^data:/.test(value) && !/^http(s)?:/.test(value)) {
        // ?????????????????????????????????????????????
        value = resolvePath(value, options.filePath)
      }
      return { value: value }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return (
          'WARNING: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ????????? none ?????? url(...)'
        )
      }
    }
  },
  /**
   * @fontface???src????????????
   * @param v
   * @param options
   * @returns {*}
   */
  fontSrc: function(v, options) {
    v = (v || '').toString().trim()
    const items = v.split(',')
    if (items && items.length > 0) {
      // logType????????????????????????logTypes?????????????????????
      const values = []
      const logs = []
      let logType = 0
      items.forEach(function(item, index) {
        item = item.trim()
        let result = {}
        // ??????local(????????????)
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
                    'WARNING: @font-face?????????src`' +
                    camelCaseToHyphened(k) +
                    '`??????`' +
                    v +
                    '` ????????????'
                  )
                }
              : null
          }
        } else {
          // ???????????????????????????
          result = validator.url(item, options)
        }

        // ???????????????????????????????????????????????????
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), item, result.value)
          // ??????????????????
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
                  ': @font-face????????? `' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n   ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: @font-face?????????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ????????????'
      }
    }
  },

  /**
   * fontFamily??????
   * @param v
   * @returns {*}
   */
  fontFamily: function(v) {
    v = (v || '').toString().replace(/['"]+/g, '')
    if (v) {
      return { value: v }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ????????????'
      }
    }
  },

  /**
   * ????????????(?????????)
   * @param v
   * @returns {*}
   */
  position: function(v, units) {
    v = (v || '').toString()
    if (!units) {
      units = cssLengthUnits
    }

    const items = v.split(/\s+|,/) // ?????????,??????
    if (items && items.length > 1) {
      const values = []
      let result
      const logs = []
      let logType = 0
      if (items.length > 3) {
        logType = 1
        logs.push('?????????????????????3???, ??????????????????')
      }

      items.forEach((it, index) => {
        result = validator.length(it, units)
        // ???????????????????????????????????????????????????
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????
   * @param {String} v
   * @returns {*}
   */
  name: function(v) {
    v = (v || '').toString()
    if (v.match(REGEXP_NAME)) {
      return { value: v }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????????????????
   * @param {string} v
   * @param {object} validatorMap
   * @returns {*}
   */
  multipleAttributesValidator: function(v, validatorMap) {
    v = (v || '').toString().trim()
    // ????????????
    const items = v.replace(/\)\s+/g, ')|').split('|')
    if (items && items.length) {
      const values = {}
      let result
      const logs = []
      let logType = 0
      // ????????????????????????
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
            // ????????????Array
            if (result.value instanceof Array) {
              result.value.forEach(item => {
                if (isValidValue(item.v)) {
                  values[item.n] = item.v
                }
              })
              // ????????????number???String
            } else if (isValidValue(result.value)) {
              values[key] = result.value
            }
            if (result.reason) {
              let str = result.reason(key, value, result.value)
              // ??????????????????
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
            logs.push('?????? `' + key + '` ?????????')
          }
        } else {
          logType = 2
          logs.push('?????? `' + index + '` ?????????????????????')
        }
      })
      return {
        value: isEmptyObject(values) ? null : JSON.stringify(values),
        reason:
          logs.length > 0
            ? function(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  background: function(v) {
    v = (v || '').toString().trim()
    // ?????????????????????background???????????????????????????
    let items = v.split()
    // ??????????????????
    if (v.indexOf('-gradient') > 0) {
      const reg = /(repeating-linear|linear)[\s\S]*?(?=\s*(repeating|linear)|$)/g
      items = v.match(reg)
    }
    // ?????????????????????
    const value = {
      values: []
    }
    if (items && items.length) {
      const logs = []
      let logType = 0
      // ????????????????????????????????????value
      items.forEach(it => {
        let key
        let validator

        // ??????????????????
        // ?????????(repeating-)?linear-gradient(xxx)
        if (it.indexOf('-gradient') >= 0) {
          // (repeating-)?linear-gradient(xxx)????????????????????????
          key = it.indexOf('repeating') >= 0 ? 'repeatingLinearGradient' : 'linearGradient'
          validator = backgroundValidatorMap[key]
        }

        if (typeof validator === 'function') {
          const result = validator(it)
          // ???????????????????????????????????????????????????
          if (isValidValue(result.value)) {
            const parseObj = JSON.parse(result.value)
            value.values.push(parseObj)
          }
          if (result.reason) {
            let str = result.reason(key, it, result.value)
            // ??????????????????
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
          logs.push('???????????? `' + it + '`????????????')
        }
      })

      return {
        value: logType < 2 ? JSON.stringify(value) : null,
        reason:
          logs.length > 0
            ? function(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  backgroundSize: function(v, units) {
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
                ': ??????`' +
                camelCaseToHyphened(k) +
                '` ?????? `' +
                v +
                '` ????????????: \n  ' +
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

        // ???????????????????????????????????????????????????
        result = validator.length(it, units)
        if (isValidValue(result.value)) {
          values.push(result.value)
        }
        if (result.reason) {
          str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // ??????????????????????????????
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  backgroundPosition: function(v, units) {
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
                ': ??????`' +
                camelCaseToHyphened(k) +
                '` ?????? `' +
                v +
                '` ????????????: \n  ' +
                str
              )
            }
          : null
      }
    } else if (items.length === 2) {
      const val1 = items[0]
      const val2 = items[1]

      if (val1 === 'center') {
        // ??????????????? center??????????????????????????? center, top???right???left???bottom???px???%
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
        // ??????????????? top/bottom???????????????????????? left/right/center
        values = items
      } else {
        // ??????????????? px???%???left???right ???????????????????????? px/%/top/bottom/center
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
        if (!logs.length) logs.push('????????????????????????')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
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
        if (!logs.length) logs.push('????????????????????????')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
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
        if (!logs.length) logs.push('????????????????????????')
      }
      return {
        value: logType < 2 ? values.join(' ') : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // ??????????????????????????????
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  fontWeight: function(v, units) {
    v = (v || '').toString().trim()

    if (REGEXP_FONT_WEIGHT.test(v) || REGEXP_INT_ABS.test(v)) return { value: v }
    else
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ???????????????????????????normal,bold,lighter,bolder????????????'
          )
        }
      }
  },
  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  linearGradient: function(v) {
    v = (v || '').toString().trim()
    // ???????????????????????????
    const result = {
      type: '',
      directions: ['to', 'bottom'], // ??????????????????
      values: []
    }

    let objcolor = {}
    let objdirection = {}
    const logs = []
    let logType = 0
    // ??????(repeating-)linear-gradient??????????????????
    const inMatchs = v.match(/^([0-9a-zA-Z-]+)\(([\s\S]*)\)/)
    if (inMatchs) {
      const key = hyphenedToCamelCase(inMatchs[1])
      result.type = key // type??????
      const valueList = inMatchs[2].split(/,/)

      // ??????direction???angle??????(???????????????)
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
          // ??????direction???angle?????????color-stop??????
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

      // ??????color-stop??????
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
        logs.push('?????? `' + v + '`??????????????????')
      }

      return {
        value: logType < 2 ? JSON.stringify(result) : null,
        reason:
          logs.length > 0
            ? function(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    // ??????????????????????????????
    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },
  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  time: validateTime,

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  angle: function(v) {
    v = (v || '').toString().trim()
    const match = v.match(REGEXP_ANGLE)

    if (match) {
      // ??????????????????
      const unit = match[1]
      if (!unit) {
        return {
          value: parseFloat(v) + cssAngleUnits[0],
          reason: function reason(k) {
            return (
              'WARNING: ?????? `' +
              camelCaseToHyphened(k) +
              '` ?????????????????????????????? `' +
              cssAngleUnits[0] +
              '`'
            )
          }
        }
      } else if (cssAngleUnits.indexOf(unit.toLowerCase()) >= 0) {
        // ??????????????????
        return { value: v }
      } else {
        // ????????????????????????????????????ms
        let msv = parseFloat(v)
        // TODO: ????????????rad???deg?????????
        if (unit.toLowerCase() === 'rad') {
          msv = Math.round((msv * 180) / Math.PI)
          return {
            value: msv + cssAngleUnits[0],
            reason: function reason(k) {
              return (
                'WARNING: ?????? `' +
                camelCaseToHyphened(k) +
                '` ??????????????? `' +
                unit +
                '`, ??????????????? `' +
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
              'ERROR: ?????? `' +
              camelCaseToHyphened(k) +
              '` ??????????????? `' +
              unit +
              '`, ??????????????? `' +
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
        return 'ERROR: ?????? `' + camelCaseToHyphened(k) + '` ??????????????? `' + v + '` (???????????????)'
      }
    }
  },

  /**
   * ???????????????
   * @param list
   * @param v
   * @returns {*}
   */
  enum: function(list, v) {
    const index = list.indexOf(v)
    if (index > 0) {
      return { value: v }
    }
    if (index === 0) {
      return {
        value: v,
        // ????????????????????????
        reason:
          false &&
          function reason(k, v) {
            return (
              'NOTE:  ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ????????????(??????????????????)'
            )
          }
      }
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ?????? ` (??????????????????: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
  },

  /**
   * ?????????????????????????????????
   * @param list
   * @param v
   * @returns {*}
   */
  animationTimingFunction: validateTimingFunction,

  /**
   * gradient????????????
   * @param v
   * @returns {*}
   * @constructor
   */
  gradientdirection: function(v) {
    v = (v || '').toString().trim()
    // ???????????????????????????????????????
    const items = v.split(/\s+/)
    let mismatch = []
    const arr = []
    items.forEach(it => {
      if (it === 'to') {
        arr.push(0)
      } else if ((it === 'top') | (it === 'bottom')) {
        arr.push(1)
      } else if ((it === 'left') | (it === 'right')) {
        arr.push(2)
      } else {
        // ??????(to|left|top|right|bottom)???????????????
        mismatch.push(it)
      }
    })

    if (mismatch.length === 0 && arr.length > 1 && arr.length < 4) {
      if (arr[0] === 0 && arr[1] !== 0) {
        // ?????????????????????
        if (arr[2]) {
          // ???????????????????????????????????????to???
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
                'ERROR:  ??????`' +
                camelCaseToHyphened(k) +
                '` ???????????? `' +
                mismatch.join(' ') +
                '` ??????????????? `)'
              )
            }
          : null
    }
  },
  /**
   * ?????????auto ????????????
   * @param {String} v
   * @param {Array} units - ???????????????
   * @returns {*}
   */
  multipleLength: function(v, units) {
    v = (v || '').toString().trim()
    if (v === 'auto') {
      return { value: v }
    } else if (/^[-+]?[0-9]+.*/.test(v)) {
      return validator.length(v, units)
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
        }
      }
    }
  },
  /**
   * ?????????????????????, ??????padding, margin, border-width, translate
   * @param {String} v
   * @param {Array} units - ???????????????
   * @returns {*}
   */
  arraylength: function(names, v, units) {
    v = (v || '').toString().trim()
    // ?????????????????????
    const items = v.split(/[,\s]+/)

    if (items && items.length <= names.length) {
      // logType????????????????????????logTypes?????????????????????
      const values = []
      let result
      const logs = []
      let logType = 0
      // ?????????margin-* ?????????????????????
      const isMultipleLength = /^margin.*/.test(names[0])

      items.forEach((it, index) => {
        if (isMultipleLength) {
          result = validator.multipleLength(it, units)
        } else {
          result = validator.length(it, units)
        }
        // ???????????????????????????????????????????????????
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ?????????????????????, ??????border-color
   * @param v
   * @returns {*}
   * @constructor
   */
  arraycolor: function(names, v) {
    v = (v || '').toString()
    const items = v.match(REGEXP_ARRAYCOLOR)

    if (items && items.length <= 4) {
      // logType????????????????????????logTypes?????????????????????
      const values = []
      let result
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        result = validator.color(it)

        // ???????????????????????????????????????????????????
        if (isValidValue(result.value)) {
          values.push(result.value)
        }

        if (result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * ????????????color-stop?????????, ????????????????????????
   * @param v
   * @returns {*}
   */
  arraycolorstop: function(v) {
    v = (v || '').toString().trim()
    // ??????color-stop??????
    const items = v.match(REGEXP_ARRAYCOLORSTOP)

    // ????????????????????????
    if (items && items.length > 1) {
      const value = []
      const logs = []
      let logType = 0

      items.forEach((it, index) => {
        // ??????stop??????
        const arrstop = it.match(/[\s]+[-+0-9]+(px|%|dp)?$/)
        // ??????color???stop???????????????
        const groupvalue = []

        // ??????stop??????
        if (arrstop) {
          const objstop = validator.length(arrstop[0])
          const num = it.indexOf(arrstop[0])
          // ??????color??????
          it = it.substring(0, num)
          if (isValidValue(objstop.value)) {
            groupvalue.push(objstop.value)
          }

          if (objstop.reason) {
            let str = objstop.reason(index.toString(), arrstop[0], objstop.value)
            // ??????????????????
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
          // ???????????????????????????????????????????????????
          if (isValidValue(objcolor.value)) {
            // ????????????color??????stop?????????
            groupvalue.unshift(objcolor.value)
          }

          // ??????????????????color-stop???
          value.push(groupvalue.join(' '))
          if (objcolor.reason) {
            let str = objcolor.reason(index.toString(), it, objcolor.value)
            // ??????????????????
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
          logs.push('?????? `' + v + '` ???????????????')
        }
      })

      return {
        value: logType < 2 ? JSON.stringify(value) : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
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
          'ERROR: ??????`' +
          camelCaseToHyphened(k) +
          '` ?????? `' +
          v +
          '` ??????????????????????????????????????????'
        )
      }
    }
  },

  /**
   * mylocation??????: mylocation
   * @param v
   * @param units ???????????????
   * @returns {*}
   * @constructor
   */
  mylocation: function(v, options) {
    v = (v || '').toString()
    // ????????????
    const items = v.split(/\s+/)

    if (items && items.length <= 3) {
      // logType????????????????????????logTypes????????????????????????typeList???????????????????????????????????????
      const values = []
      let result
      const logs = []
      let logType = 0
      const typeList = []
      let prevType = -1

      items.forEach((it, index) => {
        // ????????????????????????????????????????????????????????????????????????????????????????????????
        if (isValidValue(validator.color(it).value)) {
          // ????????????????????????
          typeList.push(index)
          if (index === 0) {
            // ????????????????????????????????????????????????mylocationFillColor
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
            '??????`' +
              index +
              '` ?????? `' +
              it +
              '` ????????????: \n  ?????????fillColor???strokeColor???iconPath???????????????'
          )
        }

        if (result && result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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

      // ????????????????????????width???style???color???????????????????????????
      typeList.forEach(it => {
        if (it > prevType) {
          prevType = it
        } else {
          logType = 2
          logs.push('???????????????????????????fillColor???strokeColor???iconPath')
        }
      })

      return {
        value: logType < 2 ? values : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  /**
   * border??????: border
   * @param v
   * @param units ???????????????
   * @param position ???????????????
   * @returns {*}
   * @constructor
   */
  border: function(v, units, position) {
    v = (v || '').toString()

    // ???????????????????????????????????????
    v = v.replace(/\s*,\s*/g, ',')
    position = (position || '').toString()
    // ????????????
    const items = v.split(/\s+/)

    if (items && items.length <= 3) {
      // logType????????????????????????logTypes????????????????????????typeList???????????????????????????????????????
      let values = []
      let result
      const logs = []
      let logType = 0
      const typeList = []
      let prevType = -1

      items.forEach((it, index) => {
        // ????????????????????????????????????????????????width???style???color?????????,????????????????????????????????????????????????????????????
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
            '??????`' +
              index +
              '` ?????? `' +
              it +
              '` ????????????: \n  ?????????width???style???color???????????????'
          )
        }

        if (result && result.reason) {
          let str = result.reason(index.toString(), it, result.value)
          // ??????????????????
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

      // ????????????????????????width???style???color???????????????????????????
      typeList.forEach(it => {
        if (it > prevType) {
          prevType = it
        } else {
          logType = 2
          logs.push('???????????????????????????width style color')
        }
      })

      return {
        value: logType < 2 ? values : null,
        reason:
          logs.length > 0
            ? function reason(k, v) {
                return (
                  logTypes[logType] +
                  ': ??????`' +
                  camelCaseToHyphened(k) +
                  '` ?????? `' +
                  v +
                  '` ????????????: \n  ' +
                  logs.join('\n  ')
                )
              }
            : null
      }
    }

    return {
      value: null,
      reason: function reason(k, v) {
        return 'ERROR: ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ???????????????'
      }
    }
  },

  borderLeft: function(v, units) {
    return validator.border(v, units, 'Left')
  },
  borderRight: function(v, units) {
    return validator.border(v, units, 'Right')
  },
  borderTop: function(v, units) {
    return validator.border(v, units, 'Top')
  },
  borderBottom: function(v, units) {
    return validator.border(v, units, 'Bottom')
  },
  /**
   * display?????????'block'??????
   * @param v
   * @returns {*}
   * @constructor
   */
  display: function(v) {
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
            'ERROR: ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ????????????flex ` (??????????????????: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
    if (index === 0) {
      return {
        value: v,
        // ????????????????????????
        reason:
          false &&
          function reason(k, v) {
            return (
              'NOTE:  ??????`' + camelCaseToHyphened(k) + '` ?????? `' + v + '` ????????????(??????????????????)'
            )
          }
      }
    } else {
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ?????? ` (??????????????????: `' +
            list.join('`|`') +
            '`)'
          )
        }
      }
    }
  },

  /**
   * ????????????
   * @param v
   * @returns {*}
   */
  caretColor: function(v, units) {
    v = (v || '').toString().trim()

    if (REGEXP_CARET.test(v) || isValidValue(validator.color(v).value)) return { value: v }
    else
      return {
        value: null,
        reason: function reason(k, v) {
          return (
            'ERROR: ??????`' +
            camelCaseToHyphened(k) +
            '` ?????? `' +
            v +
            '` ???????????????????????????auto,currentColor,transparent???<color>'
          )
        }
      }
  }
}

/**
 * ???????????????????????????????????????
 * @param units  ?????????
 * @param defaultValueIfNotSupported ????????????????????????????????????????????????
 * @param value ??????????????????
 * @returns {validator_length}
 */
function _lengthValidator(units, defaultValueIfNotSupported, value) {
  return validator.length(value, units, defaultValueIfNotSupported)
}

function makeLengthValidator(units, defaultValueIfNotSupported) {
  return _lengthValidator.bind(null, units, defaultValueIfNotSupported)
}

// ??????????????????????????????????????????transform???filter??????
function _multipleAttributesValidator(list, v) {
  return validator.multipleAttributesValidator(v, list)
}
function makeMultipleAttributesValidator(validatorMap) {
  return _multipleAttributesValidator.bind(null, validatorMap)
}

/**
 * ??????????????????????????????
 * @param list
 * @returns {validator_enum}
 */
function makeEnumValidator(list) {
  return validator.enum.bind(null, list)
}

/**
 * ?????????????????????????????????????????????
 * @param type  ??????????????????????????????
 * @param list  ???????????????????????????
 * @returns {validator_$type}
 */
function makeAbbrAttrValidator(type, list) {
  return validator[type].bind(null, list)
}

// background???????????????
const backgroundValidatorMap = {
  linearGradient: validator.linearGradient,
  repeatingLinearGradient: validator.linearGradient,
  linearGradientColor: validator.arraycolorstop,
  linearGradientAngle: validator.angle,
  linearGradientDirection: validator.gradientdirection
}

const transformValidatorMap = {
  translate: makeAbbrAttrValidator('arraylength', ['translateX', 'translateY']),
  translateX: validator.length,
  translateY: validator.length,
  scale: makeAbbrAttrValidator('arraynumber', ['scaleX', 'scaleY']),
  scaleX: validator.number,
  scaleY: validator.number,
  rotate: validator.angle,
  rotateX: validator.angle,
  rotateY: validator.angle
}

// css filter ?????????????????????????????????blur??????
const filterValidatorMap = {
  blur: makeLengthValidator(['px', 'dp'], '0px')
}

// CSS????????????????????????
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
  textAlign: makeEnumValidator(['left', 'center', 'right']),
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
  fontFamily: validator.fontFamily
}

/**
 * ??????CSS??????
 * @param name
 * @param value
 * @param options
 * @param options.filePath ??????????????????
 * @returns {{value: *, log: *}}
 */
function validate(name, value, options) {
  let result, log
  const validator = validatorMap[name]

  if (typeof validator === 'function') {
    if (typeof value !== 'function') {
      if (mightReferlocalResource(name)) {
        result = validator(value, options)
      } else {
        result = validator(value)
      }
    } else {
      // ??????????????????????????????????????????
      result = { value: value }
    }

    if (result.reason) {
      log = { reason: result.reason(name, value, result.value) }
    }
  } else {
    // ???????????????????????????, ????????????
    result = { value: value }
    log = { reason: 'ERROR: ?????????`' + camelCaseToHyphened(name) + '`?????????' }
  }

  return {
    value: result.value instanceof Array ? result.value : [{ n: name, v: result.value }],
    log: log
  }
}

/**
 * @param name
 * @desc ?????????????????????????????????css??????
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
