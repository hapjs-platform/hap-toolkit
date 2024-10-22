/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export default function actionLoader(source) {
  let jsonObj = {}
  try {
    const obj = JSON.parse(source)
    jsonObj = obj.actions || {}
  } catch (e) {
    throw new Error(`Invalid <data> in ${this.resourcePath}:: ${e}`)
  }
  return `module.exports = ${JSON.stringify(jsonObj)}`
}
