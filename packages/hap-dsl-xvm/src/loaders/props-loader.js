/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export default function propsLoader(source) {
  let jsonObj = {}
  try {
    const obj = JSON.parse(source)
    jsonObj = obj.props || {}
  } catch (e) {
    throw new Error(`Invalid <data> in props loader:: ${e}`)
  }
  return `module.exports = ${JSON.stringify(jsonObj)}`
}
