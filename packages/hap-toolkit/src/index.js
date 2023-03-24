/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const BuildModeManager = require('@hap-toolkit/shared-utils/lib/buildMode/BuildModeManager')
const { launchServer, stopServer } = require('@hap-toolkit/server')
const { compile, stopWatch } = require('./commands/compile')

/**
 * 关闭开发服务及停止webpack watching
 *
 * @module stopAll
 * @returns {Promise} - 返回成功与否的信息
 */
function stopAll() {
  return Promise.all([stopServer(), stopWatch()]).then(([stopServerData, stopWatchData]) => {
    const data = Object.assign({}, stopServerData, stopWatchData)
    // 得出布尔值
    data.error = !!(stopServerData.stopServerError || stopWatchData.stopWatchError)
    return data
  })
}

/**
 * 启动开发服务及开启webpack watching
 *
 * @module launchWithWatch
 * @param {Object} options - 参数配置项
 * @param {String|Number} [options.port] - 服务端口
 * @param {Array<debugger|packager>} [options.modules] - 加载其他模块
 * @param {String} [options.chromePath] - 指定 chrome 的启动路径
 * @param {String} [options.disableADB] - 是否禁止启用adb
 * @param {String} [options.cwd] - 要运行的项目路径
 * @param {String} [options.openDebugger] - 是否打开调试窗口
 * @param {String} [options.webVersion] - 启用预览的 web.js 版本
 * @param {Writable} [options.log] - 日志输出流
 * @param {Function} [options.onerror] - compile 的错误回调函数
 * @param {requestCallback} [options.callback] - 回调函数，用以传递回一些数据给调用方
 * @returns {Promise} - 返回成功与否的信息
 */
/**
 * launchWithWatch 传进来的回调函数
 * @callback requestCallback
 * @param {string} action - toolkit进行到的操作
 * @param {string} url - 调试页面的地址
 */
function launchWithWatch(options) {
  const { cwd, log, onerror } = options
  return Promise.all([
    launchServer(options),
    compile('native', 'dev', true, { cwd, log, onerror })
  ]).then(([launchData, compileData]) => {
    const data = Object.assign({}, launchData, compileData)
    // 得出布尔值
    data.error = !!(launchData.launchError || compileData.compileError)
    return data
  })
}

module.exports = {
  compile,
  stopWatch,
  launchServer,
  stopServer,
  launchWithWatch,
  stopAll,
  BuildModeManager
}
