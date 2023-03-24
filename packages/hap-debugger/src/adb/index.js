/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { colorconsole } from '@hap-toolkit/shared-utils'
import debuglog from './debuglog'
import ADBModule from './module'

function createADBDebugger(option) {
  debuglog(`createADBDebugger(): start`)
  const adbModule = new ADBModule(option)
  colorconsole.info(`### App Server ### 完成创建adb调试器。您可以通过usb线连入手机调试`)
  return adbModule
}

export { createADBDebugger }
