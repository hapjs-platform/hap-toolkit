/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import os from 'os'
import fs from 'fs'
import path from '@jayfate/path'
import http from 'http'
import { Console } from 'console'
import chalk from 'chalk'
import qrTerminal from 'qrcode-terminal'
import globalConfig from '../config'

export { getLaunchPage } from './buildMode/util'

const logLevelMap = {}
function prependLevel(levelName, args) {
  if (!logLevelMap[levelName]) {
    const logLevel = levelName.toUpperCase()
    logLevelMap[levelName] = logLevel
  }

  if (typeof args[0] === 'string' && args[0].length > 1 && args[0][0] !== '[') {
    args[0] = `[${logLevelMap[levelName]}] ${args[0]}`
  }
}

export const logger = {
  logs: [],
  add(args) {
    this.logs.push(args)
  },
  clear() {
    this.logs = []
  },
  get() {
    return this.logs.join('\n')
  }
}

/**
 * 带颜色的 info, log, warn, error, trace 的打印日志输出流
 */
let originConsole = global.console
let console = Console ? new Console(process.stdout, process.stderr) : originConsole
export const colorconsole = {
  attach(writable) {
    if (writable && Console) {
      console = new Console(writable, writable)
    }
  },
  trace(...args) {
    prependLevel(`trace`, args)
    console.trace(...args)
  },
  log(...args) {
    prependLevel(`log`, args)
    console.log(chalk.green(...args))
  },
  info(...args) {
    prependLevel(`info`, args)
    console.info(chalk.green(...args))
  },
  warn(...args) {
    prependLevel(`warn`, args)
    console.warn(chalk.yellow.bold(...args))
  },
  error(...args) {
    prependLevel(`error`, args)
    console.error(chalk.red.bold(...args))
  },
  throw(...args) {
    throw new Error(chalk.red.bold(...args))
  }
}

/**
 * 打印日志
 * @param loader
 * @param logs
 * @param suppresslog
 */
export function logWarn(loader, logs, suppresslog) {
  if (logs && logs.length) {
    logs.forEach((log) => {
      const logAddr = log.line && log.column ? '@' + log.line + ':' + log.column : ''
      if (suppresslog) return
      if (log.reason.startsWith('ERROR')) {
        colorconsole.error(loader.resourcePath, logAddr, log.reason)
      } else {
        colorconsole.warn(loader.resourcePath, logAddr, log.reason)
      }
    })
  }
}

/**
 * 创建任意深度的路径的文件夹
 * @param dirname
 * @returns {boolean}
 */
export function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 获取服务器端的IP
 */
export function getIPv4IPAddress() {
  const ifaces = os.networkInterfaces()
  let result

  for (const prop in ifaces) {
    if (Object.prototype.hasOwnProperty.call(ifaces, prop)) {
      const iface = ifaces[prop]

      iface.every((eachAlias) => {
        if (
          eachAlias.family === 'IPv4' &&
          !eachAlias.internal &&
          eachAlias.address !== '127.0.0.1'
        ) {
          result = eachAlias
          return false
        }
        return true
      })

      if (result !== void 0) {
        break
      }
    }
  }

  return result && result.address
}

/**
 * 取得server端的IP和port
 * @param port {number}
 * @returns {string}
 */
export function getServerIPAndPort(port) {
  return (getIPv4IPAddress() || '127.0.0.1') + `${port === 80 ? '' : ':' + port}`
}

/**
 * 获取默认的服务器地址
 */
export function getDefaultServerHost() {
  return getServerIPAndPort(globalConfig.server.port)
}

/**
 * 获取客户端ip
 * @param req node Http IncomingRequest Object
 * @returns {any|*|string}
 */
export function getClientIPAddress(req) {
  const ip =
    req.headers['x-forwarded-for'] ||
    (req.connection && req.connection.remoteAddress) ||
    (req.socket && req.socket.remoteAddress) ||
    (req.connection && req.connection.socket && req.connection.socket.remoteAddress)

  return stripPrefixForIPV4MappedIPV6Address(ip)
}

/**
 * 检测可能是IpV4-mapped IpV6 格式的ip
 * - https://en.wikipedia.org/wiki/IPv6#IPv4-mapped_IPv6_addresses
 *
 * @param ip  IpV4-mapped IpV6 string
 * @returns {*}
 */
export function stripPrefixForIPV4MappedIPV6Address(ip) {
  if (/^::1$/.test(ip)) {
    ip = '127.0.0.1'
  }

  if (/^::.{0,4}:(\d{1,3}\.){3}\d{1,3}/.test(ip)) {
    ip = ip.replace(/^.*:/, '')
  }
  return ip
}

/**
 * 命令行输出二维码
 * @param text
 */
export function outputQRCodeOnTerminal(text) {
  console.info(`\n生成HTTP服务器的二维码: ${text}`)
  qrTerminal.generate(text, { small: true })
}

/**
 * 相对工作目录的路径
 *
 * @param {String} filepath - 输入路径
 * @returns {String} - 输出相对路径
 */
export function relateCwd(filepath) {
  const CWD = globalConfig.projectPath
  return path.relative(CWD, filepath)
}

