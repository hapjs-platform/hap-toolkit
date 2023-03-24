/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

import { parseScript } from '@hap-toolkit/compiler'
const globalConfig = require('@hap-toolkit/shared-utils/config')

module.exports = function (source, sourcemap) {
  const { parsed } = parseScript(source)
  const isUseTreeShaking = !!globalConfig.useTreeShaking
  let result = `${
    isUseTreeShaking
      ? parsed
      : `module.exports = function __scriptModule__ (module, exports, $app_require$){${parsed}}`
  }`
  // 去除ux文件后的唯一标识符，为istanbul服务
  if (sourcemap && sourcemap.sources) {
    sourcemap.sources = sourcemap.sources.map((path) => {
      let ret = path
      if (/.*\.ux\?.*/.test(path)) {
        ret = path.split('?')[0]
      }
      return ret
    })
  }

  this.callback(null, result, sourcemap)
  /*eslint-disable*/
  return
}
