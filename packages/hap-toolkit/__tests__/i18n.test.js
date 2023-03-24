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

describe('i18n配置文件打包测试', () => {
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
    'copy i18n to build',
    async () => {
      const mode = 'dev'
      const expectResult = ['manifest.json', 'i18n/en.json']

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
    'pack i18n to all srpk/rpk',
    async () => {
      // rpks 里的四个子包, 非独立包非base包没有i18n文件
      const pkgs = [
        { name: 'com.app.subpackage.rpk', hasi18n: true },
        { name: 'com.app.subpackage.base.srpk', hasi18n: true },
        { name: 'com.app.subpackage.standalone.srpk', hasi18n: true },
        { name: 'com.app.subpackage.nonstandalone.srpk', hasi18n: false }
      ]
      await checki18nFilesInRpk(pkgs, (pkgZipBuf, result) => {
        expect(!!pkgZipBuf.file('i18n/en.json')).toBe(result)
      })
    },
    5 * 60 * 1000
  )

  it(
    'no i18n in srpk/rpk',
    async () => {
      const pkgs = [
        { name: 'com.app.subpackage.rpk', hasi18n: false },
        { name: 'com.app.subpackage.base.srpk', hasi18n: false },
        { name: 'com.app.subpackage.standalone.srpk', hasi18n: false },
        { name: 'com.app.subpackage.nonstandalone.srpk', hasi18n: false }
      ]
      const i18nPath = path.join(projectRoot, 'src/i18n')
      // 把 i18n 配置文件删除
      await del([i18nPath], { force: true })
      await compile(platform, mode, false, { cwd: projectRoot })
      await checki18nFilesInRpk(pkgs, (pkgZipBuf, result) => {
        expect(!!pkgZipBuf.file('i18n/en.json')).toBe(result)
      })
    },
    5 * 60 * 1000
  )

  async function checki18nFilesInRpk(pkgs, cb) {
    const rpks = path.join(distDir, 'com.app.subpackage.debug.1.0.0.rpks')
    const rpksZipBuf = await readZip(rpks)

    for (let i = 0; i < pkgs.length; i++) {
      // 获取 rpks 里面的各个 rpk/srpk 的 buffer
      const pkgBuf = rpksZipBuf.file(pkgs[i].name).async('nodebuffer')
      // 获取 rpk/srpk 里的各项文件 zip buffer
      const pkgZipBuf = await JSZip.loadAsync(pkgBuf)
      cb(pkgZipBuf, pkgs[i].hasi18n)
    }
  }
  afterAll(async () => {
    await del([projectRoot], { force: true })
  })
})
