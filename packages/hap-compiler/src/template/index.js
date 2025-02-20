/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import parse5 from 'parse5'
import Parser from 'parse5/lib/parser'
import Tokenizer from 'parse5/lib/tokenizer'

import { colorconsole, compileOptionsObject } from '@hap-toolkit/shared-utils'
import validator from './validator'
import { compressTemplateAttr } from './compress'

/**
 * 计算支持span的节点的有效子节点数
 * @param tagName - 标签名
 * @param childNodes - 标签的子节点
 * @returns {number}
 */
function calcSubTextNodesNum(tagName, childNodes) {
  let subTextNodesNum = 0
  if (validator.isSupportSpan(tagName)) {
    const tagChildren = validator.getTagChildren(tagName)
    childNodes.forEach(function (child) {
      if (
        (child.nodeName === '#text' && child.value.trim()) ||
        tagChildren.indexOf(child.nodeName) > -1
      ) {
        ++subTextNodesNum
      }
    })
  }
  return subTextNodesNum
}

/**
 * 遍历模板,检查标签、属性和子节点是否合法
 * @param {Object} node - 页面template模块的编译后的树对象
 * @param {Object} output
 * @param {Object} output.result - 结果收集
 * @param {Array} output.log - 日志收集
 * @param {Object} previousNode - 前一个节点
 * @param {Object} conditionList - 条件列表
 * @param {Object} options
 * @param {String} options.uxType - 文件类型
 * @param {String} options.filePath - 当前执行文件的绝对路径
 * @param {Array} options.importNames - 页面引入的自定义组件的name
 */
