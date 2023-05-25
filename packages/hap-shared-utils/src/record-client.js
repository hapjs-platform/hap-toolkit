/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import { colorconsole, mkdirsSync } from './index'
import globalConfig from './config'

/**
 * 读取记录文件
 * @param {String} clientRecordPath - 记录文件的地址
 * @returns {Object} - 记录的全部设备信息
 */
export function getRecords(clientRecordPath) {
  let recordData = { records: {} }
  try {
    recordData = JSON.parse(fs.readFileSync(clientRecordPath).toString())
  } catch (err) {
    colorconsole.error(`读取hap-toolkit-client-records.json文件出错: ${err.message}`)
  }
  return recordData
}

/**
 * 将设备记录写入记录文件
 * @param {String} clientRecordPath - 记录文件的地址
 * @param {Object} recordData - 要写入的全部设备记录
 */
function writeRecords(clientRecordPath, recordData) {
  fs.writeFileSync(clientRecordPath, JSON.stringify(recordData, null, 2))
}

/**
 * 读取一个项目的设备记录
 * @param {Object} recordData - 全部设备信息
 * @returns {Array} - 设备记录
 */
export function getProjectClients(recordData) {
  const projectPath = globalConfig.projectPath
  let records = recordData.records
  records = records instanceof Object ? records : {}
  const clients = records[projectPath]
  if (clients && clients instanceof Array) {
    return clients
  }
  return []
}

/**
 * 保存设备记录
 * @param {String} clientRecordPath - 记录文件的地址
 * @param {String} newClient - 新的设备记录
 * @param {callback} logHook - log信息的钩子，参数为要打印的信息
 */
export function recordClient(clientRecordPath, newClient, logHook) {
  const pathParentDir = path.dirname(clientRecordPath)
  const projectPath = globalConfig.projectPath
  let recordData
  mkdirsSync(pathParentDir)
  if (fs.existsSync(clientRecordPath)) {
    recordData = getRecords(clientRecordPath)
    let clients = getProjectClients(recordData)
    logHook && logHook(`writeClientLogFile(): before: ${JSON.stringify(recordData.records)}`)
    clients = clients.filter((client) => {
      return client.ip !== newClient.ip || client.port !== newClient.port
    })
    // 保留最后的4条记录，最多记录5条
    while (clients.length > 4) {
      clients.shift()
    }
    recordData.records[projectPath] = clients
  } else {
    recordData = { records: {} }
    recordData.records[projectPath] = []
  }
  // 写入文件
  recordData.records[projectPath].push(newClient)
  writeRecords(clientRecordPath, recordData)
  logHook && logHook(`writeClientLogFile(): after: ${JSON.stringify(recordData.records)}`)
}

/**
 * 根据设备sn和ip获取设备的记录
 * @param {String} clientRecordPath - 记录文件地址
 * @param {String} sn - 设备序列号
 * @param {String} ip
 * @returns {Object} - 匹配的设备记录
 */
export function getRecordClient(clientRecordPath, sn, ip) {
  if (fs.existsSync(clientRecordPath)) {
    const recordData = getRecords(clientRecordPath)
    const clients = getProjectClients(recordData)
    return clients.find((client) => {
      return client.sn === sn && client.ip === ip && client.port
    })
  }
}

/**
 * 清除一个项目的设备记录
 * @param {String} clientRecordPath
 */
export function clearProjectRecord(clientRecordPath) {
  if (fs.existsSync(clientRecordPath)) {
    const recordData = getRecords(clientRecordPath)
    const projectPath = globalConfig.projectPath

    recordData.records[projectPath] = []
    writeRecords(clientRecordPath, recordData)
    colorconsole.info('### App Server ### 清空调试设备记录')
  } else {
    colorconsole.info('### App Server ### 没有需要清空的调试设备记录')
  }
}

/**
 * 从端口映射记录文件中移除项目的一个设备记录
 * @param {String} clientRecordPath - 记录文件的地址
 * @param {String} sn - 设备序列号
 * @param {callback} logHook - log信息的钩子，参数为要打印的信息
 */
export function removeClientBySn(clientRecordPath, sn, logHook) {
  if (fs.existsSync(clientRecordPath)) {
    const projectPath = globalConfig.projectPath
    const recordData = getRecords(clientRecordPath)
    const records = recordData.records
    const clients = getProjectClients(recordData)
    logHook && logHook(`_removeItemFromClientLogFile(): before: ${JSON.stringify(records)}`)
    records[projectPath] = clients.filter((it) => {
      return it.sn !== sn
    })
    writeRecords(clientRecordPath, recordData)
    logHook && logHook(`_removeItemFromClientLogFile(): after: ${JSON.stringify(records)}`)
  }
}
