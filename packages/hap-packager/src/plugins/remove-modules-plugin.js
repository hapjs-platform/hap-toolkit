/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  LOADER_INFO_LIST,
  LOADER_PATH_UX,
  LOADER_PATH_STYLE,
  LOADER_PATH_TEMPLATE
} from '../common/constant'
import { getLastLoaderPath } from '../common/utils'

class RemoveModulesPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('RemoveModulesPlugin', (compilation) => {
      // 在生成资源之前，遍历所有模块，删除 jscard 的 template 和 style 模块
      compilation.hooks.optimizeModules.tap('RemoveModulesPlugin', (modules) => {
        modules.forEach((module) => {
          const { _source, request } = module
          if (this.isJsCardAndCardcomp(request)) {
            const { _valueAsString, _valueAsBuffer } = _source || {}
            const moduleSource = _valueAsString || _valueAsBuffer?.toString() || ''
            const type = this.getRequestType(request)
            if (type === LOADER_PATH_UX.type) {
              // 从 chunk 中删除对 template 和 style 模块的依赖
              if (typeof moduleSource === 'string') {
                this.updateUXDependency(module)
              }
            }
          }
        })
      })
      // 在生成资源之前，遍历所有模块，删除 jscard 的 template 和 style 模块
      compilation.hooks.optimizeChunks.tap('RemoveModulesPlugin', (chunks) => {
        chunks.forEach((chunk) => {
          const chunkGraph = compilation.chunkGraph
          // 遍历模块
          const chunkModules = chunkGraph.getChunkModules(chunk)

          chunkModules.forEach((module) => {
            const { request } = module
            if (this.isJsCardAndCardcomp(request)) {
              const type = this.getRequestType(request)
              const typeArr = LOADER_INFO_LIST.map((item) => item.type)
              if (
                typeArr.includes(type) &&
                (type === LOADER_PATH_TEMPLATE.type || type === LOADER_PATH_STYLE.type)
              ) {
                // 从 chunk 中删除 template 和 style 模块内容
                chunkGraph.disconnectChunkAndModule(chunk, module)
              }
            }
          })
        })
      })
    })
  }
  getRequestType(request) {
    const reqPath = request.replace(/\\/g, '/')
    const loaderPath = getLastLoaderPath(reqPath)
    let type = ''
    if (loaderPath) {
      const loaderItem = LOADER_INFO_LIST.find((item) => item.path === loaderPath)
      type = (loaderItem && loaderItem.type) || ''
    }
    return type
  }
  updateUXDependency(module) {
    const dependencies = module.dependencies
    const templateDeps = dependencies.filter((dep) => {
      // 检查 ux 模块依赖，过滤对 template 模块的依赖
      const depRequest = dep.request
      const depRequestType = this.getRequestType(depRequest)
      return (
        depRequestType === LOADER_PATH_TEMPLATE.type || depRequestType === LOADER_PATH_STYLE.type
      )
    })

    // 更新模块的依赖列表
    templateDeps.forEach((dep) => {
      module.removeDependency(dep)
    })
  }
  // chunk.entryModule.rawRequest: ./src/cards/card/index.ux?uxType=card&card=1&lite=1
  isJsCardAndCardcomp(requestPath) {
    if (requestPath && requestPath.lastIndexOf('?') > 0) {
      const pathParamIndex = requestPath.lastIndexOf('?')
      const paramStr = requestPath.substring(pathParamIndex + 1)
      const paramArr = paramStr.split('&')
      return (
        paramArr &&
        paramArr.indexOf('card=1') >= 0 &&
        paramArr.indexOf('lite=1') < 0 &&
        (paramArr.indexOf('uxType=card') >= 0 || paramArr.indexOf('uxType=comp') >= 0)
      )
    }
    return false
  }
}

export { RemoveModulesPlugin }
