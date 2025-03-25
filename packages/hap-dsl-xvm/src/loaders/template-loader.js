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
