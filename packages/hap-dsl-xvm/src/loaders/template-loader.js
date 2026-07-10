/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import loaderUtils from 'loader-utils'

import { parseTemplate } from '@hap-toolkit/compiler'
import { logWarn } from '@hap-toolkit/shared-utils'

import { convertPath } from './common/utils'

export default function templateLoader(source) {
  const options = loaderUtils.parseQuery(this.resourceQuery)
  options['filePath'] = this.resourcePath
  const cardEntry = options.cardEntry
  const { parsed, log, depFiles } = parseTemplate(source, options)

  if (log && log.length) {
    logWarn(this, log)
    // 模板编译中的致命错误需要上报为 webpack 编译错误，以中断构建并使进程非零退出
    log.forEach((item) => {
      if (item.fatal) {
        const locationInfo = item.line && item.column ? ` @${item.line}:${item.column}` : ''
        this.emitError(new Error(`${this.resourcePath}${locationInfo} ${item.reason}`))
      }
    })
  }
  depFiles.forEach((file) => {
    let fileName = file
    if (cardEntry && file.startsWith('/node_modules')) {
      fileName = decodeURIComponent(cardEntry) + file
    }

    this.addDependency(convertPath(fileName))
  })
  return `module.exports = ${parsed}`
}
