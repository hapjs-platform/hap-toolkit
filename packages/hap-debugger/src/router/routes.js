/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs'

import qr from 'qr-image'

import { getRecords, getProjectClients } from '@hap-toolkit/shared-utils/lib/record-client'
import {
  getDeviceInfo,
  colorconsole,
  getServerIPAndPort,
  readJson
} from '@hap-toolkit/shared-utils'
import globalConfig from '@hap-toolkit/shared-utils/config'

import { startChrome, trackDebug, eventAlias } from '../utils'
import { getDebugInfoFromRequest, getInspectorUrl, LINK_MODE, callDeviceWithOwnSn } from './service'

/**
 * 定位到调试页面
 */
async function index(context, next) {
  const indexFile = path.resolve(__dirname, '../client/index.html')

  try {
    if (fs.existsSync(indexFile)) {
      context.set('Content-Type', 'text/html;charset=utf8')
      context.body = fs.createReadStream(indexFile)
    } else {
      await next()
      context.throw('404', `无法找到${indexFile}文件`)
    }
  } catch (err) {
    colorconsole.error(`### App Server ### 无法获取${indexFile}文件: ${err}`)
    context.body = `404 Not found ${indexFile}`
  }
}

/**
 * 手机注册的api
 */
async function register(context, next) {
  colorconsole.info(
    `### App Server ### 收到App注册信息, 格式:\n${JSON.stringify(context.request.body)}\n`
  )
  await next()
  const { ws, application } = context.request.body

  // 生成调试url，并且向页面输出调试APP信息
  const { serverPort } = context.conf.defaults
  const inspectorUrl = getInspectorUrl({ ws, serverPort })
  emitWSEvent(context.io, 'appRegistered', { inspectorUrl, application })
  colorconsole.info(`请访问以下链接进行调试：\n\n${inspectorUrl}\n`)
}

/**
 * @desc 适配老版本的应用加载器。
 * 使用老版本的应用加载器，会发送post到/, 并不会向/postwsid发请求；
 * 在新版本toolkit/老版本的应用加载器的组合下，用户将无法无法访问调试界面。因此提示用户更新应用加载器，并把请求转发至/postwsid;
 */
async function adapterForBackwardComp(context, next) {
  try {
    const body = context.request.body
    const { method, path } = context
    const isWs = 'ws' in body && body.ws.indexOf('inspector') >= 0
    const isHybridLoader = 'application' in body && body.application.indexOf('hybrid.loader') >= 0

    if (method.toLowerCase() === 'post' && path === '/' && isWs && isHybridLoader) {
      // 通知用户更新应用加载器版本
      colorconsole.warn('调试器已有重要更新，请更新调试器')
      emitWSEvent(context.io, 'informUpdate')
      const { ws, application } = body

      // 生成调试url，并且向页面输出调试APP信息
      const { serverPort } = context.conf.defaults
      const inspectorUrl = getInspectorUrl({ ws, serverPort })
      emitWSEvent(context.io, 'appRegistered', { inspectorUrl, application })
      colorconsole.info(`请访问以下链接进行调试：\n\n${inspectorUrl}\n`)
    } else {
      await next()
    }
  } catch (err) {
    colorconsole.error(`### App Server ### 出错信息: ${err.message}`)
    colorconsole.error(`### App Server ### 当前调试器与toolkit不兼容，请更新调试器。`)
    await next()
  }
}

/**
 * 二维码api
 */
async function qrCode(context, next) {
  const { serverPort } = context.conf.defaults
  const qrText = `http://${getServerIPAndPort(serverPort)}`
  const image = qr.image(qrText, {
    size: 9
  })
  await next()
  context.type = 'image/png'
  context.body = image
}

/**
 * 兼容android 10及其以上版本中，APP无法拿到设备SN的情况；向所有ADB连接的设备尝试下发告知设备自己的SN号码
 */
