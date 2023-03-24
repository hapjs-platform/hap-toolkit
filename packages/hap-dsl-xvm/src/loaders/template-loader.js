/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import loaderUtils from 'loader-utils'

import { parseTemplate } from '@hap-toolkit/compiler'
import { logWarn } from '@hap-toolkit/shared-utils'

import { convertPath } from './common/utils'

module.exports = function (source) {
  const options = loaderUtils.parseQuery(this.resourceQuery)
  options['filePath'] = this.resourcePath
  const { parsed, log, depFiles } = parseTemplate(source, options)

  if (log && log.length) {
    logWarn(this, log)
  }
  depFiles.forEach((file) => {
    this.addDependency(convertPath(file))
  })
  return `module.exports = ${parsed}`
}
