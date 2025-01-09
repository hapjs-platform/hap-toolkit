/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
import fs from 'fs'
import path from 'path'
import css from 'css'
import cssWhat from 'css-what'
import { extend, compileOptionsObject } from '@hap-toolkit/shared-utils'
import {
  validate as validateDelaration,
  validatePseudoClass,
  mightReferlocalResource
} from './validator'
import { compressDescSelector } from './compress'
import { validateMediaCondition, findMediaClassByCondition, wrapMediaCode } from './mediaquery'
import { hyphenedToCamelCase, isValidValue } from '../utils'

// 有效@import的标识前后缀
const VALID_IMPORT_FLAG = '__VALID_IMPORT__'

// 匹配@import的正则
// (?:['"]([^()]+?)['"]) => "foo.css"
// (?:(?:url\\(([^()]+?)\\))) => url(bar.css)
// ((?:\\s*)|(?:\\s+[^;]+)) => 空格 或 除`;`之外字符
const IMPORT_REG = new RegExp(
  `@import\\s+${VALID_IMPORT_FLAG}((?:['"]([^()]+?)['"])|(?:(?:url\\(([^()]+?)\\))))((?:\\s*)|(?:\\s+[^;]+))${VALID_IMPORT_FLAG};`,
  'g'
)

// 匹配@import url的正则
const IMPORT_URL_REG = new RegExp(
  `${VALID_IMPORT_FLAG}(?:(?:['"]([^()]+?)['"])|(?:(?:url\\(([^()]+?)\\))))(\\s+[^;]+)?${VALID_IMPORT_FLAG};`
)

/**
 * 是否将资源添加到依赖
 * @param  {string} name - 属性名
 * @param  {string} value - 属性值
 * @returns {boolean}
 */
function shouldAddToDependency(name, value) {
  return mightReferlocalResource(name) && !/^(data:|http)/.test(value) && typeof value === 'string'
}

/**
 * 解析css中的有效的@import（只在最顶级最上面有效)
 * 此情况存在于未使用任何css预处理，使用less，sass等会依据自己语法解析css
 * @desc 给有效的@import打上标识前后缀，便于正则查找，返回新代码
 * @param {String} csscode - css代码
 * @returns {String} 新的css代码
 */
function signValidCssImport(csscode) {
  let isOnTop = true
  const ast = css.parse(csscode)
  if (
    ast &&
    ast.type === 'stylesheet' &&
    ast.stylesheet &&
    ast.stylesheet.rules &&
    ast.stylesheet.rules.length
  ) {
    // 只需做最顶层的获取
    const rules = ast.stylesheet.rules
    rules.forEach((rule) => {
      const type = rule.type

      // 在import前面的只能是注释或者import
      if (type !== 'import' && type !== 'comment') {
        isOnTop = false
      }
      if (type === 'import' && isOnTop) {
        // 打上标识符
        rule.import = VALID_IMPORT_FLAG + rule.import + VALID_IMPORT_FLAG
      }
    })
    csscode = css.stringify(ast)
  }
  return csscode
}
/**
 * 处理@import
 * @desc 支持 @import '.file.css';或者 @import url(./file.css);
 * @param {String} csscode - css代码
 * @param {String} dir - css文件所在的目录
 * @param {String} log - log对象
 * @param {Array} depList - 引入的CSS文件列表
 * @returns {*}
 */
function processImport(csscode, dir, log, depList) {
  // 处理@import
  let mergeCode = signValidCssImport(csscode)
  const importList = mergeCode.match(IMPORT_REG)
  if (importList && importList.length > 0) {
    if (dir) {
      // 读取css
      importList.forEach((res) => {
        const inMatch = res.match(IMPORT_URL_REG)
        if (inMatch.length > 1) {
          // 媒体查询条件，这里不做检验
          const importMediaQuery = inMatch[3]
          const importPath = path.resolve(dir, inMatch[1] || inMatch[2])
          const importCode = fs.readFileSync(importPath)
          if (importCode) {
            const importDir = path.dirname(importPath)
            // 获取import文件里面的内容
            let importContent = processImport(importCode.toString(), importDir, log, depList)
            if (importMediaQuery) {
              importContent = wrapMediaCode(importContent, importMediaQuery)
            }
            mergeCode = mergeCode.replace(res, '\n' + importContent + '\n')
            depList.push(importPath)
          } else {
            log.push({
              line: 1,
              column: 1,
              reason: 'ERROR: 找不到文件 `' + res + '` , 导入失败'
            })
          }
        }
      })
    } else {
      log.push({
        line: 1,
        column: 1,
        reason: 'ERROR: 找不到资源路径, 无法处理@import'
      })
    }
  }
  return mergeCode
}

/**
 * 解析单个class为JSON对象
 * @param {Object} rule - ast的rule字段
 * @param {Object} jsonStyle - 当前页面所有css解析结果
 * @param {Object} ruleResult - 当前类的解析结果
 * @param {Array} log - log对象
 * @param {String} filePath - 文件路径
 * @param {Array} depFiles - 使用到的资源集合
 */
