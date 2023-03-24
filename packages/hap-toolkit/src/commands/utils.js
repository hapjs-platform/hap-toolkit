/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs-extra'
import path from '@jayfate/path'
import request from 'request'
import http from 'http'
import { getRecords, getProjectClients } from '@hap-toolkit/shared-utils/lib/record-client'
import { clientRecordPath } from '@hap-toolkit/shared-utils/config'
import { colorconsole, readJson } from '@hap-toolkit/shared-utils'

/**
 * 接受用户指定的输出时间戳格式，输出时间时间戳
 * usage sample:
 *     formatDate('yyyy年MM月dd日', new Date() );
 *     formatDate('yyyy-MM-dd hh:mm:ss', new Date() );
 *     formatDate('这是自定义的yyyy年, 自定义的MM月', new Date())
 *
 * @param {[type]} format 用户指定的时间戳格式, 见上面示例;
 * @param {[type]} date   Date实例
 */
export function formatDate(format, date) {
  let result = format
  let year, month, day
  let hour, min, sec

  if (format.indexOf('yyyy') >= 0 || format.indexOf('YYYYY') >= 0) {
    year = date.getFullYear()
    result = result.replace(/[yY]{4}/g, year)
  }

  if (format.indexOf('MM') >= 0) {
    month = date.getMonth() + 1
    result = result.replace(/MM/g, String(month).length < 2 ? '0' + month : month)
  }

  if (format.indexOf('dd') >= 0) {
    day = date.getDate()
    result = result.replace(/dd/g, String(day).length < 2 ? '0' + day : day)
  }

  if (format.indexOf('hh') >= 0 || format.indexOf('HH') >= 0) {
    hour = date.getHours()
    result = result.replace(/[hH]{2}/g, String(hour).length < 2 ? '0' + hour : hour)
  }

  if (format.indexOf('mm') >= 0) {
    min = date.getMinutes()
    result = result.replace(/mm/g, String(min).length < 2 ? '0' + min : min)
  }

  if (format.indexOf('ss') >= 0 || format.indexOf('SS') >= 0) {
    sec = date.getSeconds()
    result = result.replace(/[sS]{2}/g, String(sec).length < 2 ? '0' + sec : sec)
  }

  return result
}

/**
 * 整理错误
 *
 * @param {Object} stats
 * @returns {String}
 */
export function summaryErrors(stats) {
  const errors = []
  stats.compilation.errors.forEach((error) => {
    const message = error.message
    // 如果错误信息显示缺少某些loader，则提示安装
    const reg = /Can't resolve '(sass-loader|less-loader|stylus-loader)'/
    const result = reg.exec(message)
    if (error.name === 'ModuleNotFoundError' && result) {
      let moduleName = result[1]
      if (moduleName === 'less-loader') {
        moduleName = `less ${moduleName}`
      } else if (moduleName === 'sass-loader') {
        moduleName = `node-sass ${moduleName}`
      } else if (moduleName === 'stylus-loader') {
        moduleName = `stylus ${moduleName}`
      }
      error.message = ` 缺少依赖: ${moduleName}, 请执行 npm install -D ${moduleName} 安装相应依赖 `
    }
    errors.push(error.message)
  })
  // 使用 stats.toString，webpack会在前面加上 ERROR 标志，与 colorconsole.error 重复
  return errors.join('\n\n')
}

/**
 * 提取警告信息
 * @param {*} stats
 * @returns
 */
export function summaryWarnings(stats) {
  return stats.compilation.warnings.map((warn) => warn.message).join('\n\n')
}

const quickapp_url = 'https://statres.quickapp.cn/quickapp/quickapptool/release/platform/'
/**
 * 快应用调试器地址
 * @param version 版本号
 */
export function getQuickappDebuggerUrl(version) {
  let newVersion = version || 'v1080'
  colorconsole.log(`开始下载的快应用调试器版本： ${newVersion}`)
  return `${quickapp_url}quickapp_debugger_${newVersion}.apk`
}

/**
 * 快应用预览版地址
 * @param version 版本号
 */
export function getQuickappPreviewUrl(version) {
  let newVersion = version || 'v1080'
  colorconsole.log(`开始下载的快应用调试器版本： ${newVersion}`)
  return `${quickapp_url}quickapp_platform_preview_release_${newVersion}.apk`
}

/**
 * 下载文件
 * @param url 网络文件地址
 * @param fileName 文件名
 */
export function downloadFile(url, fileName) {
  colorconsole.log(`开始下载文件：${fileName}，地址：${url}`)
  return new Promise(function (resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const targetDir = path.join(__dirname, './apk')
        fs.ensureDirSync(targetDir)
        let stream = fs.createWriteStream(path.join(targetDir, fileName))
        request(url)
          .pipe(stream)
          .on('close', (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(`${fileName} 下载成功`)
            }
          })
      } else {
        if (error) {
          reject(error)
        } else {
          reject(new Error(`下载失败，状态码：${response.statusCode}`))
        }
      }
    })
  })
}

/**
 * 向手机设备发送请求
 * @param client {{ ip, port }}
 */
export async function sendReq(client, api, params) {
  return new Promise((resolve) => {
    const requrl = `http://${client.ip}:${client.port}${api}`
    // 发送请求
    let options = {
      host: client.ip,
      port: client.port,
      path: api,
      timeout: 3000
    }
    if (params) {
      options = Object.assign({}, options, {
        headers: params
      })
    }

    const req = http
      .request(options, (res) => {
        res.on('data', (data) => {
          colorconsole.log(`### App Server ### 请求${requrl} 成功`)
          resolve(data.toString())
        })
      })
      .on('error', (err) => {
        colorconsole.error(`### App Server ### 请求${requrl} 错误信息: ${err.message}`)
      })
      .on('timeout', function () {
        colorconsole.log(`### App Server ### 请求${requrl}超时, 请重试`)
        req.abort()
      })
    req.end()
  })
}

/**
 * 获取已连接的设备信息
 */
export async function getClients() {
  return new Promise((resolve) => {
    if (fs.existsSync(clientRecordPath)) {
      const recordData = getRecords(clientRecordPath)
      const clients = getProjectClients(recordData)
      if (clients.length > 0) {
        resolve(clients)
      }
    }
    resolve(null)
  })
}

/**
 * 判断是否在快应用的目录下
 * @param {String} curDir - 当前命令的执行目录
 */
export function checkQuickappDir(curDir) {
  const curpkgPath = path.join(curDir, 'src', 'manifest.json')
  if (!fs.existsSync(curpkgPath)) {
    colorconsole.error(`请到快应用项目下执行此命令`)
    process.exit()
  }
}

/**
 * 获取卡片内容
 * @param {String} curDir - 当前命令的执行目录
 */
export function getCardContent(curDir) {
  const curpkgPath = path.join(curDir, 'src', 'manifest.json')
  const widgetsContent = readJson(curpkgPath).router.widgets || null

  if (!widgetsContent) {
    colorconsole.error(`manifest.json 中没有卡片配置`)
  }
  return widgetsContent
}
