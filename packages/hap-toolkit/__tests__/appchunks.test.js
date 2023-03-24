/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const del = require('del')
const { copyApp, wipeDynamic } = require('hap-dev-utils')
const { compile } = require('../lib')

function testContentMatch(stats, projectRoot) {
  projectRoot = path.resolve(projectRoot)
  const projectRootReg = new RegExp(projectRoot, 'g')
  const json = stats.toJson({ source: true })
  json.modules
    .filter((mod) => mod.source)
    .forEach((module) => {
      expect(wipeDynamic(module.source, [[projectRootReg, '<project-root>']])).toMatchSnapshot()
    })
}

function getJson(stats) {
  return stats
    .toJson()
    .assets.filter((_) => _.name.endsWith('.json'))
    .map((_) => _.name)
}

describe('split common component on a project', () => {
  const platform = 'native'
  let projectRoot
  let buildDir
  const expectResult = ['app-chunks.json']

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/commonComponent-app')
    projectRoot = await copyApp(testAppDir)
    buildDir = path.resolve(projectRoot, 'build')
  })
  // build 模式添加 --split-chunks-mode=smart 参数时，需要把公共组件抽取出来
  it('build results include split chunks for [SMART] ', async () => {
    const mode = 'dev'
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'SMART',
      enableLazyComponent: true
    })
    expect(stats.hasErrors()).toBe(false)
    const result = getJson(stats)

    expect(result).toEqual(expect.arrayContaining(expectResult))
    testContentMatch(stats, projectRoot)
  }, 50000)

  afterAll(async () => {
    await del([projectRoot])
  })
})
