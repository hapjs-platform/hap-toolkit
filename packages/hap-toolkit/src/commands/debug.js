/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const fs = require('fs')
const chalk = require('chalk')
const inquirer = require('inquirer')
const adbCommander = require('adb-commander')
const { launchServer } = require('@hap-toolkit/server')
const { compile } = require('./compile')

const { colorconsole } = require('@hap-toolkit/shared-utils')
const {
  downloadFile,
  getQuickappDebuggerUrl,
  getQuickappPreviewUrl,
  sendReq,
  getClients,
  checkQuickappDir,
  getCardContent
} = require('./utils')
const { recordClient, clearProjectRecord } = require('@hap-toolkit/shared-utils/lib/record-client')
const { clientRecordPath } = require('@hap-toolkit/shared-utils/config')

const ipRegExp =
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

const CLIENT_PORT = 39517

/**
 * 如果是TV等AIOT设备，需要通过IP连接
 * @param {string} ip - ip字符串数组
 */
async function connectDevice(ip = '') {
  try {
    const WIFI_TEXT = '是，连接新的wifi设备'
    if (!ip) {
      const connectType = await inquirer.prompt([
        {
          name: 'type',
          type: 'list',
          message: '（USB设备会自动连入）选择是否要连接新的wifi设备，稍后需填写其IP地址:',
          choices: [WIFI_TEXT, '跳过，保持已连接的设备']
        }
      ])
      // 开始连接Wi-Fi
      if (connectType.type === WIFI_TEXT) {
        const address = await inquirer.prompt([
          {
            name: 'ip',
            message:
              '请输入设备在wifi下的ip地址(如192.168.1.1)，并确保电脑与设备在同一wifi下。若需输入多个ip，请以","分隔:',
            default: null
          }
        ])
        ip = address.ip
      } else {
        return Promise.resolve()
      }
    }
    if (ip.length === 0) {
      colorconsole.info(`没有输入任何ip地址，将连接已连接过的设备`)
      return Promise.resolve()
    }
    const ips = ip.trim().split(',')
    const invalidIps = ips.filter((ip) => !ipRegExp.test(ip))
    if (invalidIps && invalidIps.length) {
      invalidIps.map((ip) => {
        colorconsole.error(`ip: ${ip} is invalid IP`)
      })
      process.exit()
    } else {
      const newDeviceListPromiseArray = Array.from(ips, (ip) => {
        return adbCommander.exeCommand(`adb connect ${ip}:5555`).then(({ result, err }) => {
          if (err || result.indexOf('failed') >= 0) {
            colorconsole.error(`wifi连接ip： "${ip}" 的设备失败了`)
            process.exit()
          }
          colorconsole.info(`wifi连接ip： "${ip}" 的设备成功了`)
          // 记录通过adb connect连接的设备
          let client = {
            ip: ip,
            port: CLIENT_PORT
          }
          recordClient(clientRecordPath, client)
          return Promise.resolve()
        })
      })
      return Promise.all(newDeviceListPromiseArray)
        .then(() => {
          colorconsole.log('所有新的WIFI设备连接完毕')
          return Promise.resolve()
        })
        .catch(() => {
          // 在抛出错误前已经弹出错误日志了，故这里直接退出
          process.exit()
        })
    }
  } catch (error) {
    return Promise.reject(new Error(`连接设备出错，错误信息：${error.message}`))
  }
}

/**
 * 获取当前环境的连接设备
 * @param {Boolean} isShowLog - 是否展示连接成功的日志
 * @return {Array}} - 连接的设备数组
 */
async function getConnectDevices(isShowLog = true) {
  try {
    return adbCommander.deviceList().then(({ deviceList, err }) => {
      if (err) {
        const errorMessage = '获取adb设备连接信息出错'
        colorconsole.throw(errorMessage, err)
      }
      if (deviceList.length > 0) {
        if (isShowLog) {
          colorconsole.info(`通过adb连接的设备的有： ${chalk.yellow(deviceList.join(', '))}.`)
        }
        return Promise.resolve(deviceList)
      } else {
        const errorMessage = `当前无设备连接，请依次检查以下准备工作是否完成：\n  1. 设备是否启动;\n  2. 是否处于同一局域网WI-FI;\n  3. 设备是否可以USB连接电脑;`
        colorconsole.throw(errorMessage)
      }
    })
  } catch (error) {
    return Promise.reject(new Error(error.message))
  }
}