export async function searchSn(context, next) {
  context.status = 200
  const clientRecordPath = globalConfig.clientRecordPath
  try {
    if (fs.existsSync(clientRecordPath)) {
      const recordData = getRecords(clientRecordPath)
      const clients = getProjectClients(recordData)
      if (clients.length > 0) {
        colorconsole.log('### App Loader ### 通知设备开始下发SN')
        clients.forEach(function (client) {
          // 匹配hap-toolkit-client-records.json表里已存的通过ADB连接的设备信息
          if (client.ip === '127.0.0.1') {
            // 仅向ADB现在连接的且没有SN的设备下发SN请求
            getDeviceInfo(client, (err, data) => {
              if (err || data.sn) {
                return
              }
              callDeviceWithOwnSn(client)
            })
          }
        })
      }
    } else {
      await next()
      context.throw('404', `无法获取设备SN`)
    }
  } catch (err) {
    colorconsole.warn(`### App Server ### 没有记录设备信息，请尝试重新连接: ${err}`)
  }
}

/**
 * 适配支持调试器的开始调试请求， 自动打开chrome进程
 */
export async function startDebug(context, next) {
  context.status = 200
  const params = getDebugInfoFromRequest(context.request)
  const { sn, linkMode, devicePort, application, target, traceId } = params
  let ws = params.ws

  process.env['TRACE_ID'] = traceId || 'NULL'
  trackDebug(eventAlias.h_re_std, { DEVICE_SN: sn, DEVICE_PORT: devicePort })

  // ADB调试模式
  if (linkMode === LINK_MODE.ADB) {
    const { localWsPort, err } = await context.adbDebugger.forwardForWsChannel(sn, devicePort)
    if (err) {
      console.error(`startDebug(): adb forward 端口映射失败: ${err.message}`)
      trackDebug(eventAlias.h_forward_err)
      await next()
      return
    }
    // ws中是手机的端口号，ADB模式下需要替换为forward对应的pc端口
    ws = ws.replace(devicePort, localWsPort)
  }

  // 生成调试url，并且向页面输出调试APP信息
  const { serverPort } = context.conf.defaults
  const inspectorUrl = getInspectorUrl({ ws, serverPort, traceId })
  emitWSEvent(context.io, 'appRegistered', { inspectorUrl, application })
  colorconsole.info(`请访问以下链接进行调试：\n\n${inspectorUrl}\n`)

  // 将当前进行的操作及调试页面地址回传给调用方
  const cb = context.conf.options.callback
  if (cb && typeof cb === 'function') {
    // target表示调试器是否收到命令为启动骨架屏功能，将该参数回传给调用方
    // TODO：当前 ide、toolkit、调试器暂时以此方式连接通信，后续 ide 与调试器直接通信，可去掉 target 参数
    const params = { url: inspectorUrl, action: 'openDebugWin', target }
    cb(params)
  }
  // openDebugger 是否打开调试窗口
  trackDebug(eventAlias.h_ins_url, { inspectorUrl })
  if (context.conf.options.openDebugger !== false) {
    await startChrome(inspectorUrl, {
      chromePath: context.conf.options.chromePath
    })
  }
  await next()
}

/**
 * 接收 devtools 发来的保存骨架屏代码请求
 * context.request.body 三个参数：
 * page - 当前显示的页面
 * file - 要保存的文件名
 * code - 要保存的骨架屏代码
 */
export async function saveSkeletonFile(context, next) {
  context.status = 200
  try {
    const { page, code, file } = context.request.body
    const skeletonDir = path.join(globalConfig.projectPath, 'src/skeleton')
    if (!fs.existsSync(skeletonDir)) {
      fs.mkdirSync(skeletonDir)
    }

    const configFile = path.join(skeletonDir, 'config.json')
    let config
    if (fs.existsSync(configFile)) {
      config = readJson(configFile)
      // 配置只配置一个，一对一关系
      if (!config.singleMap[page]) {
        config.singleMap[page] = file
      }
    } else {
      config = {
        singleMap: {
          [page]: file
        }
      }
    }
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2))

    const pageDir = path.join(skeletonDir, 'page')
    if (!fs.existsSync(pageDir)) {
      fs.mkdirSync(pageDir)
    }

    const skFile = path.join(pageDir, file)
    fs.writeFileSync(skFile, code)
    context.body = {
      code: 0,
      msg: skFile
    }
    await next()
  } catch (err) {
    context.body = {
      code: 1,
      msg: err.message
    }
    await next()
  }
}

/**
 * 发送ws事件
 */
function emitWSEvent(wsSocket, evName, data) {
  wsSocket.sockets.emit(evName, data || {})
}

export default {
  index,
  register,
  adapterForBackwardComp,
  qrCode,
  searchSn,
  startDebug,
  saveSkeletonFile
}
