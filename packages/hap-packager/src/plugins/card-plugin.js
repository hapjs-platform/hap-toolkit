/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Compilation from 'webpack/lib/Compilation'
import path from 'path'
import { getStyleObjectId } from '@hap-toolkit/shared-utils'
import { getLastLoaderPath } from '../common/utils'
import {
  LOADER_INFO_LIST,
  LOADER_PATH_UX,
  LOADER_PATH_STYLE,
  LOADER_PATH_TEMPLATE
} from '../common/constant'
import {
  postHandleJSCardScriptRes,
  postHandleLiteCardTemplateRes,
  postHandleJSCardTemplateRes
} from '../post-handler'

const SUFFIX_UX = '.ux'
const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
const STYLE_OBJECT_ID = 'styleObjectId'

/**
 * Generate build output for light card.
 */
class CardPlugin {
  constructor(options = {}) {
    this.options = options || {}
  }

  apply(compiler) {
    let ConcatSource = compiler.webpack.sources.ConcatSource
    compiler.hooks.compilation.tap('CardPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'CardPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        () => {
          let { pathSrc } = this.options
          pathSrc = pathSrc.replace(/\\/g, '/')
          const moduleGraph = compilation.moduleGraph
          for (const chunk of compilation.chunks) {
            const entryModule = this.getEntryModule(compilation, chunk)
            if (!entryModule) {
              continue
            }
            const { rawRequest: entryRawRequest, request } = entryModule
            if (this.isCard(entryRawRequest)) {
              const { templateFileName, cssFileName, bundleFilePath } = this.getCardBuildPath(
                request,
                pathSrc
              )
              const templateRes = {
                [CARD_ENTRY]: {}
              }
              const styleRes = {}
              this.findOutgoingModules(
                moduleGraph,
                entryModule,
                templateRes,
                templateRes,
                styleRes,
                pathSrc,
                bundleFilePath
              )
              // 处理 template
              let handledCardTemplateRes
              if (this.isLiteCard(entryRawRequest)) {
                handledCardTemplateRes = postHandleLiteCardTemplateRes(templateRes)
              } else {
                handledCardTemplateRes = postHandleJSCardTemplateRes(templateRes)
              }

              // 用于修改 template 的 key 的 stringify 的顺序，type放第一个，children放最后一个
              let templateKeys = []
              recordKeys(handledCardTemplateRes, templateKeys)

              templateKeys = [...new Set(templateKeys.sort())]
                .filter(
                  (key) =>
                    key !== 'children' && key !== 'type' && key !== 'template' && key !== 'data'
                )
                .concat('children')
              templateKeys.unshift('type', 'template', 'data')

              Object.keys(handledCardTemplateRes).forEach((key) => {
                const res = handledCardTemplateRes[key]
                const fileName = key === CARD_ENTRY ? templateFileName : `${key}.template.json`
                const templateJsonStr = JSON.stringify(res, templateKeys)
                compilation.assets[fileName] = new ConcatSource(templateJsonStr)
              })
              // 处理 css
              compilation.assets[cssFileName] = new ConcatSource(JSON.stringify(styleRes))

              if (!this.isLiteCard(entryRawRequest)) {
                // 处理 script
                const reqPath = request.replace(/\\/g, '/')
                const reqArr = reqPath.split('!')
                const lastItem = reqArr[reqArr.length - 1]
                const pathArr = lastItem.split('?')
                const uxPath = pathArr[0]
                const relativeSrcPath = this.getRelativeCompPath(pathSrc, uxPath)
                const fileName = `${relativeSrcPath}.js`
                const scriptStr = postHandleJSCardScriptRes(
                  fileName,
                  compilation,
                  pathSrc,
                  cssFileName
                )
                compilation.assets[fileName] = new ConcatSource(scriptStr)
              }
            }
          }
        }
      )
    })
  }

  /**
   * Generate bundle JSON result for card
   * @param {*} moduleGraph webpack moduleGraph
   * @param {*} currModule current module
   * @param {*} currCompRes JSON result for current ux component
   * @param {*} templateRes JSON result for card
   * @param {*} styleRes JSON result for style
   * @param {*} pathSrc src path for current quickapp project
   * @param {*} compPath card ux component path
   */
  findOutgoingModules(
    moduleGraph,
    currModule,
    currCompRes,
    templateRes,
    styleRes,
    pathSrc,
    compPath
  ) {
    const moduleGraphConnection = moduleGraph.getOutgoingConnectionsByModule(currModule)

    if (moduleGraphConnection !== undefined) {
      for (const m of moduleGraphConnection.keys()) {
        const { rawRequest, _source, request } = m
        if (!this.isValidJsonModule(rawRequest)) {
          continue
        }
        const { _valueAsString, _valueAsBuffer } = _source || {}
        const sourceValueStr = _valueAsString || _valueAsBuffer?.toString() || ''
        let obj
        let jsonStr = sourceValueStr
        const sourceValueStrTrim = sourceValueStr.trim()
        if (sourceValueStrTrim.indexOf('module.exports') === 0) {
          jsonStr = sourceValueStrTrim.substring(sourceValueStrTrim.indexOf('{'))
          try {
            obj = JSON.parse(jsonStr)
          } catch (e) {
            console.error('invalid json:', e, '\n', jsonStr)
          }
        }
        const reqPath = request.replace(/\\/g, '/')
        const loaderPath = getLastLoaderPath(reqPath)
        let type = ''
        if (loaderPath) {
          const loaderItem = LOADER_INFO_LIST.find((item) => item.path === loaderPath)
          type = (loaderItem && loaderItem.type) || ''
        }
        const typeArr = LOADER_INFO_LIST.map((item) => item.type)
        const isCardRes = !!currCompRes['#entry']
        if (type === LOADER_PATH_UX.type) {
          const { compName, relativeSrcPath } = this.getComponentName(reqPath, pathSrc)
          // console.log('CardPlugin >>> compName, reqPath, relativeSrcPath:', compName, reqPath, relativeSrcPath)
          if (!compName) {
            throw new Error(`Build failed, invalid component name, path: ${reqPath}`)
          }

          if (isCardRes) {
            // card res
            if (!currCompRes[CARD_ENTRY][TYPE_IMPORT]) {
              currCompRes[CARD_ENTRY][TYPE_IMPORT] = {}
            }
            currCompRes[CARD_ENTRY][TYPE_IMPORT][compName] = relativeSrcPath
          } else {
            // component res
            if (!currCompRes[TYPE_IMPORT]) {
              currCompRes[TYPE_IMPORT] = {}
            }
            currCompRes[TYPE_IMPORT][compName] = relativeSrcPath
          }
          if (templateRes[relativeSrcPath]) {
            // console.log(`'Component ${compName} already resolved, relativeSrcPath=${relativeSrcPath}, uxPath=${uxPath}`)
            continue
          }

          const compRes = {}
          templateRes[relativeSrcPath] = compRes
          this.findOutgoingModules(
            moduleGraph,
            m,
            compRes,
            templateRes,
            styleRes,
            pathSrc,
            relativeSrcPath
          )
        } else if (typeArr.includes(type)) {
          if (type === LOADER_PATH_STYLE.type) {
            // styles
            const styleObjId = getStyleObjectId(compPath)
            styleRes[styleObjId] = obj
          } else if (type === LOADER_PATH_TEMPLATE.type) {
            // template
            const styleObjId = getStyleObjectId(compPath)
            if (isCardRes) {
              currCompRes[CARD_ENTRY][type] = obj
              currCompRes[CARD_ENTRY][type][STYLE_OBJECT_ID] = styleObjId
            } else {
              currCompRes[type] = obj
              currCompRes[type][STYLE_OBJECT_ID] = styleObjId
            }
          } else {
            isCardRes ? (currCompRes[CARD_ENTRY][type] = obj) : (currCompRes[type] = obj)
          }
        } else {
          console.warn('Invalid module:', type, rawRequest)
        }
      }
    }
  }

  getComponentName(reqPath, pathSrc) {
    if (!reqPath) {
      return {}
    }
    const loaderPath = getLastLoaderPath(reqPath)
    if (loaderPath === LOADER_PATH_UX.path) {
      const reqArr = reqPath.split('!')
      const lastItem = reqArr[reqArr.length - 1]
      const pathArr = lastItem.split('?')
      const uxPath = pathArr[0]
      const relativeSrcPath = this.getRelativeCompPath(pathSrc, uxPath)
      const paramStr = pathArr[1]
      const compUxType = 'uxType=comp'
      const namePrefix = 'name='
      let compName = relativeSrcPath
      if (paramStr && paramStr.includes(compUxType) && paramStr.includes(namePrefix)) {
        const paramArr = paramStr.split('&')
        const nameStr = paramArr.find((item) => item.indexOf(namePrefix) === 0)
        if (nameStr) {
          compName = nameStr.substring(namePrefix.length)
        }
      }
      return { compName, relativeSrcPath }
    }
    return {}
  }

  getRelativeCompPath(pathSrc, uxPath) {
    let relativeSrcPathStr = path.relative(pathSrc, uxPath)
    relativeSrcPathStr = relativeSrcPathStr.replace(/\\/g, '/')
    if (relativeSrcPathStr && relativeSrcPathStr.endsWith('.ux')) {
      return relativeSrcPathStr.substring(0, relativeSrcPathStr.length - SUFFIX_UX.length)
    }
    return relativeSrcPathStr
  }

  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&card=1&lite=1
  isCard(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return paramArr && paramArr.indexOf('card=1') >= 0 && paramArr.indexOf('uxType=card') >= 0
    }
    return false
  }

  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&card=1&lite=1
  isLiteCard(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return (
        paramArr &&
        paramArr.indexOf('card=1') >= 0 &&
        paramArr.indexOf('lite=1') >= 0 &&
        paramArr.indexOf('uxType=card') >= 0
      )
    }
    return false
  }

  isValidJsonModule(request) {
    const pathParamIndex = request.indexOf('?')
    const paramStr = request.substring(pathParamIndex + 1)
    const paramArr = paramStr.split('&')
    return paramArr && !paramArr.some((ele) => ele.indexOf('type=script') >= 0)
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
      bundleFilePath,
      templateFileName: `${bundleFilePath}.template.json`,
      cssFileName: `${bundleFilePath}.css.json`
    }
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
}

function recordKeys(liteCardRes, templateKeys) {
  const helper = function (obj) {
    if (!obj || typeof obj !== 'object') return

    const keys = Object.keys(obj)
    templateKeys.push(...keys)
    keys.forEach((key) => {
      return helper(obj[key], templateKeys)
    })
  }

  helper(liteCardRes, templateKeys)
}

export { CardPlugin }
