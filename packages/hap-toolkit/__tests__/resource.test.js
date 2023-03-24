/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
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
    const res = await compile('native', 'prod', false, options)
    const { stats } = res
    expect(stats.hasErrors()).toBeFalsy()
    const testProjectBuildPath = path.join(tempAppDir, 'build')
    const result = glob.sync('**/*', {
      cwd: testProjectBuildPath
    })

    expect(result).toMatchSnapshot('resource list')
    await del([tempAppDir], { force: true })
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
    const res = await compile('native', 'prod', false, options)
    const { stats } = res
    expect(stats.hasErrors()).toBeFalsy()
    const testProjectBuildPath = path.join(tempAppDir, 'build')
    const result = glob.sync('**/*.css.json', {
      cwd: testProjectBuildPath
    })
    const cssJsonFiles = ['CardDemo/index.css.json', 'Demo/index.css.json']
    expect(result).toEqual(expect.arrayContaining(cssJsonFiles))
    expect(result.length).toBe(2)
    expect(result).toMatchSnapshot()
    await del([tempAppDir], { force: true })
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
    result.forEach((item) => {
      const rules = require(path.resolve(testProjectBuildPath, item)).list
      rules.forEach((rule) => {
        expect(rule).toMatchSnapshot({
          '@info': expect.any(Object)
        })
      })
    })
    await del([tempAppDir], { force: true })
  }, 50000)
})
