/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Compilation from 'webpack/lib/Compilation'
import path from 'path'
import { getLastLoaderPath } from '../common/utils'
import { LOADER_INFO_LIST, LOADER_PATH_UX } from '../common/constant'

const SUFFIX_UX = '.ux'

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
          const { pathSrc } = this.options
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
              const fileName = this.getLightCardBuildPath(request, pathSrc)
              const liteCardRes = {}
              this.findOutgoingModules(moduleGraph, entryModule, liteCardRes, liteCardRes, pathSrc)
              const str = JSON.stringify(liteCardRes)
              compilation.assets[fileName] = new ConcatSource(str)
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
   * @param {*} pathSrc src path for current quickapp project
   */
  findOutgoingModules(moduleGraph, currModule, currCompRes, liteCardRes, pathSrc) {
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
        if (type === LOADER_PATH_UX.type) {
          // recursive
          const { compName, relativeSrcPath } = this.getComponentName(reqPath, pathSrc)
          // console.log('LiteCardPlugin >>> compName, reqPath, relativeSrcPath:', compName, reqPath, relativeSrcPath)
          if (!compName) {
            throw new Error(`Build failed, invalid component name, path: ${reqPath}`)
          }

          if (!currCompRes['import']) {
            currCompRes['import'] = {}
          }
          currCompRes['import'][compName] = relativeSrcPath
          if (liteCardRes[relativeSrcPath]) {
            // console.log(`'Component ${compName} already resolved, relativeSrcPath=${relativeSrcPath}, uxPath=${uxPath}`)
            continue
          }

          const compRes = {}
          liteCardRes[relativeSrcPath] = compRes
          this.findOutgoingModules(moduleGraph, m, compRes, liteCardRes, pathSrc)
        } else if (typeArr.includes(type)) {
          currCompRes[type] = obj
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
      const paramStr = pathArr[1]
      const compUxType = 'uxType=comp'
      const namePrefix = 'name='
      if (paramStr && paramStr.includes(compUxType) && paramStr.includes(namePrefix)) {
        const paramArr = paramStr.split('&')
        const nameStr = paramArr.find((item) => item.indexOf(namePrefix) === 0)
        const compName = nameStr && nameStr.substring(namePrefix.length)
        const uxPath = pathArr[0]
        const relativeSrcPath = this.getRelativeCompPath(pathSrc, uxPath)
        return { compName, relativeSrcPath }
      }
    }
    return {}
  }

  getRelativeCompPath(pathSrc, uxPath) {
    const relativeSrcPathStr = path.relative(pathSrc, uxPath)
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
    pathSrc = pathSrc.replace(/\\/g, '/')
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
    return `${uxRelativePath.substring(0, uxRelativePath.length - SUFFIX_UX.length)}.json`
  }
}

export { LiteCardPlugin }
