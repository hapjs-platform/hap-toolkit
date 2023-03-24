/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
const cp = require('child_process')
const glob = require('glob')
const path = require('@jayfate/path')
const del = require('del')
const JSZip = require('jszip')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib')

describe('split chunks on a project', () => {
  const platform = 'native'
  let projectRoot
  let buildDir
  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/splitChunks-subPkg-app')
    projectRoot = await copyApp(testAppDir)
    cp.execSync('npm install --registry=https://registry.npmmirror.com/', { cwd: projectRoot })
    buildDir = path.resolve(projectRoot, 'build')
  })

  // 公共js结合分包兼容卡片
  it('split chunks with subpackages', async () => {
    // const mode = 'dev'
    // // 独立拥有完整的共用js内容
    // // 非独立包只拥有该分包引用的共用js内容
    // const { stats } = await compile(platform, mode, false, {
    //   cwd: projectRoot,
    //   splitChunksMode: 'SMART'
    // })
    // expect(stats.hasErrors()).toBe(false)
    // const result = glob.sync('**/*.json', {
    //   cwd: buildDir
    // })
    // expect(result).toMatchSnapshot()
    // // 测试分包内容
    // const pkgs = [
    //   { name: 'com.application.demo.rpk', jsonPath: 'app-chunks.json', pageChunks: '' },
    //   { name: 'com.application.demo.rpk', jsonPath: 'page-chunks.json', pageChunks: '' },
    //   { name: 'com.application.demo.base.srpk', jsonPath: 'page-chunks.json', pageChunks: '' },
    //   { name: 'com.application.demo.base.srpk', jsonPath: 'app-chunks.json', pageChunks: '' },
    //   {
    //     name: 'com.application.demo.sub2.srpk',
    //     jsonPath: 'Sub2/page-chunks.json',
    //     pageChunks: ''
    //   },
    //   { name: 'com.application.demo.sub3.srpk', jsonPath: 'Sub3/page-chunks.json', pageChunks: '' },
    //   { name: 'com.application.demo.Card.srpk', jsonPath: 'Card/page-chunks.json', pageChunks: '' }
    // ]
    // const rpks = path.join(projectRoot, 'dist/com.application.demo.debug.1.0.0.rpks')
    // const rpksBuf = fs.readFileSync(rpks)
    // const rpksZipBuf = await JSZip.loadAsync(rpksBuf)
    // for (let i = 0; i < pkgs.length; i++) {
    //   const pkg = pkgs[i]
    //   // 获取 rpks 里面的各个 rpk/srpk 的 buffer
    //   const pkgBuf = rpksZipBuf.file(pkg.name).async('nodebuffer')
    //   // 获取 rpk/srpk 里的各项文件 zip buffer
    //   const pkgZipBuf = await JSZip.loadAsync(pkgBuf)
    //   const pageChunks = pkgZipBuf.file(pkg.jsonPath)
    //   if (pkg.jsonPath === 'Card/page-chunks.json') {
    //     // 卡片端内无page-chunks.json
    //     expect(!pageChunks).toBeTruthy()
    //   } else {
    //     // 应用端内每个包都有page-chunks.json
    //     expect(!!pageChunks).toBeTruthy()
    //     let pageChunksJson = await pageChunks.async('string')
    //     // 仅记录key值即可
    //     pageChunksJson = JSON.stringify(JSON.parse(pageChunksJson), (key, val) => {
    //       return key ? '' : val
    //     })
    //     pkg.pageChunks = pageChunksJson.replace(/\\/gm, '/')
    //   }
    // }
    // expect(pkgs).toMatchSnapshot()
  }, 50000)

  afterAll(async () => {
    await del([projectRoot])
  }, 50000)
})
