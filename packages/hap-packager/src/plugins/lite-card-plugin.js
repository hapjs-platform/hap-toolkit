/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Compilation from 'webpack/lib/Compilation'
import path from 'path'
import { getLastLoaderPath, calcDataDigest } from '../common/utils'
import { LOADER_INFO_LIST, LOADER_PATH_UX, LOADER_PATH_STYLE } from '../common/constant'

const SUFFIX_UX = '.ux'
const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
const STYLE_OBJECT_ID = 'styleObjectId'

/**
 * Generate build output for light card.
 */
class LiteCardPlugin {
  constructor(options = {}) {
    this.options = options || {}
  }

  apply(compiler) {
    let ConcatSource = compiler.webpack.sources.ConcatSource
    compiler.hooks.compilation.tap('LiteCardPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'LiteCardPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
        },
        () => {
          let { pathSrc } = this.options
          pathSrc = pathSrc.replace(/\\/g, '/')
          const moduleGraph = compilation.moduleGraph
          for (const chunk of compilation.chunks) {
            const entryModule = chunk.entryModule
            if (!entryModule) {
              // console.log('=== LiteCardPlugin no entry module:', chunk.name, entryModule)
              continue
            }
            const { rawRequest: entryRawRequest, request } = entryModule
            // console.log('LiteCardPlugin >>> entryRawRequest:', entryRawRequest)
            if (this.isLightCard(entryRawRequest)) {
              const { templateFileName, cssFileName, bundleFilePath } = this.getLightCardBuildPath(
                request,
                pathSrc
              )
              const liteCardRes = {
                [CARD_ENTRY]: {}
              }
              const styleRes = {}
              this.findOutgoingModules(
                moduleGraph,
                entryModule,
                liteCardRes,
                liteCardRes,
                styleRes,
                pathSrc,
                bundleFilePath
              )
              compilation.assets[templateFileName] = new ConcatSource(JSON.stringify(liteCardRes))
              compilation.assets[cssFileName] = new ConcatSource(JSON.stringify(styleRes))
            }
          }
        }
      )
    })
  }

  /**
   * Generate bundle JSON result for lite card
   * @param {*} moduleGraph webpack moduleGraph
   * @param {*} currModule current module
   * @param {*} currCompRes JSON result for current ux component
   * @param {*} liteCardRes JSON result for lite card
   * @param {*} styleRes JSON result for style
   * @param {*} pathSrc src path for current quickapp project
   * @param {*} compPath card ux component path
   */
  findOutgoingModules(
    moduleGraph,
    currModule,
    currCompRes,
    liteCardRes,
    styleRes,
    pathSrc,
    compPath
  ) {
    const moduleGraphConnection = moduleGraph.getOutgoingConnectionsByModule(currModule)

    if (moduleGraphConnection !== undefined) {
      for (const m of moduleGraphConnection.keys()) {
        const { rawRequest, _source, request } = m
        if (!rawRequest) {
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
          // console.log('LiteCardPlugin >>> compName, reqPath, relativeSrcPath:', compName, reqPath, relativeSrcPath)
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
          if (liteCardRes[relativeSrcPath]) {
            // console.log(`'Component ${compName} already resolved, relativeSrcPath=${relativeSrcPath}, uxPath=${uxPath}`)
            continue
          }

          const compRes = {}
          liteCardRes[relativeSrcPath] = compRes
          this.findOutgoingModules(
            moduleGraph,
            m,
            compRes,
            liteCardRes,
            styleRes,
            pathSrc,
            relativeSrcPath
          )
        } else if (typeArr.includes(type)) {
          if (type === LOADER_PATH_STYLE.type) {
            // styles
            const styleObjId = this.genStyleObjectId(compPath, styleRes)
            styleRes[styleObjId] = obj
            isCardRes
              ? (currCompRes[CARD_ENTRY][STYLE_OBJECT_ID] = styleObjId)
              : (currCompRes[STYLE_OBJECT_ID] = styleObjId)
          } else {
            isCardRes ? (currCompRes[CARD_ENTRY][type] = obj) : (currCompRes[type] = obj)
          }
        } else {
          console.warn('Invalid module:', type, rawRequest)
        }
      }
    }
  }

  genStyleObjectId(compPath, styleRes) {
    const digest = calcDataDigest(Buffer.from(compPath, 'utf-8'))
    const digestStr = digest.toString('hex')
    const len = Math.min(6, digestStr.length)
    let res = compPath
    for (let i = len; i < digestStr.length; i++) {
      res = digestStr.substring(0, i)
      if (styleRes[res]) {
        continue
      }
      break
    }
    return res
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

  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&lite=1
  isLightCard(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return paramArr && paramArr.indexOf('lite=1') >= 0 && paramArr.indexOf('uxType=card') >= 0
    }
    return false
  }

  getLightCardBuildPath(requestPath, pathSrc) {
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
}

export { LiteCardPlugin }
