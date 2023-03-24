/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const process = require('process')
const fs = require('fs')
const path = require('@jayfate/path')
const del = require('del')
const webpack = require('webpack')
const JSZip = require('jszip')
const globalConfig = require('@hap-toolkit/shared-utils/config')
const { copyApp } = require('hap-dev-utils')

const genWebpackConf = require('../gen-webpack-conf')

/**
 * 读取 zip(rpk) 文件内容
 *
 * @param zipfile
 * @returns {undefined}
 */
function readZip(zipfile) {
  return new Promise((resolve, reject) => {
    fs.readFile(zipfile, (err, buffer) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        JSZip.loadAsync(buffer).then(resolve, reject)
      }
    })
  })
}

/**
 * 调用 webpack 打包
 *
 * @param webpackConfig
 * @returns {undefined}
 */
function pack(projectRoot, platform = 'native', phase = 'dev', opts = {}) {
  return new Promise((resolve, reject) => {
    process.env.NODE_PLATFORM = platform
    process.env.NODE_PHASE = phase
    globalConfig.projectPath = path.resolve(projectRoot)
    const webpackConfig = genWebpackConf({ cwd: projectRoot, ...opts }, 'development')

    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err)
      } else {
        if (stats && stats.hasErrors()) {
          console.log(stats.toString())
        }
        resolve(stats)
      }
    })
  })
}

describe('分包资源包含icon打包测试', () => {
  it(
    'standalone folder has icon',
    async () => {
      const testAppDir = path.resolve(__dirname, '../fixtures/subpackage-app/')
      const tempAppDir = await copyApp(testAppDir)

      const stats = await pack(tempAppDir)
      expect(stats.hasErrors()).toBeFalsy()

      const manifest = require(path.resolve(tempAppDir, 'src/manifest.json'))
      const rpkfile = path.resolve(
        tempAppDir,
        `dist/${manifest.package}.debug.${manifest.versionName}.rpks`
      )
      const zip = await readZip(rpkfile)
      const files = zip.files

      // 1. dist has these package
      const pkgs = [
        'com.app.subpackage.rpk',
        'com.app.subpackage.base.srpk',
        'com.app.subpackage.standalone.srpk',
        'com.app.subpackage.nonstandalone.srpk',
        'com.app.subpackage.standaloneHasIcon.srpk'
      ]

      expect(Object.keys(files)).toEqual(expect.arrayContaining(pkgs))

      // 2. standalone folder has appIcon
      const iconPath = 'Common/logo.png'
      const standaloneSrpkBuf = zip.file('com.app.subpackage.standalone.srpk').async('nodebuffer')
      const standaloneSrpkZip = await JSZip.loadAsync(standaloneSrpkBuf)
      const standaloneSrpkFiles = standaloneSrpkZip.files

      expect(Object.keys(standaloneSrpkFiles)).toContain(iconPath)

      // 3. standaloneHasIcon folder has own icon
      const ownIconPath = 'Common/logo1.png'
      const standaloneSrpkHasIconBuf = zip
        .file('com.app.subpackage.standaloneHasIcon.srpk')
        .async('nodebuffer')
      const standaloneSrpkHasIconZip = await JSZip.loadAsync(standaloneSrpkHasIconBuf)
      const standaloneSrpkHasIconFiles = standaloneSrpkHasIconZip.files

      expect(Object.keys(standaloneSrpkHasIconFiles)).toContain(ownIconPath)

      // 4. nonstandalone folder not has icon
      const nonstandaloneSrpkBuf = zip
        .file('com.app.subpackage.nonstandalone.srpk')
        .async('nodebuffer')
      const nonstandaloneSrpkZip = await JSZip.loadAsync(nonstandaloneSrpkBuf)
      const nonstandaloneSrpkFiles = nonstandaloneSrpkZip.files

      expect(Object.keys(nonstandaloneSrpkFiles)).not.toContain(iconPath)

      await del([tempAppDir], { force: true })
    },
    5 * 60 * 1000
  )
})
