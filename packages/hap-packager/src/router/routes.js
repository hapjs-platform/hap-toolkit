/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs-extra'
import path from '@jayfate/path'
import qr from 'qr-image'
import moment from 'moment'

import { colorconsole, relateCwd } from '@hap-toolkit/shared-utils'
import globalConfig from '@hap-toolkit/shared-utils/config'
import { recordClient, getRecordClient } from '@hap-toolkit/shared-utils/lib/record-client'

import {
  getProjectInfo,
  getServerAddress,
  getClientFromRequest,
  getDistFilePath,
  LINK_MODE
} from './service'

const CLIENT_PORT = 39517

// 能使用rpks能力的调试器最低版本
const RPKS_SUPPORT_VERSION_FROM = 1040

/**
 * 主页
 */
async function index(context, next) {
  // 默认展示二维码
  const port = context.app.server.address().port
  const data = getServerAddress(port)
  const image = qr.image(data, { size: 9 })
  context.type = 'image/png'
  context.body = image
  await next()
}

/**
 * 下载rpks/rpk
 */
async function bundle(context, next) {
  const { projectPath } = globalConfig
  const projectDist = path.join(projectPath, globalConfig.releasePath)
  let distFile

  const { options = {} } = context.conf
  // 如果有配置指定预览某个rpk
  if (options.rpkPath) {
    distFile = options.rpkPath
    if (!path.isAbsolute(distFile)) {
      distFile = path.join(projectPath, options.rpkPath)
    }
    colorconsole.log(`### App Server ### 指定返回rpk：${distFile}`)
  } else {
    const projectInfo = getProjectInfo(projectPath, globalConfig.sourceRoot)
    const projectName = projectInfo.projectName
    const projectVersion = projectInfo.projectVersion
    const platformVersion = context.request.query.platformVersion
    if (platformVersion && platformVersion >= RPKS_SUPPORT_VERSION_FROM) {
      distFile = getDistFilePath(projectDist, projectName, projectVersion, 'rpks')
    }
    if (!distFile) {
      distFile = getDistFilePath(projectDist, projectName, projectVersion, 'rpk')
    }
  }

  if (distFile) {
    context.set('Content-Type', 'application/octet-stream')
    context.set('Content-Transfer-Encoding', 'binary')
    context.set('Content-Disposition', `attachment; filename=${path.basename(distFile)}`)
    context.body = fs.createReadStream(distFile)
  } else {
    colorconsole.error(
      `### App Server ### 项目${relateCwd(projectDist)}目录下不存在rpk或rpks文件：${projectDist}`
    )
    context.throw('404', `无法找到项目的rpks或rpk文件`)
  }
  await next()
}

/**
 * 记录最新的用户进入的请求
 */
async function logger(context, next) {
  try {
    // 文件路径
    const { clientRecordPath } = globalConfig
    const { sn, clientIp, linkMode } = getClientFromRequest(context.request)
    let client = {
      sn: sn,
      ip: clientIp,
      port: CLIENT_PORT
    }
    switch (linkMode) {
      case LINK_MODE.WIFI:
        colorconsole.info(`### App Server ### 记录从${clientIp}进入的HTTP请求`)
        recordClient(clientRecordPath, client)
        break
      case LINK_MODE.ADB:
        // ADB模式下需要先读取连接时记录的信息
        client = getRecordClient(clientRecordPath, sn, clientIp)
        if (!client) {
          const realSN = context.adbDebugger.emulators.get(sn)
          colorconsole.warn(`### App Server ### 通过（${sn}）查找到设备${realSN}`)
          client = getRecordClient(clientRecordPath, realSN, clientIp)
        }
        if (client) {
          colorconsole.info(`### App Server ### 记录从设备(${sn})进入的HTTP请求`)
          recordClient(clientRecordPath, client)
        } else {
          colorconsole.warn(`### App Server ### ：记录设备(${sn})失败`)
        }
        break
    }
    await next()
  } catch (err) {
    colorconsole.error(`### App Server ### 记录log出错: ${err.message}`)
  }
}

/**
 * 记录手机ip，触发回调
 */
async function notify(context, next) {
  const callback = context.conf.options.callback
  if (typeof callback === 'function') {
    const params = { action: 'runCompile' }
    callback(params)
  }
  context.status = 200
  await next()
}

/**
 * 二维码api
 */
async function qrCode(context, next) {
  const port = context.app.server.address().port
  const data = getServerAddress(port)
  const image = qr.image(data, { size: 9 })
  await next()
  context.type = 'image/png'
  context.body = image
}

async function saveDataCoverage(context, next) {
  const reqDataCoverage = context.request.body.coverage
  if (!reqDataCoverage) {
    context.throw(`请求错误，请携带相关的代码覆盖率数据作为请求参数！`)
  }

  const { projectPath, dataCoverage } = globalConfig
  const projectDataCoverageDir = path.join(projectPath, dataCoverage)
  if (!fs.existsSync(projectDataCoverageDir)) {
    fs.mkdirSync(projectDataCoverageDir)
  }

  colorconsole.info(`### App Server ### 保存项目运行后的代码覆盖率数据到目录：${dataCoverage}`)
  const filename = `${moment().format('YYYYMMDD-HH-mm-ss')}.json`
  const projectDataCoverageFile = path.join(projectDataCoverageDir, filename)
  fs.writeFileSync(projectDataCoverageFile, JSON.stringify(reqDataCoverage))
  context.status = 200
}

/**
 * 提取log信息，并写入文件
 * @param context
 * @param next
 */
async function saveDataLogs(context, next) {
  const info = context.request.body.info
  const reqDataList = context.request.body.list
  const {
    // 设备唯一
    // deviceUserId,
    deviceSerialId,
    // 设备基本信息
    deviceInfo: { brand, model }
  } = info

  if (!reqDataList) {
    context.throw(`请求错误，请携带相关的日志记录数据！`)
  }

  // 1. 在项目中创建目录，如：logs
  const logDir = path.resolve(globalConfig.projectPath, 'logs')
  fs.ensureDirSync(logDir)

  // 2. 将数据写入文件中
  const deviceId = encodeURIComponent(deviceSerialId)
  const modelName = model.split(' ').join('_')
  const fileName = path.resolve(logDir, `quickapp-${deviceId}-${brand}-${modelName}.log`)

  let fileContent = reqDataList
    .map((logLineItem) => {
      const { time, type, args } = logLineItem
      const timeNow = moment(time).format('YYYY.MM.DD hh:mm:ss.SSS')
      const logType = type.padStart(18, ' ')

      return `${timeNow} ${logType}: ${args}\n`
    })
    .join('')

  // 3. 每行格式如下：2020.03.21 16:04:21.234 console.debug XXX日志；
  fs.appendFile(fileName, fileContent, (err) => {
    if (err) {
      console.log(err)
    }
  })

  context.status = 200
}

export default {
  index,
  bundle,
  qrCode,
  logger,
  notify,
  saveDataCoverage,
  saveDataLogs
}
