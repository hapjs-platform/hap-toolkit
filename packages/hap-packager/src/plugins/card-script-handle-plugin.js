/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import Compilation from 'webpack/lib/Compilation'
import { getStyleObjectId, globalConfig } from '@hap-toolkit/shared-utils'
import loaderUtils from 'loader-utils'
import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as t from '@babel/types'

const PLUGIN_NAME = 'CardScriptHandlePlugin'
const SUFFIX_UX = '.ux'
const CARD_ENTRY = '#entry'

/**
 * 修改输出的 js 的内容：
 * 1. 增加 $json_require$方法，用于配合引擎读取 template.json 的内容
 * 2. style 通过 @info 来标记，用于配合引擎读取 css.json 的内容
 */
class CardScriptHandlePlugin {
  constructor(options = {}) {
    this.options = options || {}
  }

  apply(compiler) {
    let ConcatSource = compiler.webpack.sources.ConcatSource
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE
        },
        () => {
          let { pathSrc } = this.options
          pathSrc = pathSrc.replace(/\\/g, '/')
          for (const chunk of compilation.chunks) {
            const entryModule = this.getEntryModule(compilation, chunk)
            if (!entryModule) {
              continue
            }
            const { rawRequest: entryRawRequest, request } = entryModule
            // 只有新打包格式的JS卡会进行script的处理
            if (this.isNewJsCard(entryRawRequest)) {
              const { templateFileName, cssFileName } = this.getCardBuildPath(request, pathSrc)
              const jsAssetesName = this.getJsAssetsName(request, pathSrc)
              const source = compilation.assets[jsAssetesName].source()
              let newSource = source
              if (globalConfig.mode === 'development') {
                // 开发模式用字符串替换的方式，可以确保sourcemap行数对应正确
                newSource = this.getDevNewSource(source, cssFileName, templateFileName, pathSrc)
              } else {
                // 生产模式无需sourcemap，而字符串匹配替换方式失效，用ast分析的方式
                newSource = this.getProdNewSource(source, cssFileName, templateFileName, pathSrc)
              }

              compilation.assets[jsAssetesName] = new ConcatSource(newSource)
            }
          }
        }
      )
    })
  }
  getEntryModule(compilation, chunk) {
    const chunkModules = compilation.chunkGraph.getChunkModules(chunk)
    for (let i = 0; i < chunkModules.length; i++) {
      const module = chunkModules[i]
      if (compilation.chunkGraph.isEntryModuleInChunk(module, chunk)) {
        return module
      }
    }
    return null
  }
  getCardBuildPath(requestPath, pathSrc) {
    if (!requestPath || !pathSrc) {
      throw new Error(`Invalid request path or src path:\n${requestPath}\n${pathSrc}`)
    }
    requestPath = requestPath.replace(/\\/g, '/')
    // pathSrc = pathSrc.replace(/\\/g, '/')
    // const requestPathNormal = path.normalize(requestPath)
    const reqPathArr = requestPath.split('!')
    let uxPathStr = reqPathArr[reqPathArr.length - 1]
    if (uxPathStr.indexOf('?') > 0) {
      uxPathStr = uxPathStr.substring(0, uxPathStr.indexOf('?'))
    }
    const uxRelativePath = path.relative(pathSrc, uxPathStr)

    if (!uxRelativePath.endsWith(SUFFIX_UX)) {
      throw new Error(`Invalid relative path for ux:\n${uxRelativePath}`)
    }
    const bundleFilePath = `${uxRelativePath.substring(
      0,
      uxRelativePath.length - SUFFIX_UX.length
    )}`
    return {
      bundleFilePath: bundleFilePath.replace(/\\/g, '/'),
      templateFileName: `${bundleFilePath}.template.json`.replace(/\\/g, '/'),
      cssFileName: `${bundleFilePath}.css.json`.replace(/\\/g, '/')
    }
  }
  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&newJSCard=1&lite=1
  isNewJsCard(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return (
        paramArr && paramArr.indexOf('newJSCard=1') >= 0 && paramArr.indexOf('uxType=card') >= 0
      )
    }
    return false
  }
  getJsAssetsName(requestPath, pathSrc) {
    if (!requestPath || !pathSrc) {
      throw new Error(`Invalid request path or src path:\n${requestPath}\n${pathSrc}`)
    }
    requestPath = requestPath.replace(/\\/g, '/')
    // pathSrc = pathSrc.replace(/\\/g, '/')
    // const requestPathNormal = path.normalize(requestPath)
    const reqPathArr = requestPath.split('!')
    let uxPathStr = reqPathArr[reqPathArr.length - 1]
    if (uxPathStr.indexOf('?') > 0) {
      uxPathStr = uxPathStr.substring(0, uxPathStr.indexOf('?'))
    }
    const uxRelativePath = path.relative(pathSrc, uxPathStr)

    if (!uxRelativePath.endsWith(SUFFIX_UX)) {
      throw new Error(`Invalid relative path for ux:\n${uxRelativePath}`)
    }
    const bundleFilePath = `${uxRelativePath.substring(
      0,
      uxRelativePath.length - SUFFIX_UX.length
    )}`
    return `${bundleFilePath}.js`
  }
  getDevNewSource(source, cssFileName, templateFileName, pathSrc) {
    const sourceSplit = source.split('\n')
    let newSource = ''
    for (let i = sourceSplit.length - 1; i >= 0; i--) {
      const str = sourceSplit[i]
      if (devUtils.isStyleStr(str)) {
        sourceSplit.splice(i, 1, devUtils.getStyleExportsString(str, cssFileName, pathSrc))
      }
      if (devUtils.isTemplateStr(str)) {
        sourceSplit.splice(i, 1, devUtils.getTemplateExportsString(str, templateFileName, pathSrc))
      }
    }
    newSource += sourceSplit.join('\n')
    return newSource
  }
  getProdNewSource(source, cssFileName, templateFileName, pathSrc) {
    let newSource = ''
    const ast = parse(source, {
      sourceType: 'module'
    })

    // 用于在遍历 AST 时修改节点
    const visitor = {
      CallExpression(path) {
        const firstArg = path.node.arguments[0]
        if (prodUtils.isTemplateStr(firstArg)) {
          prodUtils.replaceTemplateStr(path, firstArg.value, templateFileName, pathSrc)
        } else if (prodUtils.isStyleStr(firstArg)) {
          prodUtils.replaceStyleStr(path, firstArg.value, cssFileName, pathSrc)
        }
      }
    }

    // 遍历 AST 并修改 exports.template 和 exports.style
    traverse(ast, visitor)

    // 生成修改后的代码
    newSource = generate(
      ast,
      {
        compact: true // 设置紧凑模式，省略多余的空格和换行
      },
      source
    ).code
    return prodUtils.replacePlaceHolder(newSource)
  }
}

