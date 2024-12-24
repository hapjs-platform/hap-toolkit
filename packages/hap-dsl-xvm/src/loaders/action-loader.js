/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { parseActions } from '@hap-toolkit/compiler'

export default function actionLoader(source) {
  let actionStr = ''
  try {
    const obj = JSON.parse(source)
    const jsonObj = obj.actions || {}
    const { parsed } = parseActions(jsonObj)
    actionStr = parsed
  } catch (e) {
    throw new Error(`${this.resourcePath} 中的 <data> 解析失败，请检查是否为标准的 JSON 格式\n${e}`)
  }
  return `module.exports = ${actionStr}`
}
