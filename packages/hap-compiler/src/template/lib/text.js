/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const tagSource = '{{{([\\s\\S]+?)}}}|{{([\\s\\S]+?)}}' // {{ }} 格式
const tagRE = new RegExp(tagSource, 'g')
const expRE = new RegExp(tagSource)
const htmlRE = new RegExp('^{{{[\\s\\S]*}}}$')
const sexpRE = new RegExp('^{{{([\\s\\S]+?)}}}$|^{{([\\s\\S]+?)}}$')
/**
 * 将模板字符串解析为token数组
 *
 * @param {String} text
 * @return {Array<Object> | null}
 *               - {String} type
 *               - {String} value
 *               - {Boolean} [html]
 *               - {Boolean} [oneTime]
 */
function parseText(text) {
  // 剔除回车
  text = text.replace(/\n/g, '')
  /* istanbul ignore if */
  if (!tagRE.test(text)) {
    return null
  }
  const tokens = []
  let lastIndex = (tagRE.lastIndex = 0)
  let match, index, html, value, first, oneTime
  /* eslint-disable no-cond-assign */
  while ((match = tagRE.exec(text))) {
    /* eslint-enable no-cond-assign */
    index = match.index
    // push text token
    if (index > lastIndex) {
      tokens.push({
        value: text.slice(lastIndex, index)
      })
    }
    // tag token
    html = htmlRE.test(match[0])
    value = html ? match[1] : match[2]
    first = value.charCodeAt(0)
    oneTime = first === 42 // *
    value = oneTime ? value.slice(1) : value
    tokens.push({
      tag: true,
      value: value.trim(),
      html: html,
      oneTime: oneTime
    })
    lastIndex = index + match[0].length
  }
  if (lastIndex < text.length) {
    tokens.push({
      value: text.slice(lastIndex)
    })
  }
  return tokens
}

/**
 * 检测是否包含表达式
 * @param  {String} text
 * @return {Boolean}
 */
function isExpr(text) {
  return expRE.test(text)
}

/**
 * 检测是否为单个表达式
 * @param text
 * @returns {boolean}
 */
function singleExpr(text) {
  return sexpRE.test(text.trim())
}

/**
 * 移除头尾'{{}}'
 */
function removeExprffix(text) {
  if (!singleExpr(text)) {
    return text
  }
  return text.replace(/^\s*{{/, '').replace(/}}\s*$/, '')
}

/**
 * 添加头尾'{{}}'
 */
function addExprffix(text) {
  if (!singleExpr(text)) {
    text = '{{' + text + '}}'
  }
  return text
}

module.exports = {
  parseText: parseText,
  isExpr: isExpr,
  singleExpr: singleExpr,
  addExprffix: addExprffix,
  removeExprffix: removeExprffix
}
