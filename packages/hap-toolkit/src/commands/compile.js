/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const webpack = require('webpack')
const { setCustomConfig, colorconsole } = require('@hap-toolkit/shared-utils')
const genWebpackConf = require('../../gen-webpack-conf')
const { summaryErrors, summaryWarnings } = require('./utils')
const adbCommander = require('adb-commander')

// webpack watch 模式返回的watching实例
let watching = null

function showVersion() {
  const toolkitVer = require('../../package.json').version
  const babelVer = require('@babel/core/package.json').version
  const webpackVer = require('webpack/package.json').version

  colorconsole.info(`hap-toolkit: ${toolkitVer}; babel: ${babelVer}; webpack: ${webpackVer};`)
}

showVersion()

/**
 * 调用 webpack 进行编译
 *
 * @module compile
 * @param {String} platform - 目标平台: native
 * @param {dev|prod} mode - 编译模式: dev、prod
 * @param {Boolean} watch - 是否监听
 * @param {Object} [options={}] - 动态生成 webpack 配置项的参数对象
 * @param {String} [options.cwd] - 工作目录
 * @param {Writable} [options.log] - 日志输出流
 * @param {String} [options.originType] - 打包来源，ide|cmd
 * @param {Function} [options.onerror] - 错误回调函数
 * @param {String} [options.buildPreviewRpkOptions] - 预览包保存路径，由IDE传入
 * @param {Object} [options.compileOptions] - 编译参数，由IDE传入
 * @param {Object} [options.ideConfig] - cli，由 IDE 传入
 * @returns {Promise} - 返回成功与否的信息
 */
module.exports.compile = function compile(platform, mode, watch, options = {}) {
  const errCb = options.onerror

  return new Promise((resolve, reject) => {
    colorconsole.attach(options.log)
    setCustomConfig(options.cwd)
    // IMPORTANT: set env variables before generating webpack config
    process.env.NODE_PLATFORM = platform
    process.env.NODE_PHASE = mode

    function compilationCallback(err, stats) {
      if (err) {
        errCb && errCb(err)
        colorconsole.error(err)
      }
      if (stats) {
        if (stats.hasErrors() || stats.hasWarnings()) {
          const message = summaryErrors(stats)
          const warningMsg = summaryWarnings(stats)
          errCb && errCb(message)
          colorconsole.error(message)
          colorconsole.warn(warningMsg)
        }
        if (stats.hasErrors()) {
          process.exitCode = 1
        }
      }
    }

    const webpackMode = mode === 'prod' ? 'production' : 'development'

    try {
      const webpackConfig = genWebpackConf(options, webpackMode)

      if (watch) {
        const compiler = webpack(webpackConfig)
        watching = compiler.watch(
          {
            aggregateTimeout: 300
          },
          (err, stats) => {
            compilationCallback(err, stats)
            resolve({ compileError: err, stats, watching })
          }
        )
      } else {
        webpack(webpackConfig, (err, stats) => {
          compilationCallback(err, stats)
          resolve({ compileError: err, stats })
        })
      }
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * 停止 webpack watch监听
 *
 * @module stopWatch
 * @returns {Promise} - 返回成功与否的信息
 */
module.exports.stopWatch = function () {
  return new Promise((resolve) => {
    if (watching) {
      watching.close(() => {
        watching = null
        resolve({ stopWatchError: null })
      })
      return
    }
    resolve({ stopWatchError: 'no watching' })
  })
}

/**
 * 杀掉adb进程
 * @returns
 */
module.exports.killAdb = function () {
  return new Promise((resolve, reject) => {
    adbCommander.exeCommand('adb kill-server').then(({ result, err }) => {
      if (err) {
        colorconsole.throw('adb kill-server failed')
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
