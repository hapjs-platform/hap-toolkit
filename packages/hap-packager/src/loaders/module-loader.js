/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { logWarn } from '@hap-toolkit/shared-utils'
import scripter from '@hap-toolkit/compiler/lib/script'
import { searchModuleImport } from '../common/shared'

/**
 * 处理模块的引用
 * @param {string} parsed - 前一级 loader 处理后的代码
 * @param {object} sourceMap - 前一级 loader 处理后的 sourceMap
 */
module.exports = function moduleLoader(parsed, sourceMap) {
  // 更新替换
  const fileRsut = searchModuleImport(parsed)
  // 内容替换
  parsed = fileRsut.fileCont
  // 打印日志
  logWarn(this, fileRsut.logFeatureList)
  // 引入替换
  parsed = scripter.replaceModuleImport(parsed)

  this.callback(null, parsed, sourceMap)
  /*eslint-disable*/
  return
}
