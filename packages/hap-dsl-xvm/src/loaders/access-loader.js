/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'
const globalConfig = require('@hap-toolkit/shared-utils/config')

/**
 * 添加ViewModel数据校验和处理代码。只有页面组件才需要, 子组件不需要
 * @param {string} source - 前一级 loader 处理后的代码
 * @param {object} sourceMap - 前一级 loader 处理后的 sourceMap
 */
module.exports = function accessLoader(source, sourceMap) {
  const isUseTreeShaking = !!globalConfig.useTreeShaking

  if (isUseTreeShaking) {
    source = source.replace(/export default |module.exports = /gm, 'const _module_exports = ')
  }

  const contentAccess = `\n
  ${
    isUseTreeShaking
      ? 'const moduleOwn = _module_exports'
      : 'const moduleOwn = exports.default || module.exports'
  }
  const accessors = ['public', 'protected', 'private']

  if (moduleOwn.data && accessors.some(function (acc) { return moduleOwn[acc] })) {
    throw new Error('页面VM对象中的属性data不可与"' + accessors.join(',') + '"同时存在，请使用private替换data名称')
  }
  else if (!moduleOwn.data) {
    moduleOwn.data = {}
    moduleOwn._descriptor = {}
    accessors.forEach(function (acc) {
      const accType = typeof moduleOwn[acc]
      if (accType === 'object') {
        moduleOwn.data = Object.assign(moduleOwn.data, moduleOwn[acc])
        for (const name in moduleOwn[acc]) {
          moduleOwn._descriptor[name] = { access: acc }
        }
      }
      else if (accType === 'function') {
        console.warn('页面VM对象中的属性' + acc + '的值不能是函数，请使用对象')
      }
    })
  }
  ${isUseTreeShaking ? 'export default _module_exports' : ''}
`
  source += contentAccess
  this.callback(null, source, sourceMap)
}
