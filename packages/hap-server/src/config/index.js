/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'

// 路径
const pathToolkit = path.resolve(__dirname, '../../..')

export default {
  defaults: {
    pathToolkit
  },
  options: {
    moduleList: []
  }
}
