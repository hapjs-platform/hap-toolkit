/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
const path = require('path')
const glob = require('glob')
const del = require('del')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib/commands/compile')

describe('compile a project and test resource collect', () => {
  // 资源拷贝测试，node_moduels 中的资源引用也需要拷贝到 build 目录
  // 添加 --optimize-unused-resource 参数后，未引用到的资源不应该拷贝
  it('resource collect', async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/deps-app/')
    const tempAppDir = await copyApp(testAppDir)
    const options = {
      optimizeUnusedResource: true,
      cwd: tempAppDir
    }
    const { stats } = await compile('native', 'prod', false, options)
    expect(stats.hasErrors()).toBeFalsy()
    const testProjectBuildPath = path.join(tempAppDir, 'build')
    const result = glob.sync('**/*', {
      cwd: testProjectBuildPath
    })
    // 引用到的资源列表
    const usedResult = [
      'Common/1.png',
      'Common/2.png',
      'Common/3.png',
      'Common/4.png',
      'Common/5.png',
      'Common/6.png',
      'Common/7.png',
      'Common/logo.png',
      'manifest.json',
      'assets/2.png',
      'assets/4.png',
      'assets/5.png',
      'node_modules/qa-test-ui/assets/1.png',
      'node_modules/qa-test-ui/assets/3.png',
      'node_modules/qa-test-ui/assets/6.png',
      'node_modules/qa-test-ui/assets/7.png'
    ]
    expect(result).toEqual(expect.arrayContaining(usedResult))
    // 未引用到的资源列表
    const unusedResult = ['Common/unused-1.png', 'Demo/unused-2.png', 'unused-3.png']
    expect(result).toEqual(expect.not.arrayContaining(unusedResult))
    expect(result).toMatchSnapshot()
    await del([tempAppDir])
  }, 50000)
})

describe('css样式抽取', () => {
  // 添加 --enable-extract-css 参数后，会把ux文件中的style抽取为一个*.css.json文件
  it('Each page folder contains a *.css.json file', async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/app/')
    const tempAppDir = await copyApp(testAppDir)
    const options = {
      enableExtractCss: true,
      cwd: tempAppDir
    }
    const { stats } = await compile('native', 'prod', false, options)
    expect(stats.hasErrors()).toBeFalsy()
    const testProjectBuildPath = path.join(tempAppDir, 'build')
    const result = glob.sync('**/*.css.json', {
      cwd: testProjectBuildPath
    })
    const cssJsonFiles = ['CardDemo/index.css.json', 'Demo/index.css.json']
    expect(result).toEqual(expect.arrayContaining(cssJsonFiles))
    expect(result.length).toBe(2)
    expect(result).toMatchSnapshot()
    await del([tempAppDir])
  }, 50000)
  it('make sure the rules contain meta', async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/deps-app/')
    const tempAppDir = await copyApp(testAppDir)
    const options = {
      enableExtractCss: true,
      cwd: tempAppDir
    }
    const { stats } = await compile('native', 'prod', false, options)
    expect(stats.hasErrors()).toBeFalsy()
    const testProjectBuildPath = path.join(tempAppDir, 'build')
    const result = glob.sync('**/*.css.json', {
      cwd: testProjectBuildPath
    })
    result.forEach(item => {
      const rules = require(path.resolve(testProjectBuildPath, item)).list
      rules.forEach(rule => {
        expect(rule).toMatchSnapshot({
          '@info': expect.any(Object)
        })
      })
    })
    await del([tempAppDir])
  }, 50000)
})