function processSingleClass(rule, jsonStyle, ruleResult, log, filePath, depFiles) {
  rule.declarations.forEach(function (declaration) {
    const subType = declaration.type

    // 只考虑声明类型
    if (subType !== 'declaration') {
      return
    }
    // 样式的属性和值
    const name = declaration.property
    const value = declaration.value

    // 校验属性值
    const camelCasedName = hyphenedToCamelCase(name)
    const subResult = validateDelaration(camelCasedName, value, {
      filePath
    })

    subResult.value.forEach((item) => {
      // 如果校验成功，则保存转换后的属性值
      if (isValidValue(item.v)) {
        ruleResult[item.n] = item.v
        if (shouldAddToDependency(item.n, item.v)) {
          depFiles.push(item.v)
        }
      }
    })

    if (subResult.log) {
      log.push({
        line: declaration.position.start.line,
        column: declaration.position.start.column,
        reason: subResult.log.reason
      })
    }
  })

  // 单个选择器：tag, class, id
  const REGEXP_SEL = /^[.#]?[A-Za-z0-9_\-:]+$/
  // 复合选择器：tag, class, id后代选择
  const REGEXP_SEL_COMPLEX = /^([.#]?[A-Za-z0-9_-]+(\s+|\s*>\s*))+([.#]?[A-Za-z0-9_\-:]+)$/
  rule.selectors.forEach(function (selector) {
    // 定义
    const hash = {
      key: selector,
      val: ruleResult
    }
    if (selector.match(REGEXP_SEL) || selector.match(REGEXP_SEL_COMPLEX)) {
      // 处理伪类
      const isValid = processPseudoClass(hash, log, rule)
      if (!isValid) {
        return
      }

      // 是否编译复合选择器,生成_meta信息
      if (!compileOptionsObject.optimizeDescMeta && selector.match(REGEXP_SEL_COMPLEX)) {
        try {
          hash.val = Object.assign({}, hash.val)
          hash.val._meta = {}
          hash.val._meta.ruleDef = compressDescSelector(cssWhat(hash.key))
        } catch (err) {
          log.push({
            line: rule.position.start.line,
            column: rule.position.start.column,
            reason: 'ERROR: 选择器 `' + hash.key + '` 不支持'
          })
          return
        }
      }

      // 如果样式已经存在,则叠加,覆盖同名属性
      jsonStyle[hash.key] = extend({}, jsonStyle[hash.key] || {}, hash.val)
    } else {
      log.push({
        line: rule.position.start.line,
        column: rule.position.start.column,
        reason: 'ERROR: 选择器 `' + selector + '` 非法'
      })
    }
  })
}

/**
 * 解析media query为JSON对象
 * @param {Object} rule - ast的rule字段
 * @param {Object} jsonStyleMedia - media部分所有css解析结果
 * @param {Array} log - log对象
 * @param {String} filePath - 文件路径
 * @param {String} upperCondition - 上级的查询条件,若本身为顶级则无此值
 * @param {Array} depFiles - 使用到的资源集合
 */
function processMediaQueryCss(rule, jsonStyleMedia, log, filePath, upperCondition, depFiles) {
  const validateResult = validateMediaCondition(rule.media)
  const currentCondition = validateResult.value
  const errorReason = validateResult.reason
  if (errorReason && errorReason.length > 0) {
    validateResult.reason.forEach((reason) => {
      log.push({
        line: rule.position.start.line,
        column: rule.position.start.column,
        reason
      })
    })
  }
  // 若无查询条件，判断为不合法，数据无效
  if (!currentCondition) {
    return
  }
  // 嵌套层级的条件用and连接起来
  const condition = upperCondition ? `${upperCondition} and ${currentCondition}` : currentCondition
  rule.rules.forEach((_rule) => {
    if (_rule.type === 'rule') {
      if (_rule.declarations && _rule.declarations.length) {
        let jsonClassMedia = findMediaClassByCondition(jsonStyleMedia, condition)
        const isNewCondition = !jsonClassMedia
        const ruleResult = {}

        if (isNewCondition) {
          jsonClassMedia = { condition }
        }
        processSingleClass(_rule, jsonClassMedia, ruleResult, log, filePath, depFiles)
        // 新的查询条件class需要push
        isNewCondition && jsonStyleMedia.push(jsonClassMedia)
      }
    } else if (_rule.type === 'media') {
      processMediaQueryCss(_rule, jsonStyleMedia, log, filePath, condition, depFiles)
    }
  })
}

/**
 * 处理伪类，将伪类写到Style的每个值上
 * @param hash
 * @return {boolean}
 */
function processPseudoClass(hash, log, rule) {
  // 处理伪选择器
  const pseudoIndex = hash.key.indexOf(':')
  if (pseudoIndex > -1) {
    const pseudoCls = hash.key.slice(pseudoIndex)
    if (!validatePseudoClass(pseudoCls)) {
      log.push({
        line: rule.position.start.line,
        column: rule.position.start.column,
        reason: 'ERROR: 不支持伪类选择器`' + pseudoCls + '`'
      })
      return false
    }
    hash.key = hash.key.slice(0, pseudoIndex)
    const pseudoRuleResult = {}
    // 将伪选择器text:active中的样式color属性名转换为color:active
    Object.keys(hash.val).forEach(function (prop) {
      pseudoRuleResult[prop + pseudoCls] = hash.val[prop]
    })
    hash.val = pseudoRuleResult
  }
  return true
}

export { processImport, processSingleClass, processMediaQueryCss, shouldAddToDependency }
