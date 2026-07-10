/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { checkParams } from './validator'

/**
 * 解析并校验单个生命周期钩子（create 或 update）对象
 * @param {Object} hookObj - 形如 { params: { ... } }
 * @returns {Object}
 */
function parse(hookObj) {
  /**
   * "hookObj": {
      "params": {
        "lat": "{{ system.geolocation.getLocation({coordType:'gcj02'}).latitude }}",
        "deviceType": "{{ system.device.DEVICE_TYPE }}"
      }
    }
   */
  if (hookObj && Object.prototype.toString.call(hookObj) !== '[object Object]') {
    throw new Error(`<data> create/update 必须为 Object 对象`)
  }

  // 校验 params 合法性（规则与 actions params 一致）
  checkParams(hookObj.params, 1)

  return {
    jsonLifecycle: hookObj
  }
}

export default {
  parse
}
