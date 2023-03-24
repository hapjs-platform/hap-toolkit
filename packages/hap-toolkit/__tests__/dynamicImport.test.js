/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
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

describe('use dynamic import in project', () => {
  const platform = 'native'
  const mode = 'dev'
  let projectRoot
  let manifestPath

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/dynamicImport-app')
    projectRoot = await copyApp(testAppDir)
    manifestPath = path.join(projectRoot, 'src/manifest.json')
  })

  // build 模式添加 --split-chunks-mode=smart 参数时，需要把公共js或组件抽取出来
  it('build results include split chunks for [SMART]', async () => {
    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'SMART'
    })
    expect(stats.hasErrors()).toBe(false)
    testContentMatch(stats, projectRoot)
  }, 50000)

  // 动态引用js + 分包
  it('dynamic import with subpackages', async () => {
    const manifest = require(manifestPath)
    manifest.subpackages = [
      {
        name: 'about',
        resource: 'About'
      }
    ]
    fs.writeFileSync(manifestPath, JSON.stringify(manifest))

    const { stats } = await compile(platform, mode, false, {
      cwd: projectRoot,
      splitChunksMode: 'SMART'
    })
    expect(stats.hasErrors()).toBe(false)
  }, 50000)

  afterAll(async () => {
    await del([projectRoot])
  })
})
