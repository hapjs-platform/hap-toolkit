/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import http from 'http'
import {
  colorconsole,
  getServerIPAndPort,
  getIPv4IPAddress,
  getClientIPAddress
} from '@hap-toolkit/shared-utils'

export const LINK_MODE = {
  NULL: 0,
  WIFI: 1,
  ADB: 2
}

/**
 * 提供insepctor页面的打开地址
 * @param opt
 * @param opt.ws  手机端的websocket的地址
 * @param opt.serverPort 调试器server的所用端口号
 * @returns {string}
 */
export function getInspectorUrl({ ws, serverPort, traceId }) {
  const host = `http://${getServerIPAndPort(serverPort)}`
  const query = `?ws=${encodeURI(ws)}&remoteFrontend=true&dockSide=undocked&traceId=${traceId}`

  return `${host}/inspector/inspector.html${query}`
}

/**
 * 冗余方法，获取客户端的请求信息
 * @param request
 * @returns {{clientIp: (any|*|string), sn, linkMode}}
 */
function getClientFromRequest(request) {
  const clientIp = getClientIPAddress(request)
  const serverIp = getIPv4IPAddress()
  const sn = request.header['device-serial-number']
  let linkMode = LINK_MODE.NULL
  if (clientIp === '127.0.0.1' && sn) {
    linkMode = LINK_MODE.ADB
  } else if (clientIp !== '127.0.0.1' && clientIp !== serverIp) {
    linkMode = LINK_MODE.WIFI
  }
  return { clientIp, sn, linkMode }
}

/**
 * 获取请求信息
 * @param request
 * @returns {{sn, linkMode, ws, application, devicePort, target}}
 */
export function getDebugInfoFromRequest(request) {
  const { sn, linkMode } = getClientFromRequest(request)
  const { ws, application, target, traceId } = request.body
  const devicePort = ws.split(':')[1].split('/')[0]
  return { sn, linkMode, ws, application, devicePort, target, traceId }
}

/**
 * 告知设备SN的请求
 * 迫于device目前不支持POST，暂时把sn放在header中
 * @param client 本地存储的设备信息(ip、port、sn)
 */
export function callDeviceWithOwnSn(client) {
  const options = {
    host: client.ip,
    port: client.port,
    path: '/reportsn',
    headers: {
      'device-serial-number': client.sn
    },
    timeout: 3000
  }
  const req = http
    .request(options, () => {
      colorconsole.log(`### App Server ### 通知手机设备(${client.sn})下发SN成功`)
    })
    .on('error', (err) => {
      colorconsole.warn(
        `### App Server ### 通知手机设备(${client.sn})下发SN失败 错误信息: ${err.message}`
      )
    })
    .on('timeout', function () {
      colorconsole.warn(`### App Server ### 通知手机设备(${client.sn})下发SN失败`)
      req.abort()
    })
  req.end()
}
