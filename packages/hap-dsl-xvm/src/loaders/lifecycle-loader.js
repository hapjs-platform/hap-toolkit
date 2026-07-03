/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { parseLifecycle } from '@hap-toolkit/compiler'

export default function lifecycleLoader(source) {
  let lifecycleStr = ''
  try {
    const obj = JSON.parse(source)
    const jsonObj = obj.lifecycle || {}
    const { parsed } = parseLifecycle(jsonObj)
    lifecycleStr = parsed
  } catch (e) {
    throw new Error(`${this.resourcePath} 中的 <data> 解析失败，请检查是否为标准的 JSON 格式\n${e}`)
  }
  return `module.exports = ${lifecycleStr}`
}
