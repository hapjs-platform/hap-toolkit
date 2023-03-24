/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import loaderUtils from 'loader-utils'
import { parseStyle } from '@hap-toolkit/compiler'
import { logWarn } from '@hap-toolkit/shared-utils'
import { compileOptionsObject } from '@hap-toolkit/shared-utils/compilation-config'

import { convertPath, getWebpackOptions } from './common/utils'

const componentId = (() => {
  const resourceMap = new Map()
  let uniqueId = 1

  return {
    get(resourcePath) {
      return resourceMap.get(resourcePath)
    },
    add(resourcePath) {
      if (!resourceMap.has(resourcePath)) {
        // 生成唯一ID
        resourceMap.set(resourcePath, uniqueId++)
      }
    }
  }
})()

module.exports = function (code) {
  const self = this
  const loaderQuery = loaderUtils.parseQuery(this.query)
  const suppresslogs = !!getWebpackOptions(this).suppresslogs
  const resourcePath = this.resourcePath // 当前文件绝对路径

  const { depList, log, depFiles, jsonStyle } = parseStyle({
    filePath: resourcePath,
    code: code,
    query: loaderQuery
  })

  if (compileOptionsObject.enableExtractCss) {
    componentId.add(resourcePath)
    if (jsonStyle) {
      jsonStyle[`@info`] = {
        styleObjectId: componentId.get(resourcePath)
      }
    }
  }

  const parsed = JSON.stringify(jsonStyle, null, 2)

  if (log && log.length) {
    logWarn(this, log, suppresslogs)
  }

  // Recompile while dependency changed
  depList.forEach(function (depFilePath) {
    self.addDependency(depFilePath)
  })

  depFiles.forEach((item) => {
    self.addDependency(convertPath(item))
  })

  return `module.exports = ${parsed}`
}