/**
 * 比较两个对象是否相同
 * @param o1
 * @param o2
 * @param fn {Function} 对比函数
 */
export function equals(o1, o2, fn, ...args) {
  if (fn) {
    const fnRet = fn(o1, o2, ...args)
    if (fnRet) {
      return true
    }
  }

  const toStr1 = Object.prototype.toString.call(o1)
  const toStr2 = Object.prototype.toString.call(o2)

  if (toStr1 !== toStr2) {
    return false
  }
  if (toStr1 === '[object Null]' || toStr1 === '[object Undefined]') {
    return true
  }
  if (toStr1 !== '[object Object]' && toStr1 !== '[object Array]') {
    return Object(o1).toString() === Object(o2).toString()
  }

  const keyMap = {}
  Object.keys(o1).forEach((k) => (keyMap[k] = true))
  Object.keys(o2).forEach((k) => (keyMap[k] = true))
  const keyList = Object.keys(keyMap)

  for (let i = 0; i < keyList.length; i++) {
    const keyName = keyList[i]
    const isEqual = equals(o1[keyName], o2[keyName], fn, keyName)
    if (!isEqual) {
      return false
    }
  }
  return true
}

/**
 * 扩展对象属性
 * @param dest
 * @param src
 */
export function extend(target, ...src) {
  if (typeof Object.assign === 'function') {
    Object.assign(target, ...src)
  } else {
    const first = src.shift()
    // 覆盖旧值
    for (const key in first) {
      target[key] = first[key]
    }
    if (src.length) {
      extend(target, ...src)
    }
  }
  return target
}

/**
 * 简单的模板字符串渲染函数
 *
 * @param {String} tpl - 模板字符串
 * @param {Object} data - 渲染数据
 * @returns {String}
 */
export function renderString(tpl, data) {
  return tpl.replace(/{{(.*?)}}/gm, (_, key) => {
    key = key.trim()
    return data[key] !== undefined ? data[key] : key
  })
}

export function KnownError(message) {
  const err = new Error(message)
  err.name = 'KnownError'
  err.__KNOWN = true
  return err
}

/**
 * 获取并设置自定义配置项
 * @param {String} projectPath - 项目路径
 * @param {String} port - server端口
 */
export function setCustomConfig(projectPath, port) {
  projectPath = globalConfig.projectPath = projectPath || globalConfig.projectPath
  const defaultConfig = 'quickapp.config.js'
  const defaultConfigPath = path.join(projectPath, defaultConfig)
  if (fs.existsSync(defaultConfigPath)) {
    let customConf = {}
    try {
      customConf = require(defaultConfigPath)
    } catch (err) {
      colorconsole.error(`读取项目自定义配置文件出错: ${err.message}`)
    }
    // 保证 customConf server 字段无内容也可保证默认值
    const server = Object.assign(globalConfig.server, customConf.server)
    Object.assign(globalConfig, customConf, { server })
  }
  port && (globalConfig.server.port = port)
}

const illegalExtsList = ['.css', '.less', '.scss', '.styl', '.sass', '.log', '.json', '.js'].map(
  (e) => 'app' + e
)

/**
 * 获取当前项目所使用的DSL
 * @param projectPath
 */
export function getProjectDslName(projectPath) {
  // 根据项目中src/app的后缀名判断
  const srcFiles = fs.readdirSync(path.join(projectPath, globalConfig.sourceRoot))
  const appFileNames = srcFiles.filter((f) => /^app\..*/.test(f) && !illegalExtsList.includes(f))
  let appFileExt
  if (appFileNames && appFileNames[0]) {
    appFileExt = path.extname(appFileNames[0]).slice(1)
    colorconsole.info(`获取到app文件后缀: ${appFileExt}`)
  } else {
    colorconsole.error(`无法获取正确的app文件后缀`)
  }
  return appFileExt === 'ux' ? 'xvm' : appFileExt
}

/**
 * 获取手机设备信息（1020新增接口）
 * @param client {{ ip, port }}
 * @param callback
 */
export function getDeviceInfo(client, callback) {
  const req = http
    .request(
      {
        path: '/deviceinfo',
        host: client.ip,
        port: client.port,
        timeout: 3000
      },
      (res) => {
        res.on('data', (data) => {
          callback(null, JSON.parse(data))
        })
      }
    )
    .on('error', (err) => {
      callback(err)
    })
    .on('timeout', function () {
      // abort方法会触发error事件
      req.abort()
    })
  req.end()
}

/**
 * 读取一份 json 内容
 *
 * @param {String} jsonpath - json 路径
 * @returns {Object} json
 */
export function readJson(jsonpath) {
  try {
    return JSON.parse(fs.readFileSync(jsonpath).toString())
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new SyntaxError(`解析 ${jsonpath} 失败, 格式错误`)
    } else if (err.message.startsWith('ENOENT:')) {
      err.message = `读取 ${jsonpath} 失败, 找不到该文件`
      throw err
    } else {
      err.message = `读取 ${jsonpath} 失败 ${err.message}`
      throw err
    }
  }
}
