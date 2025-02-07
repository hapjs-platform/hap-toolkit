/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import Compilation from 'webpack/lib/Compilation'
import { getStyleObjectId } from '@hap-toolkit/shared-utils'
import loaderUtils from 'loader-utils'

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
            if (this.isJsCard(entryRawRequest)) {
              const { templateFileName, cssFileName } = this.getCardBuildPath(request, pathSrc)
              const jsAssetesName = this.getJsAssetsName(request, pathSrc)
              const sourceSplit = compilation.assets[jsAssetesName].source().split('\n')

              let newSource = ''
              for (let i = sourceSplit.length - 1; i >= 0; i--) {
                const str = sourceSplit[i]
                if (this.isStyleStr(str)) {
                  sourceSplit.splice(i, 1, this.getStyleExportsString(str, cssFileName, pathSrc))
                }
                if (this.isTemplateStr(str)) {
                  sourceSplit.splice(
                    i,
                    1,
                    this.getTemplateExportsString(str, templateFileName, pathSrc)
                  )
                }
              }
              newSource += sourceSplit.join('\n')
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
  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&card=1&lite=1
  isJsCard(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return (
        paramArr &&
        paramArr.indexOf('card=1') >= 0 &&
        paramArr.indexOf('uxType=card') >= 0 &&
        paramArr.indexOf('lite=1') < 0
      )
    }
    return false
  }
  getTemplateExportsString(str, templateFileName, pathSrc) {
    const compPath = this.getCompPath(str, pathSrc)
    let templatePath = compPath
    if (templateFileName === `${compPath}.template.json`) {
      templatePath = CARD_ENTRY
    }
    return `$app_module$.exports.template = $json_require$("${templateFileName}", { "componentPath": "${templatePath}" })`
  }
  getStyleExportsString(str, cssFileName, pathSrc) {
    const compPath = this.getCompPath(str, pathSrc)
    const styleObjId = getStyleObjectId(compPath)
    return `$app_module$.exports.style = { "@info": { "styleObjectId": "${styleObjId}" }, "extracted": true, "jsonPath": "${cssFileName}" }`
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
  isTemplateStr(str) {
    return str.indexOf('type=template') >= 0 && str.indexOf('__webpack_require__') >= 0
  }
  isStyleStr(str) {
    return str.indexOf('type=style') >= 0 && str.indexOf('__webpack_require__') >= 0
  }
  getRelativeCompPath(pathSrc, uxPath) {
    let relativeSrcPathStr = path.relative(pathSrc, uxPath)
    relativeSrcPathStr = relativeSrcPathStr.replace(/\\/g, '/')
    if (relativeSrcPathStr && relativeSrcPathStr.endsWith('.ux')) {
      return relativeSrcPathStr.substring(0, relativeSrcPathStr.length - SUFFIX_UX.length)
    }
    return relativeSrcPathStr
  }
  // 通过匹配__webpack_require__('xxxx')中的值来获取组件名
  getCompPath(str, pathSrc) {
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
