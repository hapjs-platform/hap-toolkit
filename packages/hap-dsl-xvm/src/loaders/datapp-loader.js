/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
export default function dataAppLoader(source) {
  let jsonObj = {}
  try {
    const obj = JSON.parse(source)
    jsonObj = obj.app || {}
  } catch (e) {
    throw new Error(`${this.resourcePath} 中的 <data> 解析失败，请检查是否为标准的 JSON 格式\n${e}`)
  }
  return `module.exports = ${JSON.stringify(jsonObj)}`
}
