/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'

import { colorconsole } from '@hap-toolkit/shared-utils'

const pkgReg = /^quickapp-dsls.*$/

/**
 * 从devDependency查找相应包名
 * @param {Array<String>} list
 * @param {RegExp} reg 正则表达式
 * @returns {String} packageName package包名
 */
function findPackageName(list, reg) {
  let packageName
  for (let i = 0, len = list.length; i < len; i++) {
    const matched = reg.exec(list[i])
    if (matched) {
      packageName = matched[0]
      break
    }
  }
  return packageName
}

/**
 * 从node_modules里复制Dsl文件打包至rpk
 * @param {Object} options 插件参数对象
 * @param {Object} options.config manifest对象
 * @param {String} options.cwd 工作目录
 */
function CopyDslPlugin(options) {
  this.options = options
  this.packageList = Object.keys(require(`${this.options.cwd}/package.json`).devDependencies || {})
}

CopyDslPlugin.prototype.apply = function (compiler) {
  const thiz = this
  compiler.hooks.emit.tapAsync('copyDslPlugin', function (compilation, callback) {
    thiz.copyFile(callback)
  })
}

CopyDslPlugin.prototype.copyFile = function (callback) {
  const packageName = findPackageName(this.packageList, pkgReg)
  if (!packageName) {
    callback()
    return
  }
  // TODO rm dsl vue ?
  const dslName = this.options?.config?.dsl?.name || 'vue'
  const readPath = `${this.options.cwd}/node_modules/${packageName}/dist/release/dsls/${dslName}.js`
  const writePath = `${this.options.cwd}/build/dsl.js`
  const writeStream = fs.createWriteStream(writePath)
  colorconsole.log(`复制文件${readPath}`)
  fs.createReadStream(readPath).pipe(writeStream)
  colorconsole.log(`复制到${writePath}`)
  writeStream.on('finish', callback)
}

module.exports = CopyDslPlugin
