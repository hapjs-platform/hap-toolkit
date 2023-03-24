/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// a normal module before builtin module
import foo from './foo'
import fetch from '@system.fetch'

export default {
  foo,
  fetch
}
