/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict'

const fs = require('fs-extra')
const path = require('@jayfate/path')
const glob = require('glob')
const del = require('del')
const webpack = require('webpack')
const webpackConf = require('./webpack/webpack.config')

/**
 * 将数据中的函数转成字符串，使其可以保留在 snapshot 中
 *
 * @param {*} data - 数据
 * @param {Boolean} [fix] - 是否修正Function#toString() 的差异
 * @returns {String}
 */
function $fun2str(data, fix) {
  let json = JSON.stringify(
    data,
    function(key, value) {
      // 如果是函数, 打印函数实现
      if (typeof value === 'function') {
        value = value.toString()
        // node10(v8 6.6) 前后Function#toString() 结果差异
        // v8 6.6 前，'function'后始终存在单个空格
        // v8 6.6 后，会保留源码的格式
        // https://v8.dev/blog/v8-release-66
        if (fix) {
          value = value.replace(/^function\(/, 'function (')
        }
      }

      return value
    },
    2
  )
  return JSON.parse(json)
}

/**
 * 用 webpack 编译 ux/mix 文件
 *
 * @param {[]} entries - 输入的文件
 * @returns {Promise}
 */
function compilePage(uxfile, type) {
  // TODO 先收集需要测试的文件，再执行编译
  return new Promise((resolve, reject) => {
    const jsfile = uxfile.replace(/\.(ux|mix)/, '')
    type = type || 'page'
    webpackConf.entry = {
      [jsfile]: `./${uxfile}?uxType=${type}`
    }
    webpack(webpackConf, function(err, stats) {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

function compileFiles(entries, type = 'ux') {
  return new Promise((resolve, reject) => {
    webpackConf.entry = entries
    webpack(webpackConf, function(err, stats) {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

function resolveEntries(cwd, prefix) {
  const files = glob.sync('**/*.{ux,mix}', { cwd })
  const entries = files
    .filter(file => file.startsWith(prefix))
    .reduce((obj, file) => {
      // TODO resolve from manifest
      if (file.match(/\/common\//i)) {
        return obj
      }
      const outputName = file.replace(/\.(ux|mix)/, '')
      const type = file.indexOf('TestCard') >= 0 ? 'card' : 'page'
      obj[outputName] = `./${file}?uxType=${type}`
      return obj
    }, {})

  return entries
}

/**
 * 复制一份项目
 * 供测试
 *
 * @param {String} projectDir - 项目目录
 * @returns {Promise<projectDir,buildDir>}
 */
async function copyApp(projectDir) {
  const basename = path.basename(projectDir)
  const target = path.resolve(projectDir, `../temp-test-${basename}-${Date.now()}`)
  await del([target])
  await fs.copy(projectDir, target)
  return target
}

module.exports = {
  $fun2str,
  compilePage,
  resolveEntries,
  compileFiles,
  copyApp
}
