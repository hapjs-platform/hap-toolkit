/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import devicesEmitter from 'adb-devices-emitter'
import adbCommander from 'adb-commander'

import { colorconsole } from '@hap-toolkit/shared-utils'
import { recordClient, removeClientBySn } from '@hap-toolkit/shared-utils/lib/record-client'
import globalConfig from '@hap-toolkit/shared-utils/config'

import debuglog from './debuglog'

const REMOTE_REVERSE_PORT = 12306
const REMOTE_UP_FORWARD_PORT = 39517

/**
 * ADB Modules
 */
class ADBModule {
  /**
   * ADBModule constructor
   * @param option
   * @param option.localReversePort  {number} adb reverse命令使用的端口
   */
  constructor(option) {
    this.option = option
    // 当前连接的设备列表 sn: { upForwardPortPair:[localPort, remotePort], wsPortPair[localPort, remotePort] }
    this.currentDeviceMap = new Map()
    // 用来记录所有当前连接和已拔出的设备列表
    this.cachedDeviceMap = new Map()
    this.DEBUG = (process.env.NODE_DEBUG || '').split(',').includes('adb')
    // 记录localUpForwardPort(自增)的端口号, 初始值等于REMOTE_UP_FORWARD_PORT
    this._localUpForwardPort = REMOTE_UP_FORWARD_PORT
    this.commander = adbCommander
    this.devicesEmitter = devicesEmitter
    this._lastPromise = null

    this.emulators = new Map()

    this.init()
  }

  /**
   * 注册事件， 开始查询设备
   */
  init() {
    debuglog(`init(): start`)
    this.devicesEmitter.addEventListener('deviceAdded', (event) => {
      this._listen(event, this.onDeviceAdded.bind(this))
    })
    this.devicesEmitter.addEventListener('deviceRemoved', (event) => {
      this._listen(event, this.onDeviceRemoved.bind(this))
    })
    this.devicesEmitter.start()
  }

  /**
   * 确保队列式的调用顺序
   * @private
   */
  _listen(event, callback) {
    if (!this._lastPromise) {
      this._lastPromise = callback(event)
    } else {
      this._lastPromise = this._lastPromise.then(
        () => {
          return callback(event)
        },
        () => {
          return callback(event)
        }
      )
    }
  }

  /**
   * 取得一个_localUpForwardPort端口数字
   * @private
   */
  _getNextLocalForwardPort() {
    return this._localUpForwardPort++
  }

  /**
   * 处理每个新增设备
   * @desc
   * 为每一个设备执行以下操作：
   * 1. adb reverse tcp:${localReversePort} tcp:REMOTE_REVERSE_PORT,
   * 2. adb forward tcp:${localUpForwardPort} tcp:REMOTE_UP_FORWARD_PORT;
   * 3. 如果cachedDeviceList中存在当前新增设备, 且状态为已断开, 检查该设备是否
   * 已有wsForwardPort端口记录信息, 有则执行adb forward tcp:${wsPair[0]} tcp:${wsPair[1]};
   * 4. 为currentList中新增当前设备;
   * @param event
   * @param event.sn 设备序列号
   */
  async onDeviceAdded(event) {
    const { sn } = event
    colorconsole.info(`### App Server ### 设备"${sn}"被连入`)
    const { result } = await this.commander.getProp(sn)
    if (result) {
      this.emulators.set(result.trim(), sn)
    }
    const localReversePort = this.option.localReversePort
    // 建立reverse设定
    const reverseResult = await this.establishADBProxyLink('reverse', [
      sn,
      localReversePort,
      REMOTE_REVERSE_PORT
    ])
    if (reverseResult.err) {
      colorconsole.error(
        `### App Server ### onDeviceAdded(): (${sn})建立adb reverse失败(local port: ${localReversePort}, remote port: ${REMOTE_REVERSE_PORT})`
      )
      return
    }

    // 检查cachedDeviceList中的设备状况
    let currentDevice = this.cachedDeviceMap.get(sn)
    debuglog(
      `onDeviceAdded():(${sn})\ncachedDevice:\t${JSON.stringify(
        currentDevice
      )}\ncachedDeviceList:\t${JSON.stringify(Array.from(this.cachedDeviceMap.entries()))}`
    )

    // 建立forward update port设定
    if (!currentDevice || !currentDevice.upForwardPortPair) {
      currentDevice = {
        upForwardPortPair: [this._getNextLocalForwardPort(), REMOTE_UP_FORWARD_PORT]
      }
    }
    const upForwardResult = await this.establishADBProxyLink(
      'forward',
      [sn].concat(currentDevice.upForwardPortPair)
    )
    if (upForwardResult.err) {
      colorconsole.error(
        `### App Server ### onDeviceAdded(): (${sn})建立adb forward失败(local port: ${currentDevice.upForwardPortPair[0]}, remote port: ${currentDevice.upForwardPortPair[1]}) `
      )
      return
    }

    // 如果有记录的调试端口 为调试web socket建立forward
    if (currentDevice.wsPortPair) {
      const debugForwardResult = await this.establishADBProxyLink('forward', [
        sn,
        currentDevice.wsPortPair[0],
        currentDevice.wsPortPair[1]
      ])
      if (debugForwardResult.err) {
        colorconsole.warn(
          `### App Server ### onDeviceAdded():(${sn}) 建立adb forward失败(local port: ${currentDevice.wsPortPair[0]}, remote port: ${currentDevice.wsPortPair[1]})`
        )
        currentDevice.wsPortPair = undefined
      }
    }

    // 记录当前设备
    this.currentDeviceMap.set(sn, currentDevice)
    this.cachedDeviceMap.set(sn, currentDevice)
    // 记录发送update http请求需要的ip和端口
    await this._writeClientLogFile({
      sn,
      ip: `127.0.0.1`,
      port: currentDevice.upForwardPortPair[0]
    })
    debuglog(`onDeviceAdded():(${sn}) end`)
  }