const prodUtils = {
  isTemplateStr(firstArg) {
    if (!firstArg) return false
    return t.isStringLiteral(firstArg) && firstArg.value.includes('type=template')
  },
  isStyleStr(firstArg) {
    if (!firstArg) return false
    return t.isStringLiteral(firstArg) && firstArg.value.includes('type=style')
  },
  replaceTemplateStr(path, templateStr, templateFileName, pathSrc) {
    const compPath = this.getCompPath(templateStr, pathSrc)
    let templatePath = compPath
    if (templateFileName === `${compPath}.template.json`) {
      templatePath = CARD_ENTRY
    }
    const uniquePlaceHolder = `_START_PLACE_HOLDER_TEMPLATE_${templateFileName}_${templatePath}_END_`
    path.replaceWith(t.stringLiteral(uniquePlaceHolder))
  },
  replaceStyleStr(path, styleStr, cssFileName, pathSrc) {
    const compPath = this.getCompPath(styleStr, pathSrc)
    const styleObjId = getStyleObjectId(compPath)
    const uniquePlaceHolder = `_START_PLACE_HOLDER_CSS_${cssFileName}_${styleObjId}_END_`
    path.replaceWith(t.stringLiteral(uniquePlaceHolder))
  },
  replacePlaceHolder(code) {
    // 正则表达式匹配_idX_valY_place_holder_格式的字符串
    const regexTemplate = /["'`]_START_PLACE_HOLDER_TEMPLATE_([^\s]+?)_([^\s]+?)_END_["'`]/g

    // 替换 template 的 placeholder
    code = code.replace(regexTemplate, function (match, templateFileName, templatePath) {
      return `$json_require$("${templateFileName}",{"componentPath":"${templatePath}"})`
    })
    const regexCss = /["'`]_START_PLACE_HOLDER_CSS_([^\s]+?)_([^\s]+?)_END_["'`]/g

    // 替换 css 的 placeholder
    code = code.replace(regexCss, function (match, cssFileName, styleObjId) {
      return JSON.stringify({
        '@info': { styleObjectId: styleObjId },
        extracted: true,
        jsonPath: cssFileName
      })
    })

    return code
  },
  getRelativeCompPath(pathSrc, uxPath) {
    let relativeSrcPathStr = path.relative(pathSrc, uxPath)
    relativeSrcPathStr = relativeSrcPathStr.replace(/\\/g, '/')
    if (relativeSrcPathStr && relativeSrcPathStr.endsWith('.ux')) {
      return relativeSrcPathStr.substring(0, relativeSrcPathStr.length - SUFFIX_UX.length)
    }
    return relativeSrcPathStr
  },
  getCompPath(request, pathSrc) {
    const reqArr = request.split('!')
    const lastItem = reqArr[reqArr.length - 1]
    const pathArr = lastItem.split('?')
    const query = pathArr[pathArr.length - 1]
    const resourceQuery = loaderUtils.parseQuery(query ? `?${query}` : '?')

    const uxPath = resourceQuery.uxPath
    return this.getRelativeCompPath(pathSrc, uxPath)
  }
}

const devUtils = {
  isTemplateStr(str) {
    return str.indexOf('type=template') >= 0 && str.indexOf('__webpack_require__') >= 0
  },
  isStyleStr(str) {
    return str.indexOf('type=style') >= 0 && str.indexOf('__webpack_require__') >= 0
  },
  getTemplateExportsString(str, templateFileName, pathSrc) {
    const compPath = this.getCompPath(str, pathSrc)
    let templatePath = compPath
    if (templateFileName === `${compPath}.template.json`) {
      templatePath = CARD_ENTRY
    }
    return `$app_module$.exports.template = $json_require$("${templateFileName}", { "componentPath": "${templatePath}" })`
  },
  getStyleExportsString(str, cssFileName, pathSrc) {
    const compPath = this.getCompPath(str, pathSrc)
    const styleObjId = getStyleObjectId(compPath)
    return `$app_module$.exports.style = { "@info": { "styleObjectId": "${styleObjId}" }, "extracted": true, "jsonPath": "${cssFileName}" }`
  },
  getRelativeCompPath(pathSrc, uxPath) {
    let relativeSrcPathStr = path.relative(pathSrc, uxPath)
    relativeSrcPathStr = relativeSrcPathStr.replace(/\\/g, '/')
    if (relativeSrcPathStr && relativeSrcPathStr.endsWith('.ux')) {
      return relativeSrcPathStr.substring(0, relativeSrcPathStr.length - SUFFIX_UX.length)
    }
    return relativeSrcPathStr
  },
  // 通过匹配__webpack_require__('xxxx')中的值来获取组件名
  getCompPath: function (str, pathSrc) {
    const regex = /__webpack_require__\("([^"]+)"\)/
    const match = str.match(regex)

    if (match && match[1]) {
      const request = match[1]
      const reqArr = request.split('!')
      const lastItem = reqArr[reqArr.length - 1]
      const pathArr = lastItem.split('?')
      const query = pathArr[pathArr.length - 1]
      const resourceQuery = loaderUtils.parseQuery(query ? `?${query}` : '?')

      const uxPath = resourceQuery.uxPath
      return this.getRelativeCompPath(pathSrc, uxPath)
    } else {
      return ''
    }
  }
}

export { CardScriptHandlePlugin }
