/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import exp from '../template/exp'

function isReserved(str) {
  // $开头
  const c = (str + '').charCodeAt(0)
  return c === 0x24
}

function checkParams(paramsObj, dep) {
  if (!paramsObj || Object.prototype.toString.call(paramsObj) !== '[object Object]') return

  Object.keys(paramsObj).forEach((key) => {
    if (isReserved(key)) {
      throw new Error(`<data> 事件 actions 中 params 参数名不能以 “$” 开头`)
    }

    if (exp.isExpr(paramsObj[key]) && dep > 1) {
      throw new Error(`<data> 事件 actions 中 params 参数值只支持一级结构中绑定变量`)
    }

    checkParams(paramsObj[key], dep + 1)
  })
}

export { checkParams }
