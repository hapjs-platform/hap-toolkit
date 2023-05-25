/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
import path from 'path'
import css from 'css'
import { compileOptionsObject } from '@hap-toolkit/shared-utils'
import { validate as validateDelaration, mightReferlocalResource } from './validator'
import { compressCssAttr } from './compress'
import {
  processImport,
  processSingleClass,
  processMediaQueryCss,
  shouldAddToDependency
} from './process'
import { hyphenedToCamelCase, isEmptyObject, isValidValue } from '../utils'

/**
 * 解析<style>为JSON对象
 * @param {String} source - 源码
 * @returns {Object}
 */
function parse(source) {
  let err
  const jsonStyle = {}
  const log = []
  let depFiles = []

  let code = source.code || ''
  const filePath = source.filePath
  const curDir = path.dirname(filePath)
  // 引入的CSS文件列表
  const depList = []

  // 合并css
  code = processImport(code, curDir, log, depList)

  // css解析
  const ast = css.parse(code, { silent: true })

  // 异常处理，打印错误
  if (ast.stylesheet.parsingErrors && ast.stylesheet.parsingErrors.length) {
    err = ast.stylesheet.parsingErrors
    err.forEach(function (err) {
      log.push({
        line: err.line,
        column: err.column,
        reason: err.toString()
      })
    })
  }

  // 遍历
  if (
    ast &&
    ast.type === 'stylesheet' &&
    ast.stylesheet &&
    ast.stylesheet.rules &&
    ast.stylesheet.rules.length
  ) {
    // 遍历样式规则
    ast.stylesheet.rules.forEach(function (rule) {
      const type = rule.type
      const ruleResult = {}

      // 只考虑rule和fontface，其余暂时不支持
      if (type === 'rule') {
        if (rule.declarations && rule.declarations.length) {
          processSingleClass(rule, jsonStyle, ruleResult, log, filePath, depFiles)
        }
      }
      if (type === 'media') {
        if (!jsonStyle['@MEDIA']) {
          jsonStyle['@MEDIA'] = []
        }
        processMediaQueryCss(rule, jsonStyle['@MEDIA'], log, filePath, '', depFiles)
      } else if (type === 'font-face') {
        if (rule.declarations && rule.declarations.length) {
          const fontFaceObj = {}
          rule.declarations.forEach(function (declaration) {
            /* istanbul ignore if */
            if (declaration.type !== 'declaration') {
              return
            }

            const name = hyphenedToCamelCase(declaration.property)
            const value = declaration.value
            if (name === 'fontFamily') {
              // 记录字体名.剔除字体名的外层引号
              fontFaceObj.fontFamily = value.replace(/['"]+/g, '')
            } else if (name === 'src') {
              // 校验属性值
              const subResult = validateDelaration('fontSrc', value, {
                filePath
              })
              if (subResult.log) {
                log.push({
                  line: declaration.position.start.line,
                  column: declaration.position.start.column,
                  reason: subResult.log.reason
                })
              }
              fontFaceObj.src = subResult.value
              const srcFiles = subResult.value || []
              depFiles = depFiles.concat(srcFiles)
            }
          })

          // 所有的fontface放入一个对象中
          if (!jsonStyle['@FONT-FACE']) {
            jsonStyle['@FONT-FACE'] = {}
          }
          // 兼容之前平台版本
          fontFaceObj.fontName = fontFaceObj.fontFamily
          fontFaceObj.fontSrc = fontFaceObj.src

          jsonStyle['@FONT-FACE'][fontFaceObj.fontFamily] = fontFaceObj
        }
      } else if (type === 'keyframes') {
        if (rule.keyframes && rule.keyframes.length) {
          const name = rule.name
          const frameResult = []

          rule.keyframes.forEach(function (keyframe) {
            let keyResult
            /* istanbul ignore if */
            if (keyframe.type !== 'keyframe') {
              return
            }

            // 处理关键帧内部样式
            if (keyframe.declarations && keyframe.declarations.length) {
              keyResult = {}
              keyframe.declarations.forEach(function (declaration) {
                const subType = declaration.type

                /* istanbul ignore if */
                if (subType !== 'declaration') {
                  return
                }

                // 样式的属性和值
                const subname = declaration.property
                const subvalue = declaration.value
                // 校验属性值
                const subcamelCasedName = hyphenedToCamelCase(subname)
                const subResult = validateDelaration(subcamelCasedName, subvalue, { filePath })

                subResult.value.forEach((item) => {
                  // 如果校验成功，则保存转换后的属性值
                  if (isValidValue(item.v)) {
                    keyResult[item.n] = item.v
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

              // 检查对象是否为空
              if (isEmptyObject(keyResult)) {
                log.push({
                  line: rule.position.start.line,
                  column: rule.position.start.column,
                  reason:
                    'ERROR: 动画 `' +
                    name +
                    '` 的关键帧 `' +
                    JSON.stringify(keyframe.values) +
                    '` 没有有效的属性'
                })
              } else {
                // 可能包含多个
                let percentValue
                keyframe.values.forEach((v) => {
                  if (v === 'from') {
                    percentValue = 0
                  } else if (v === 'to') {
                    percentValue = 100
                  } else {
                    percentValue = parseFloat(v.replace('%', ''))
                  }
                  keyResult['time'] = percentValue
                  frameResult.push(keyResult)
                })
              }
            }
          })
          // 排序
          frameResult.sort(function (a, b) {
            return a.time - b.time
          })

          // 所有的keyframes放入一个数组中
          if (!jsonStyle['@KEYFRAMES']) {
            jsonStyle['@KEYFRAMES'] = {}
          }
          jsonStyle['@KEYFRAMES'][name] = frameResult
        }
      }
    })
  }
  // 是否压缩CSS属性名
  if (compileOptionsObject.optimizeCssAttr) {
    compressCssAttr(jsonStyle)
  }

  return {
    jsonStyle,
    depList,
    log,
    depFiles
  }
}

export default {
  parse,
  validateDelaration,
  mightReferlocalResource,
  shouldAddToDependency
}

export * from './process'