/**
 * 下载并获取apk地址
 * @param {Object} options - 命令参数
 * @param {Boolean} isQuickappDebugger - 是否为调试器
 */
async function downloadApk(options, isQuickappDebugger) {
  let url = ''
  const { apkVersion: version } = options
  if (isQuickappDebugger) {
    url = getQuickappDebuggerUrl(version)
  } else {
    url = getQuickappPreviewUrl(version)
  }
  const filename = path.basename(url)
  const apkPath = path.join(__dirname, './apk/', filename)
  if (fs.existsSync(apkPath)) {
    colorconsole.log('安装包已下载过，现使用缓存文件安装')
    return apkPath
  } else {
    return downloadFile(url, filename)
      .then((message) => {
        colorconsole.info(message)
        return apkPath
      })
      .catch((err) => {
        colorconsole.error('下载安装包失败', err)
        process.exit()
      })
  }
}

/**
 * 安装调试器或预览版
 * @param {Object} options - 命令参数
 * @param {Array} deviceList - 连接的设备数组
 * @param {String} apkPath - apk存放的地址
 * @param {String} apkName - apk的名字
 * @param {String} apkName - app的应用名
 */
async function installApk(options, deviceList = [], apkPath, apkName, appName) {
  const { forceInstall = false } = options
  try {
    const newDeviceListPromiseArray = Array.from(deviceList, (deviceSn) => {
      return adbCommander.isInstalled(deviceSn, apkName).then(async ({ isInstalled, err }) => {
        // error 非标准错误Error类，因此需要序列化输出
        if (err) {
          colorconsole.error(
            `在设备 "${chalk.yellow(deviceSn)}" 上安装应用 "${chalk.yellow(
              appName
            )}" 失败了，错误信息：${JSON.stringify(err)} `
          )
          return Promise.reject(new Error(JSON.stringify(err)))
        }
        if (isInstalled === false || forceInstall) {
          await adbCommander.uninstall(deviceSn, apkName)
          colorconsole.log(
            `开始在设备 "${chalk.yellow(deviceSn)}" 上安装应用："${chalk.yellow(appName)}" `
          )
          return adbCommander.install(deviceSn, apkPath).then(({ result, err }) => {
            if (err) {
              colorconsole.error(
                `在设备 "${chalk.yellow(deviceSn)}" 上安装应用 "${chalk.yellow(
                  appName
                )}" 失败了，请排查问题后重试 `
              )
              return Promise.reject(
                new Error(
                  `在设备 "${chalk.yellow(deviceSn)}" 上安装应用 "${chalk.yellow(
                    appName
                  )}" 失败了，请排查问题后重试 `
                )
              )
            }
            return adbCommander.isInstalled(deviceSn, apkName).then(({ isInstalled, err }) => {
              if (isInstalled === true) {
                colorconsole.info(
                  `在设备 "${chalk.yellow(deviceSn)}" 上安装应用 "${chalk.yellow(appName)}" 成功 `
                )
                return Promise.resolve()
              }
            })
          })
        } else {
          colorconsole.warn(
            `在设备 "${chalk.yellow(deviceSn)}" 上已经安装过应用 "${chalk.yellow(
              appName
            )}"，因此这次安装没有继续`
          )
          return Promise.resolve()
        }
      })
    })
    return Promise.all(newDeviceListPromiseArray)
      .then(() => {
        colorconsole.log('所有设备安装完毕')
        return Promise.resolve()
      })
      .catch(() => {
        // 在抛出错误前已经弹出错误日志了，故这里直接退出
        process.exit()
      })
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * 启动server
 * @param {Object} options - 命令参数
 */
async function startServer(options) {
  const { address } = await launchServer({ clearRecords: true })
  await compile('native', 'dev', true, options)
  return address
}

/**
 * 安装调试器
 * @param {Object} options - 命令参数
 */
async function installdbg(options, isConnectDevice = true) {
  try {
    const { ip } = options
    // 1. 连接设备
    if (isConnectDevice) {
      await connectDevice(ip)
    }
    // 2. 获取连接设备
    const deviceList = await getConnectDevices(isConnectDevice)
    const finalDeviceList = await queryDevice(deviceList, '安装快应用调试器')
    // 3. 下载并获取调试器地址
    const apkPath = await downloadApk(options, true)
    // 4. 安装调试器
    await installApk(options, finalDeviceList, apkPath, 'org.hapjs.debugger', '快应用调试器')
    return Promise.resolve('所有设备安装快应用调试器成功')
  } catch (error) {
    return Promise.reject(new Error(`安装调试器失败，错误信息：${error.message}`))
  }
}

/**
 * 安装预览版
 * @param {Object} options - 命令参数
 * @param {Boolean} isConnectDevice - 是否需要连接设备
 */
async function installmkp(options, isConnectDevice = true) {
  try {
    const { ip } = options
    // 1. 连接设备
    if (isConnectDevice) {
      await connectDevice(ip)
    }
    // 2. 获取连接设备
    const deviceList = await getConnectDevices(isConnectDevice)
    const finalDeviceList = await queryDevice(deviceList, '安装快应用预览版')
    // 3. 下载并获取预览版地址
    const apkPath = await downloadApk(options)
    // 4. 安装预览版
    await installApk(options, finalDeviceList, apkPath, 'org.hapjs.mockup', '快应用预览版')
    return Promise.resolve('所有设备安装快应用预览版成功')
  } catch (error) {
    return Promise.reject(new Error(`安装快应用预览版失败，错误信息：${error.message}`))
  }
}

// 选择设备
async function queryDevice(deviceList, orderText = '') {
  if (!deviceList || deviceList.length === 0) {
    colorconsole.error(`尚没有连接任何设备，请确认后重试`)
    return
  }
  const ALL_TEXT = '全部已连接设备'
  // 可以选择一台设备或全部设备
  const deviceChoice = await inquirer.prompt([
    {
      name: 'device',
      type: 'list',
      message: `请选择需要执行命令"${orderText}"的设备:`,
      choices: [...deviceList, ALL_TEXT]
    }
  ])
  const choice = deviceChoice.device
  if (choice === ALL_TEXT) return deviceList
  return [choice]
}

/**
 * 批量启动设备的调试器
 * @param {Array} deviceList - 配置项
 * @param {String} param - 需要传给调试器的额外参数
 */
async function startDebugger(deviceList = [], param) {
  colorconsole.info(`正在为已连接的设备启动调试器中...`)
  const newDeviceListPromiseArray = Array.from(deviceList, (deviceSn) => {
    return adbCommander
      .exeCommand(
        `adb -s ${deviceSn} shell am start -n "org.hapjs.debugger/.MainActivity" ${param}`
      )
      .then(({ err }) => {
        if (err) {
          colorconsole.error(
            `在设备 "${chalk.yellow(deviceSn)}" 上启动"快应用调试器"失败，请排查问题后重试`
          )
          return Promise.reject(new Error(JSON.stringify(err)))
        }
        colorconsole.info(`在设备 "${chalk.yellow(deviceSn)}" 上启动"快应用调试器"成功`)
        return Promise.resolve()
      })
  })
  return Promise.all(newDeviceListPromiseArray)
    .then(() => {
      colorconsole.info('所有设备的调试器启动完毕')
      return Promise.resolve()
    })
    .catch(() => {
      // 在抛出错误前已经弹出错误日志了，故这里直接退出
      process.exit()
    })
}

/**
 * 运行rpk在设备上
 * @param {Object} options - 配置项
 * @param {Boolean} isShowLog - 是否展示连接成功的日志
 * @param {Boolean} isConnectDevice - 是否需要连接设备
 */
async function runapp(options, isShowLog = true, isConnectDevice = true) {
  try {
    const { debugMode = false, cardMode = false } = options
    let url = ''
    let cardPath = ''
    let param = ''
    const curDir = process.cwd()

    // 1. 判断是否在快应用的目录下
    checkQuickappDir(curDir)

    // 2. 如果携带参数cardMode，则开启卡片模式
    if (cardMode) {
      // 提醒用户打开自启动的权限
      colorconsole.warn('请在安卓系统中开启快应用调试器与预览版引擎的「自启动」与「关联启动」权限')
      const cardContent = getCardContent(curDir)
      if (cardContent) {
        const cardKeys = Object.keys(cardContent)
        if (cardKeys.length > 1) {
          const card = await inquirer.prompt([
            {
              name: 'cardName',
              type: 'list',
              message: '请选择调试的卡片:',
              choices: cardKeys
            }
          ])
          cardPath = cardContent[card.cardName].path || `/${card.cardName}`
        } else {
          cardPath = cardContent[cardKeys[0]].path || `/${cardKeys[0]}`
        }
        param += `-e cardMode true -e cardPath ${cardPath}`
      }
    }
    // 3. 如果携带参数enableServerWatch或debugMode,则启动server
    // 清空调试设备记录
    clearProjectRecord(clientRecordPath)
    url = await startServer(options)
    param += ` -e path ${url}`
    if (!url) {
      colorconsole.error(`启动本地快应用服务失败，请排查后重试`)
      process.exit()
    }
    // 尝试连接设备
    if (isConnectDevice) {
      await connectDevice()
    }
    // 4. 获取所有已连接设备
    const deviceList = await getConnectDevices(isShowLog)
    if (!deviceList || deviceList.length === 0) {
      colorconsole.error(`没有可用的连接设备！`)
      process.exit()
    }
    // 5. 开始启动调试器
    await startDebugger(deviceList, param)
    setTimeout(async () => {
      // 6. 调试器启动之后开始选择调试平台
      const clients = await getClients()
      if (!clients) {
        colorconsole.error(`没有可用的连接设备！`)
        process.exit()
      }
      for (let client of clients) {
        // 只有usb连接的设备会有sn，所以标识wifi设备需要用ip地址
        const { sn, ip } = client
        // 有一个wifi设备尝试连接，但因在record.json记录其ip为127.0.0.1，所以拒绝
        // 部分电视盒子可能会存在此情况
        if (ip === '127.0.0.1' && sn.includes(':5555')) {
          continue
        }
        const deviceName = sn && sn.length > 0 ? sn : ip
        // 如果查询平台列表失败，则新建一个3s的轮询，继续查询
        const delayRequest = () => {
          colorconsole.error(`"${deviceName}" 设备获取运行平台列表时错误,延迟3s后再次请求`)
          setTimeout(() => {
            runOnPlatform()
          }, 3000)
        }
        const runOnPlatform = async () => {
          let data = await sendReq(client, '/availablePlatforms')
          if (!data) {
            delayRequest()
          }
          data = JSON.parse(data)
          const { availablePlatforms } = data
          if (!availablePlatforms) {
            delayRequest()
          } else {
            let availablePlatform
            if (availablePlatforms.length === 0) {
              colorconsole.error(`${ip} 设备尚未安装快应用引擎`)
              return
            } else if (availablePlatforms.length === 1) {
              availablePlatform = availablePlatforms[0].pkg
            } else if (availablePlatforms.length > 1) {
              const platform = await inquirer.prompt([
                {
                  name: 'name',
                  type: 'list',
                  message: `在设备"${deviceName}"上检测到多个快应用引擎，请选择运行平台:`,
                  choices: availablePlatforms
                }
              ])
              availablePlatforms.forEach((item) => {
                if (item.name === platform.name) {
                  availablePlatform = item.pkg
                }
              })
            }
            // 选择平台
            const selectPlatformData = await sendReq(client, '/platform', {
              selectedPlatform: availablePlatform
            })
            if (selectPlatformData === 'OK') {
              // 启动预览版或引擎
              sendReq(client, '/update', {
                debug: debugMode
              })
            }
          }
        }
        await runOnPlatform()
      }
    }, 3000)
  } catch (error) {
    return Promise.reject(new Error(`运行RPK到设备上出错，错误信息：${error.message}`))
  }
}

/**
 * 一键调试
 * @param {Object} options - 命令参数
 */
async function installAndRun(options) {
  try {
    const curDir = process.cwd()
    // 1. 判断是否在快应用的目录下
    checkQuickappDir(curDir)
    // 2. 安装调试器
    await installdbg(options)
    // 3. 安装预览版
    // 已在安装调试器的时候选择连接过设备了，这里省略
    await installmkp(options, false)
    // 4. 通知调试器，运行rpk
    await runapp(
      Object.assign({}, options, {
        enableServerWatch: true
      }),
      false,
      false
    )
  } catch (error) {
    return Promise.reject(new Error(`一键调试出错，错误信息：${error.message}`))
  }
}

/**
 * 获取设备上的快应用包名数组，供IDE使用（需先安装调试器）
 * @param {Object} options - 命令参数
 * @param {Object} openLog - 是否命令行显示日志（IDE场景可选择关闭）
 */
async function getAvailablePlatform(options) {
  try {
    const { ip, port, sn: deviceSn } = options
    if (!ip || !ipRegExp.test(ip)) {
      colorconsole.error(`没有传入正确的ip地址，示例 --ip 127.0.0.1`)
      process.exit()
    }
    if (!port) {
      colorconsole.error(`没有传入正确的端口地址，示例 --port 39517`)
      process.exit()
    }

    if (!deviceSn) {
      colorconsole.error(
        `没有传入正确的设备序列号，可通过"adb devices"指令查看已连接的设备序列号 \n 如果是WIFI连接的设备，格式为 "ip地址:5555"`
      )
      process.exit()
    }

    let client = { ip, port }
    const delayRequest = () => {
      colorconsole.error(`设备获取运行平台错误,延迟3s后再次请求`)
      setTimeout(() => {
        requestPlatform()
      }, 3000)
    }
    const requestPlatform = async () => {
      let data = await sendReq(client, '/availablePlatforms')
      if (!data) {
        delayRequest()
      } else {
        data = JSON.parse(data)
        if (!data.availablePlatforms) {
          delayRequest()
        } else {
          const availablePlatforms = data.availablePlatforms
          colorconsole.info(`设备"${deviceSn}"的快应用引擎列表有：${availablePlatforms.join(', ')}`)
        }
      }
    }
    // 先打开调试器，才能获取运行平台
    adbCommander
      .exeCommand(`adb -s ${deviceSn} shell am start -n "org.hapjs.debugger/.MainActivity"`)
      .then(({ err }) => {
        if (err) {
          colorconsole.error(`调试器没有正常启动，请检查是否已安装`)
          process.exit()
        }
        colorconsole.info(`调试器成功运行在设备"${chalk.yellow(deviceSn)}"`)
        colorconsole.info(`设备"${deviceSn}"获取快应用引擎列表中...`)
        requestPlatform()
      })
  } catch (error) {
    colorconsole.error(`获取设备上的快应用引擎列表出错，错误信息：${error.message}`)
  }
}

/**
 * 获取所有连接上的设备数组，供IDE使用（需先安装调试器）
 * @param {Object} options - 命令参数
 */
async function getAllConnectedDevices(options) {
  try {
    return adbCommander.deviceList().then(({ deviceList, err }) => {
      if (err) {
        colorconsole.throw(err)
      } else {
        return Promise.resolve(deviceList)
      }
    })
  } catch (error) {
    return Promise.reject(new Error(`获取所有连接上的设备数组出错，错误信息：${error.message}`))
  }
}

module.exports = {
  installAndRun,
  installdbg,
  installmkp,
  runapp,
  getAvailablePlatform,
  getAllConnectedDevices
}