function traverse(node, output, previousNode, conditionList, options) {
  // 检查标签名
  validator.checkTagName(node, output, options)

  // 处理标签属性
  // attrs: id/class/style/if/for/event/attr/show/model/自定义指令
  const attrs = node.attrs || []
  attrs.forEach(function switchAttr(attr) {
    let name = attr.name
    const inMatch = name.match(/^:+/)
    if (inMatch) {
      name = name.slice(inMatch.length)
    }
    const value = attr.value

    // 获取位置信息
    let locationInfo = { line: 1, column: 1 }
    if (node.__location) {
      locationInfo = {
        line: node.__location.line,
        column: node.__location.col
      }
    }

    switch (name) {
      case 'id':
        // 保留checkId为兼容原有：新打的RPK包兼容原来的APK平台
        validator.checkId(value, output)
        validator.checkAttr(name, value, output, node.tagName, locationInfo)
        break
      case 'class':
        validator.checkClass(value, output)
        break
      case 'style':
        validator.checkStyle(value, output, locationInfo, options)
        break
      case 'if':
        if (!node._isroot) {
          validator.checkIf(value, output, false, locationInfo, conditionList)
        }
        break
      case 'is':
        validator.checkIs(value, output, locationInfo)
        break
      case 'else':
        if (!node._isroot) {
          if (previousNode && previousNode.__cond__) {
            validator.checkElse(previousNode.__cond__, output, locationInfo, conditionList)
          }
        }
        break
      case 'elif':
        if (!node._isroot) {
          if (previousNode && previousNode.__cond__) {
            node.__cond__ = validator.checkElif(
              value,
              previousNode.__cond__,
              output,
              locationInfo,
              conditionList
            )
          }
        }
        break
      case 'for':
        if (!node._isroot) {
          validator.checkFor(value, output, locationInfo)
        }
        break
      case 'tree':
        validator.checkBuild('tree', output)
        break
      default:
        if (name.match(/^(on|@)/)) {
          // 事件以on或@开头
          validator.checkEvent(name, value, output)
        } else {
          if (name.match(/^model:/)) {
            // 解析model指令，model指令格式：model:name="{{youName}}"
            validator.checkModel(name, value, output, node, locationInfo, options)
          } else if (name.match(/^dir:/)) {
            // 解析自定义指令，自定义指令格式：dir:指令名称="{{data}}"
            validator.checkCustomDirective(name, value, output, node)
          } else {
            // 其余为普通属性
            validator.checkAttr(name, value, output, node.tagName, locationInfo, options)
          }
        }
    }
  })

  // 处理子节点
  const originResult = output.result
  const childNodes = node.childNodes
  if (childNodes && childNodes.length) {
    let previous
    let preNode
    const curNodeCondList = []
    // 支持span的节点的有效子节点数
    const subTextNodesNum = calcSubTextNodesNum(originResult.type, childNodes)

    childNodes.forEach(function (child, i) {
      if (i > 0) {
        preNode = childNodes[i - 1]
        if (!preNode.nodeName.match(/^#/)) {
          previous = preNode
          if (!previous.__cond__) {
            previous.attrs &&
              previous.attrs.forEach(function (attr) {
                if (attr.name === 'if' || attr.name === 'elif') {
                  previous.__cond__ = attr.value
                }
              })
          }
        }
      }
      const childResult = {}
      if (child.nodeName.match(/^#/)) {
        // 处理#text节点内容
        if (child.nodeName === '#text' && child.value.trim()) {
          // 兄弟节点不为自闭合标签且非文本标签非原子组件
          if (!preNode || !validator.isSupportedSelfClosing(preNode.nodeName)) {
            if (validator.isNotTextContentAtomic(node.tagName)) {
              output.log.push({
                line: node.__location.line,
                column: node.__location.col,
                reason: `Warn: 组件 ${node.tagName} 不支持文本内容作为子节点`
              })
            }
          }
          // 文本节点使用span包裹：
          // 1. 父节点支持span, 且有效子节点数不少于2
          const useSpanForSupportNode =
            validator.isSupportSpan(node.tagName) && subTextNodesNum >= 2
          // 2. 自定义组件中嵌入文本，替换内部slot节点
          const useSpanForCustomSlot =
            options.importNames && options.importNames.indexOf(node.tagName) > -1
          if (useSpanForSupportNode || useSpanForCustomSlot) {
            childResult.type = 'span'
            output.result = childResult
            originResult.children = originResult.children || []
            originResult.children.push(childResult)
            output.log.push({
              line: node.__location.line,
              column: node.__location.col,
              reason: `WARN: 文本和span标签并行存在,编译时将文本节点:"${child.value}" 用span包裹(关于span嵌套的使用，请参考官方文档"span嵌套")`
            })
            validator.checkAttr('value', child.value, output)
          }

          // 如果父节点是option, 处理value和content属性
          if (node.tagName === 'option') {
            const tempResult = output.result
            output.result = originResult
            if (!originResult.attr.hasOwnProperty('value')) {
              validator.checkAttr('value', child.value, output)
            }
            validator.checkAttr('content', child.value, output)
            output.result = tempResult
            return
          }

          // 父节点支持span，且有且仅有一个有效子节点，或父节点为允许文本内容的原子节点，直接设置value值
          if (
            (validator.isSupportSpan(node.tagName) && subTextNodesNum === 1) ||
            validator.isTextContentAtomic(node.tagName)
          ) {
            const tempResult = output.result // 备份当前result
            output.result = originResult
            validator.checkAttr('value', child.value, output)
            output.result = tempResult
          }
        }
        return
      }
      output.result = childResult
      originResult.children = originResult.children || []
      originResult.children.push(childResult)
      traverse(child, output, previous, curNodeCondList, options)
    })

    // 无孩子
    if (originResult.children && originResult.children.length === 0) {
      originResult.children = undefined
    }
  }
  output.result = originResult
}

/**
 * 对模板解析器的配置初始化
 * @param {String} code - 代码内容
 * @param {Object} options - 解析选项
 * @param {String} filePath - code 文件路径
 */
function initParser(code, options, filePath) {
  const parser = new Parser(options)
  const oldAppendElement = parser._appendElement
  const oldInsertElement = parser._insertElement
  // 支持自闭合标签
  parser._insertElement = function (token) {
    const tagName = (token.tagName || '').toLowerCase()
    const selfClosing = token.selfClosing
    // Fixed 对不允许自闭合的标签进行提示
    const selfClosable = validator.isSupportedSelfClosing(tagName)
    if (selfClosing && !selfClosable) {
      colorconsole.error(
        `${tagName}标签，禁止使用自闭合 ${filePath}@${token.location.line}:${token.location.col}`
      )
    }

    if (selfClosable || (selfClosing && tagName)) {
      oldAppendElement.apply(this, arguments)
    } else {
      oldInsertElement.apply(this, arguments)
    }
  }

  parser.__m = {}
  // 对标签进行xml规范检查
  function checkToken(token) {
    if (!token.tagName) {
      return
    }
    const tagName = token.tagName.toLowerCase()
    const selfClosing = token.selfClosing
    const selfClosable = validator.isSupportedSelfClosing(tagName)
    const empty = validator.isEmptyElement(tagName)

    if (parser.__m['tagName'] && !parser.__m['selfClosing'] && !empty) {
      const pos = String(token.location.line) + ':' + String(token.location.col)
      if (
        !selfClosable ||
        (pos !== parser.__m['pos'] && token.type === Tokenizer.START_TAG_TOKEN)
      ) {
        colorconsole.warn(
          `${parser.__m['tagName']}标签要闭合，请遵循XML规范 ${filePath}@${parser.__m['pos']}`
        )
        parser.__m = {}
      }
    }

    if (selfClosable) {
      if (token.type === Tokenizer.START_TAG_TOKEN && !selfClosing) {
        parser.__m['tagName'] = tagName
        parser.__m['selfClosing'] = false
        parser.__m['pos'] = String(token.location.line) + ':' + String(token.location.col)
      }

      if (token.type === Tokenizer.END_TAG_TOKEN && tagName === parser.__m['tagName']) {
        parser.__m['selfClosing'] = true
      }
    }
  }
  function checkPlainText(token) {
    if (!token.tagName) {
      return
    }
    if (token.tagName.toLowerCase() === 'plaintext') {
      colorconsole.error(
        `${filePath} : 禁止使用 plaintext 标签@${token.location.line}:${token.location.col}`
      )
    }
  }

  parser._runParsingLoop = function (scriptHandler) {
    while (!this.stopped) {
      this._setupTokenizerCDATAMode()

      const token = this.tokenizer.getNextToken()

      checkToken(token)
      checkPlainText(token)

      if (token.type === Tokenizer.HIBERNATION_TOKEN) {
        break
      }

      if (this.skipNextNewLine) {
        this.skipNextNewLine = false

        if (token.type === Tokenizer.WHITESPACE_CHARACTER_TOKEN && token.chars[0] === '\n') {
          if (token.chars.length === 1) {
            continue
          }

          token.chars = token.chars.substr(1)
        }
      }

      this._processInputToken(token)

      if (scriptHandler && this.pendingScript) {
        break
      }
    }
  }

  return parser.parseFragment(code)
}

/**
 * 解析<template>
 * @param {String} source - 源码
 * @param {Object} options
 * @param {String} options.filePath - 文件绝对路径
 * @returns {{jsonTemplate: ({}|result), log: Array}}
 */
function parse(source, options) {
  const doc = initParser(
    source,
    { treeAdapter: parse5.treeAdapters.default, locationInfo: true },
    options.filePath
  )
  const output = {
    result: {},
    log: [],
    depFiles: [],
    isNewJSCard: !!options.newJSCard,
    isLite: !!options.lite
  }

  // 模板为空或解析失败
  /* istanbul ignore if */
  if (!doc || !doc.childNodes) {
    output.log.push({
      reason: 'ERROR: <template>解析失败',
      line: 1,
      column: 1
    })
    return {
      jsonTemplate: output.result,
      log: output.log,
      depFiles: output.depFiles
    }
  }

  // 过滤合法标签名，如果标签名以#开头，则代表节点被注释或者#text, #comment
  const rootElements = doc.childNodes.filter(function (child) {
    return child.nodeName.charAt(0) !== '#'
  })

  // 合法节点数目只能等于1,0表示没有根容器
  /* istanbul ignore if */
  if (rootElements.length === 0) {
    output.log.push({ reason: 'ERROR: 没有合法的根节点', line: 1, column: 1 })
    return {
      jsonTemplate: output.result,
      log: output.log,
      depFiles: output.depFiles
    }
  }

  // 合法节点数目只能等于1,否则模板存在多个根容器
  if (rootElements.length > 1) {
    output.log.push({
      reason: 'ERROR: <template>节点里只能有一个根节点',
      line: 1,
      column: 1
    })
    return {
      jsonTemplate: output.result,
      log: output.log,
      depFiles: output.depFiles
    }
  }

  // 从根目录开始, 遍历树
  const current = rootElements[0]
  current._isroot = true
  try {
    traverse(current, output, null, null, options)
  } catch (err) {
    if (err.isExpressionError) {
      output.log.push({
        reason: `ERROR: 表达式解析失败 ${err.message}\n\n> ${err.expression}\n\nat ${options.filePath}`
      })
    } else {
      throw err
    }
  }

  // 检查是否包含ERROR记录
  // if (output.log.length > 0) {
  // }

  // 是否压缩模板属性名
  if (compileOptionsObject.optimizeTemplateAttr) {
    compressTemplateAttr(output.result)
  }

  // 返回结果
  return {
    jsonTemplate: output.result,
    log: output.log,
    depFiles: output.depFiles
  }
}

export default {
  parse,
  validator
}
