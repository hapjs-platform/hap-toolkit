/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { setCustomConfig, colorconsole } from '@hap-toolkit/shared-utils'

import config from './config'
import moduler from './config/modules'
import { launch, stop } from './server'

import { remotePreview } from './preview/remote-preview'

/**
 * 启动开发服务
 *
 * @module launchServer
 * @param {Object} options - 参数配置项
 * @param {String|Number} [options.port] - 服务端口
 * @param {Boolean} [options.watch] - 是否启用监听
 * @param {String} [options.rpkPath] - 指定查看某一个 rpk 的路径
 * @param {Array<debugger|packager>} [options.modules] - 加载其他模块
 * @param {String} [options.chromePath] - 指定 chrome 的启动路径
 * @param {String} [options.disableADB] - 是否禁止启用adb
 * @param {String} [options.cwd] - 要运行的项目路径
 * @param {String} [options.openDebugger] - 是否打开调试窗口
 * @param {String} [options.webVersion] - 启用预览的 web.js 版本
 * @param {Writable} [options.log] - 日志输出流
 * @param {requestCallback} [options.callback] - 回调函数，用以传递回一些数据给调用方
 * @returns {Promise} - 返回成功与否的信息
 */
/**
 * launchServer 传进来的回调函数
 * @callback requestCallback
 * @param {string} action - toolkit进行到的操作
 * @param {string} url - 调试页面的地址
 */
module.exports.launchServer = function (options) {
  try {
    colorconsole.attach(options.log)

    if (options.modules && options.modules.length) {
      Object.assign(config.options, {
        moduleList: options.modules
      })
    }

    Object.assign(config.options, options)
    // 配置参数
    setCustomConfig(options.cwd, options.port)
    // 加载模块
    moduler.init(config)
  } catch (err) {
    return Promise.reject(err)
  }
  // 启动服务器
  return launch(config, moduler)
}

/**
 * 关闭开发服务
 *
 * @module stopServer
 * @returns {Promise} - 返回成功与否的信息
 */
module.exports.stopServer = function () {
  return stop()
}

/**
 * IDE扫码预览的命令行实现
 */
module.exports.remotePreview = remotePreview
