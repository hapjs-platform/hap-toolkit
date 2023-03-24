/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const fs = require('fs-extra')
const del = require('del')
const { copyApp, wipeDynamic } = require('hap-dev-utils')
const { compile } = require('../lib')
const glob = require('glob')

const expectFiles = (projectRoot) => {
  projectRoot = path.resolve(projectRoot)
  const projectRootReg = new RegExp(projectRoot, 'g')
  // temp-test-app-6000
  const wipe = (content) => {
    // release 模式下 chunkId 是随机的
    // o(123) -> o(999)
    content = content
      .replace(/(\w)\(\d+\)/gm, '$1(999)')
      .replace(/\d+:/gm, '999:')
      .replace(/\*{10,}/gm, '*'.repeat(10))
    return wipeDynamic(content, [
      [projectRootReg, '<project-root>'],
      [/大小为 \d+ KB/g, '大小为 <SIZE> KB']
    ])
  }
  const cwd = path.resolve(projectRoot, 'build')
  const files = glob
    .sync('**/*.*', { cwd })
    .filter((filepath) => filepath.match(/\.js$/))
    .map((filepath) => path.resolve(cwd, filepath))

  files.forEach((filepath) => {
    const content = fs.readFileSync(filepath, { encoding: 'utf-8' })
    expect(wipe(content)).toMatchSnapshot(wipe(filepath))
  })
}

function getJson(stats) {
  return stats
    .toJson()
    .assets.filter((_) => _.name.endsWith('.json'))
    .map((_) => _.name)
}

describe('split chunks on a project', () => {
  const platform = 'native'
  let projectRoot
  let buildDir
  const splitChunksFiles = ['app-chunks.json', 'page-chunks.json']

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/splitChunks-app')
    projectRoot = await copyApp(testAppDir)
    buildDir = path.resolve(projectRoot, 'build')
  })

  // build 模式添加 --split-chunks-mode=smart 参数时，需要把公共js抽取出来
  it('build results include split chunks for [SMART]', async () => {
    const mode = 'dev'
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'SMART'
    })
    expect(stats.hasErrors()).toBe(false)
    const result = getJson(stats)
    expect(result).toEqual(expect.arrayContaining(splitChunksFiles))
    expectFiles(projectRoot)
  }, 50000)

  // release 模式添加 --split-chunks-mode=smart 参数时，需要把公共js抽取出来
  it('release results include split chunks for [SMART]', async () => {
    const mode = 'prod'
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'SMART'
    })
    expect(stats.hasErrors()).toBe(false)
    const result = getJson(stats)
    expect(result).toEqual(expect.arrayContaining(splitChunksFiles))
    expectFiles(projectRoot)
  }, 50000)

  // release 模式添加 --split-chunks-mode=redundancy 参数时，不应该把公共js抽取出来，走默认方式
  it('release results not include split chunks for [REDUNDANCY]', async () => {
    const mode = 'prod'
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'REDUNDANCY'
    })
    expect(stats.hasErrors()).toBe(false)
    const result = getJson(stats)
    expect(result).toEqual(expect.not.arrayContaining(splitChunksFiles))
    expectFiles(projectRoot)
  }, 50000)

  // release 模式添加 --split-chunks-mode=“任意值” 参数时，不应该把公共js抽取出来，走默认方式
  it('release results not include split chunks for [other value]', async () => {
    const mode = 'prod'
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'aa'
    })
    expect(stats.hasErrors()).toBe(false)
    const result = getJson(stats)
    expect(result).toEqual(expect.not.arrayContaining(splitChunksFiles))
    expectFiles(projectRoot)
  }, 50000)

  afterAll(async () => {
    await del([projectRoot])
  })
})
