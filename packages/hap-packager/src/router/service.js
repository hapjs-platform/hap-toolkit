/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs'
import { colorconsole, getIPv4IPAddress, getClientIPAddress } from '@hap-toolkit/shared-utils'

const LINK_MODE = {
  NULL: 0,
  WIFI: 1,
  ADB: 2
}

/**
 * 获取开发者项目中的项目信息
 *
 * @param {String} projectPath - 项目路径
 * @param {String} src - 项目源码路径
 * @return {Object} 项目信息
 */
function getProjectInfo(projectPath, src) {
  try {
    const pathManifest = path.join(projectPath, src, `manifest.json`)
    const contManifest = JSON.parse(fs.readFileSync(pathManifest, 'utf8'))
    let projectName = (contManifest && contManifest.package) || 'Bundle'
    let projectVersion = (contManifest && contManifest.versionName) || '1.0.0'
    return {
      projectName,
      projectVersion
    }
  } catch (err) {
    colorconsole.error(`### App Server ### 获取项目信息出错：${err.message}`)
  }
}

/**
 * 获取可被其它设备访问的服务器地址， 如："http://172.20.1.1:8080"
 * @param port {Number}
 * @return {string}
 */
function getServerAddress(port) {
  return `http://${getIPv4IPAddress()}${port === 80 ? '' : ':' + port}`
}

/**
 * 获取请求信息
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
 * 获取文件路径
 * @param projectDist
 * @param projectName
 * @param projectVersion
 * @param fileType
 * @returns {String}
 */
function getDistFilePath(projectDist, projectName, projectVersion, fileType) {
  let projectDistFilePath

  const projectDistFilePathArr = [
    `${projectName}.debug.${projectVersion}.${fileType}`,
    `${projectName}.debug.${fileType}`,
    `${projectName}.release.${projectVersion}.${fileType}`,
    `${projectName}.release.${fileType}`
  ]

  for (let i = 0; i < projectDistFilePathArr.length; i++) {
    const fullPath = path.join(projectDist, projectDistFilePathArr[i])
    if (fs.existsSync(fullPath)) {
      projectDistFilePath = fullPath
      break
    }
  }

  return projectDistFilePath
}

export { getProjectInfo, getServerAddress, getClientFromRequest, getDistFilePath, LINK_MODE }