  /**
   * 移除设备事件
   */
  async onDeviceRemoved(event) {
    const { sn } = event
    colorconsole.info(`### App Server ### 手机设备(${sn})被拔出`)
    this.currentDeviceMap.delete(sn)
    if (this.DEBUG) {
      debuglog(
        `deviceRemoved():(${sn}) cachedDeviceList: ${JSON.stringify(
          Array.from(this.cachedDeviceMap.entries())
        )}`
      )
      await this.commander.print(`adb -s ${sn} reverse --list`)
      await this.commander.print(`adb -s ${sn} forward --list`)
    }
    await this._removeItemFromClientLogFile(sn)
    debuglog(`deviceRemoved():(${sn}) end`)
  }

  /**
   * 记录一条端口映射条目
   */
  async _writeClientLogFile(newClient) {
    try {
      const { clientRecordPath } = globalConfig
      recordClient(clientRecordPath, newClient, (msg) => {
        debuglog(msg)
      })
    } catch (err) {
      colorconsole.error(
        `### App Server ### writeClientLogFile(): 写入hap-toolkit-client-records.json文件出错: ${err.message}`
      )
    }
  }

  /**
   * 从端口映射记录文件中移除一个条目
   */
  async _removeItemFromClientLogFile(sn) {
    try {
      const { clientRecordPath } = globalConfig
      removeClientBySn(clientRecordPath, sn, (msg) => {
        debuglog(msg)
      })
    } catch (err) {
      colorconsole.error(
        `### App Server ### _removeItemFromClientLogFile(): 移除hap-toolkit-client-records.json设备信息出错： ${err.message}`
      )
    }
  }

  /**
   * 建立Websocket连接的端口映射
   * @param sn 设备序列号
   * @param remoteWsPort Websocket连接的远程端口号
   * @returns {Promise.<{ localWsPort } | { err }>}
   */
  async forwardForWsChannel(sn, remoteWsPort) {
    let device = this.currentDeviceMap.get(sn)
    // 暂时localWsPort与remoteWsPort一样;
    const localWsPort = remoteWsPort

    if (!device) {
      const realSN = this.emulators.get(sn)
      colorconsole.warn(`### App Server ### 通过（${sn}）查找到设备${realSN}`)
      device = this.currentDeviceMap.get(realSN)
      if (device) {
        sn = realSN
      }
    }

    if (!device) {
      colorconsole.error(`### App Server ### 获取(${sn})设备信息失败`)
      return { localWsPort }
    }
    const wsPortPair = device.wsPortPair

    // 若之前不存在端口， 说明是第一次连接，否则可以不必设定
    if (wsPortPair && wsPortPair[0] === localWsPort && wsPortPair[1] === remoteWsPort) {
      return { localWsPort }
    }
    const { err } = await this.establishADBProxyLink('forward', [sn, localWsPort, remoteWsPort])
    if (err) {
      colorconsole.error(`### AppApp Server ### forwardForWsChannel(): 创建WebSocket端口映射失败`)
      device.wsPortPair = undefined
      return { err }
    }
    device.wsPortPair = [localWsPort, remoteWsPort]
    return { localWsPort }
  }

  /**
   * 建立adb reverse/forward通道
   * @param type {string} "reverse"|"forward"
   * @param args {array}  建立reverse/forward通道所需的参数. e.g. [sn, localPort, devicePort]
   */
  async establishADBProxyLink(type, args) {
    const result = await this.commander[type](...args)

    if (this.DEBUG) {
      debuglog(
        `establishADBReverseLink(): (${args[0]}) adb ${type} setup result: ${JSON.stringify(
          result
        )}`
      )
      await this.commander.print(`adb -s ${args[0]} ${type} --list`)
    }
    return result
  }

  _stop() {
    colorconsole.log(`### ADB stop`)
    this.devicesEmitter.stop()
  }
}

export default ADBModule
