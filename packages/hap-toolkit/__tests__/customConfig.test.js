/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const fs = require('fs')
const path = require('@jayfate/path')
const del = require('del')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib')
const genWebpackConf = require('../gen-webpack-conf')

describe('测试自定义配置', () => {
  const platform = 'native'
  let projectRoot
  const testAppDir = path.resolve(__dirname, '../fixtures/customConfig-app')
  beforeAll(async () => {
    projectRoot = await copyApp(testAppDir)
  })

  it(
    'compile build',
    async () => {
      const mode = 'dev'
      // 第三个参数为是否开启watch，true为开启
      const data = await compile(platform, mode, false, { cwd: projectRoot })
      expect(data.compileError).toBeNull()
      expect(data.stats.hasErrors()).toBe(false)

      // TODO 测试端口
      const buildPath = path.join(projectRoot, 'build3')
      const distPath = path.join(projectRoot, 'dist4')
      expect(fs.existsSync(buildPath)).toBeTruthy()
      expect(fs.existsSync(distPath)).toBeTruthy()
    },
    5 * 60 * 1000
  )

  it('test quickapp.config posthook', async () => {
    let checkvalue
    const conf = genWebpackConf(
      {
        cwd: testAppDir
      },
      'development'
    )
    conf.plugins.forEach((item) => {
      if (item.constructor.name === 'PostHookTestPlugin') {
        checkvalue = true
      }
    })
    expect(checkvalue).toBe(true)
  })

  afterAll(async () => {
    await del([projectRoot])
  })
})
