/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { checkParams } from './validator'

function parse(actionObj) {
  /**
   * "actionObj": {
      "jumpWithParams": {
        "type": "router",
        "url": "{{jumpParamsUrl}}",
        "params": {
          "type": "{{jumpParam}}"
        }
      },
    }
   */
  if (actionObj && Object.prototype.toString.call(actionObj) !== '[object Object]') {
    throw new Error(`<data> 事件 actions 必须为 Object 对象`)
  }

  // 检查params参数合法性
  Object.keys(actionObj).forEach((key) => {
    checkParams(actionObj[key].params, 1)
  })

  return {
    jsonAction: actionObj
  }
}

export default {
  parse
}
