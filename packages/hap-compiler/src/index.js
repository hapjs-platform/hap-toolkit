/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
import parse5 from 'parse5'
import templater from './template'
import actioner from './actions'
import styler from './style'
import scripter from './script'
import { serialize } from './utils'

export { scripter, styler, templater, actioner }
export * from './style'

/**
 * 格式化节点
 * @param source
 * @param node
 */
function _formatFragment(source, node) {
  let start, end, line, column
  const attrs = {}

  // 获取当前节点在文档中的位置信息
  if (node.__location) {
    const __location = node.__location
    if (__location.startTag && __location.endTag) {
      start = __location.startTag.endOffset || 0
      end = __location.endTag.startOffset || 0
    } else {
      start = __location.startOffset || 0
      end = __location.endOffset || 0
    }
    line = __location.line
    column = __location.col
    /* istanbul ignore else */
  } else {
    start = end = line = column = 0
  }

  if (node.attrs && node.attrs.length) {
    node.attrs.forEach(function (item) {
      attrs[item.name] = item.value
    })
  }

  return {
    type: node.nodeName,
    attrs: attrs, // 节点属性值
    content: source.substring(start, end), // 节点的文本内容
    location: {
      start: start,
      end: end,
      line: line,
      column: column
    }
  }
}

/**
 * 解析片段
 * @param {string} source - 源码
 * @param {string} filePath - 文件绝对路径
 */
function parseFragments(source, filePath) {
  const frags = {
    import: [], // 导入组件
    template: [], // 模板
    style: [], // 样式
    script: [], // 脚本
    data: [] // 数据
  }
  const fragment = parse5.parseFragment(source, {
    treeAdapter: parse5.treeAdapters.default,
    locationInfo: true
  })

  // 存储片段解析结果
  fragment.childNodes.forEach((node) => {
    const fragmentInfo = _formatFragment(source, node)
    frags[node.nodeName] && frags[node.nodeName].push(fragmentInfo)
    // 判断<import>组件标签是否闭合
    if (node.nodeName === 'import' && node.__location && !node.__location.endTag) {
      throw new Error(
        `${filePath} : <import> 组件缺少闭合标签，请检查  @${fragmentInfo.location.line} : ${fragmentInfo.location.column}`
      )
    }
    if (node.nodeName.toLowerCase() === 'plaintext') {
      throw new Error(
        `${filePath} : 禁止使用${`plaintext`}  @${fragmentInfo.location.line} : ${
          fragmentInfo.location.column
        }`
      )
    }
  })

  return frags
}

// 片段缓存
const fragsCache = new Map()

/**
 * 解析片段,优先从缓存中获取
 * @param {string} source - 源码
 * @param {string} filePath - 文件绝对路径
 * @returns {Object}
 */
function parseFragmentsWithCache(source, filePath) {
  if (!fragsCache.has(filePath) || fragsCache.get(filePath).source !== source) {
    // 解析并缓存片段
    fragsCache.set(filePath, {
      source: source,
      frags: parseFragments(source, filePath)
    })
  }

  return fragsCache.get(filePath).frags
}

/**
 * 解析模板
 * @param {String} source - 源码
 * @param {Object} options
 * @param {String} options.uxType - 文件类型
 * @param {String} options.filePath - 当前执行文件的绝对路径
 * @returns {Object}
 */
function parseTemplate(source, options) {
  const templateObj = templater.parse(source, options)
  const { jsonTemplate, log, depFiles } = templateObj
  const parsed = serialize(jsonTemplate, 2)
  return { parsed, log, depFiles }
}

/**
 * 解析CSS
 * @param {String} source
 * @returns {Object}
 */
function parseStyle(source) {
  const styleObj = styler.parse(source)
  const { jsonStyle, depList, log, depFiles } = styleObj
  const parsed = JSON.stringify(jsonStyle, null, 2)
  return { parsed, depList, log, depFiles, jsonStyle }
}

/**
 * 解析脚本
 * @param {String} source - 源码
 * @returns {Object}
 */
function parseScript(source) {
  const parsed = scripter.parse(source)
  return { parsed: parsed }
}

/**
 * 解析actions
 * @param {String} jsonObj - actions对象
 * @returns {Object}
 */
function parseActions(jsonObj) {
  const { jsonAction } = actioner.parse(jsonObj)
  const parsed = JSON.stringify(jsonAction)
  return { parsed }
}

export { parseFragmentsWithCache, parseTemplate, parseStyle, parseScript, parseActions, serialize }
export { ENTRY_TYPE, FRAG_TYPE, isEmptyObject } from './utils'
