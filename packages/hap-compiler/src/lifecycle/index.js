/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { checkParams } from './validator'

// lifecycle 支持的钩子
const LIFECYCLE_HOOKS = ['create', 'update']

function parse(lifecycleObj) {
  /**
   * "lifecycleObj": {
      "create": {
        "params": {
          "lat": "{{ system.geolocation.getLocation({coordType:'gcj02'}).latitude }}",
          "deviceType": "{{ system.device.DEVICE_TYPE }}"
        }
      },
      "update": {
        "params": {
          "deviceType": "{{ system.device.DEVICE_TYPE }}"
        }
      }
    }
   */
  if (lifecycleObj && Object.prototype.toString.call(lifecycleObj) !== '[object Object]') {
    throw new Error(`<data> lifecycle 必须为 Object 对象`)
  }

  // 校验 create/update 钩子的 params 合法性
  LIFECYCLE_HOOKS.forEach((hook) => {
    const hookObj = lifecycleObj[hook]
    if (hookObj) {
      if (Object.prototype.toString.call(hookObj) !== '[object Object]') {
        throw new Error(`<data> lifecycle.${hook} 必须为 Object 对象`)
      }
      checkParams(hookObj.params, 1)
    }
  })

  return {
    jsonLifecycle: lifecycleObj
  }
}

export default {
  parse
}
