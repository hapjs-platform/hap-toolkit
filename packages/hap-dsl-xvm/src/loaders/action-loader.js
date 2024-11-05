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
    throw new Error(`Invalid <data> in ${this.resourcePath}\n${e}`)
  }
  return `module.exports = ${actionStr}`
}
