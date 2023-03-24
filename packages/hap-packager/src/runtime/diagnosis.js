/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @file 代理console全局对象，将日志输出到其他地方
 */

import fetch from '@system.fetch'
import device from '@system.device'

function initConsoleProxy(callback) {
  // eslint-disable-next-line no-new-func
  const quickappGlobal = new Function('return this')()
  const consoleMtdList = ['error', 'warn', 'info', 'log', 'debug', 'trace']

  consoleMtdList.forEach((mtdName) => {
    const _originFn = quickappGlobal.console[mtdName]

    quickappGlobal.console[mtdName] = function (...args) {
      // 原有调用
      _originFn.apply(quickappGlobal.console, args)
      // 额外输出
      const logName = `console.${mtdName}`
      callback(logName, args)
    }
  })

  console.info(``)
  console.info(``)
  console.info(`### Quickapp Application Diagnosis Start ###`)
}

/**
 * @param options {object}
 * @param options.url {string} 发送到服务器地址
 */
function pipeToFetchFactory(options) {
  let _hasNexttick = false

  let deviceUserId, deviceSerialId
  let deviceInfo = {}

  device.getUserId({
    success(data) {
      deviceUserId = data.userId
    }
  })

  device.getSerial({
    success(data) {
      deviceSerialId = data.serial
    }
  })

  device.getInfo({
    success(data) {
      const {
        brand,
        manufacturer,
        model,
        product,
        osType,
        osVersionName,
        osVersionCode,
        platformVersionName,
        platformVersionCode
      } = data
      deviceInfo = {
        brand,
        manufacturer,
        model,
        product,
        osType,
        osVersionName,
        osVersionCode,
        platformVersionName,
        platformVersionCode
      }
    }
  })

  const recordDataList = []

  return function logFetch(logType, logArgs) {
    recordDataList.push({
      // 记录时间
      time: Date.now(),
      // 记录源类型
      type: logType,
      // 记录内容
      args: logArgs
        .map((arg) => {
          if (arg && arg._id) {
            return Object.keys(arg)
          }
          return arg
        })
        .map((arg) => JSON.stringify(arg))
    })

    if (!_hasNexttick && recordDataList.length > 0) {
      _hasNexttick = true
      setTimeout(() => {
        // 先重置，避免请求时JS异常，导致以后无法发送
        _hasNexttick = false

        const reqRecordList = recordDataList.splice(0)

        fetch.fetch({
          url: options.url,
          method: 'POST',
          data: {
            info: {
              // 设备唯一
              deviceUserId,
              deviceSerialId,
              // 设备基本信息
              deviceInfo
            },
            list: reqRecordList
          },
          header: {
            'Content-Type': 'application/json'
          },
          success() {},
          fail(err) {
            console.log(err)
          }
        })
      }, 1e3)
    }
  }
}

/**
 * 启用代理console方法
 * @param { String } sap 地址端口
 */
function start(serverHost) {
  const url = `http://` + serverHost + `/data/log/save`
  initConsoleProxy(pipeToFetchFactory({ url }))
}

// // app.ux示例
// export default {
//   onCreate () {
//     require('./lib/diagnosis')('10.20.30.40:8000')
//   }
// }

export default start
