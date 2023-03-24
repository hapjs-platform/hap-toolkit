/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const fs = require('fs')
const path = require('@jayfate/path')
const del = require('del')
const glob = require('glob')
const JSZip = require('jszip')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib')

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

describe('lottie配置文件打包测试', () => {
  const platform = 'native'
  const mode = 'dev'
  let projectRoot
  let buildDir
  let distDir

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/subpackage-app')
    projectRoot = await copyApp(testAppDir)
    buildDir = path.resolve(projectRoot, 'build')
    distDir = path.resolve(projectRoot, 'dist')
  })

  it(
    'copy lottie to build',
    async () => {
      const mode = 'dev'
      const expectResult = ['manifest.json', 'lottie/lottie.json']

      // 第三个参数为是否开启watch，true为开启
      const data = await compile(platform, mode, false, { cwd: projectRoot })
      expect(data.compileError).toBeNull()
      expect(data.stats.hasErrors()).toBe(false)

      const result = glob.sync('**/*.json', {
        cwd: buildDir
      })
      expect(result).toEqual(expect.arrayContaining(expectResult))
      expect(result).toMatchSnapshot()
    },
    5 * 60 * 1000
  )

  it(
    'pack lottie to all srpk/rpk',
    async () => {
      // rpks 里的四个子包, 非独立包非base包没有lottie文件
      const pkgs = [
        { name: 'com.app.subpackage.rpk', hasLottie: true },
        { name: 'com.app.subpackage.base.srpk', hasLottie: true },
        { name: 'com.app.subpackage.standalone.srpk', hasLottie: true },
        { name: 'com.app.subpackage.nonstandalone.srpk', hasLottie: false }
      ]
      await checkLottieFilesInRpk(pkgs, (pkgZipBuf, result) => {
        expect(!!pkgZipBuf.file('lottie/lottie.json')).toBe(result)
      })
    },
    5 * 60 * 1000
  )

  it(
    'no lottie in srpk/rpk',
    async () => {
      const pkgs = [
        { name: 'com.app.subpackage.rpk', hasLottie: false },
        { name: 'com.app.subpackage.base.srpk', hasLottie: false },
        { name: 'com.app.subpackage.standalone.srpk', hasLottie: false },
        { name: 'com.app.subpackage.nonstandalone.srpk', hasLottie: false }
      ]
      const lottiePath = path.join(projectRoot, 'src/lottie')
      // 把 lottie 配置文件删除
      await del([lottiePath], { force: true })
      await compile(platform, mode, false, { cwd: projectRoot })
      await checkLottieFilesInRpk(pkgs, (pkgZipBuf, result) => {
        expect(!!pkgZipBuf.file('lottie/lottie.json')).toBe(result)
      })
    },
    5 * 60 * 1000
  )

  async function checkLottieFilesInRpk(pkgs, cb) {
    const rpks = path.join(distDir, 'com.app.subpackage.debug.1.0.0.rpks')
    const rpksZipBuf = await readZip(rpks)

    for (let i = 0; i < pkgs.length; i++) {
      // 获取 rpks 里面的各个 rpk/srpk 的 buffer
      const pkgBuf = rpksZipBuf.file(pkgs[i].name).async('nodebuffer')
      // 获取 rpk/srpk 里的各项文件 zip buffer
      const pkgZipBuf = await JSZip.loadAsync(pkgBuf)
      cb(pkgZipBuf, pkgs[i].hasLottie)
    }
  }
  afterAll(async () => {
    await del([projectRoot], { force: true })
  })
})
