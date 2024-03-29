/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import $fetch from '@system.fetch'
import $utils from './utils'

Promise.prototype.finally = function (callback) {
  const P = this.constructor
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}

function requestHandle(params) {
  return new Promise((resolve, reject) => {
    $fetch
      .fetch({
        url: params.url,
        method: params.method,
        data: params.data,
      })
      .then((response) => {
        const result = response.data
        const content = JSON.parse(result.data)
        /* @desc: 可跟具体不同业务接口数据，返回你所需要的部分，使得使用尽可能便捷 */
        content.success ? resolve(content.value) : resolve(content.message)
      })
      .catch((error, code) => {
        console.log(`🐛 request fail, code = ${code}`)
        reject(error)
      })
      .finally(() => {
        console.log(`✔️ request @${params.url} has been completed.`)
        resolve()
      })
  })
}

export default {
  post: function (url, params) {
    return requestHandle({
      method: 'post',
      url: url,
      data: params,
    })
  },
  get: function (url, params) {
    return requestHandle({
      method: 'get',
      url: $utils.queryString(url, params),
    })
  },
  put: function (url, params) {
    return requestHandle({
      method: 'put',
      url: url,
      data: params,
    })
  },
  // 如果，method 您需要更多类型，可自行添加更多方法；
}
