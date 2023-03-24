/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const path = require('@jayfate/path')
const del = require('del')
const request = require('supertest')
const { copyApp } = require('hap-dev-utils')
const { BuildModeManager, compile, launchServer } = require('../lib')

describe('测试编译模式', () => {
  let projectRoot
  let server
  let bmm

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/app')
    projectRoot = await copyApp(testAppDir)
    bmm = new BuildModeManager(projectRoot)
  })

  it('BuildModeManager', () => {
    bmm.addModes([{ name: 'Demo', pathName: 'Demo', query: 'a=1&b=2', scene: 0 }])
    const modes = bmm.addMode({ name: 'Demo1', pathName: 'Demo1', query: 'a=1&b=2', scene: 0 })
    const expectResult = {
      current: 1,
      list: [
        {
          name: 'Demo',
          pathName: 'Demo',
          query: 'a=1&b=2',
          scene: 0,
          id: 0
        },
        {
          name: 'Demo1',
          pathName: 'Demo1',
          query: 'a=1&b=2',
          scene: 0,
          id: 1
        }
      ]
    }
    expect(modes).toEqual(expect.objectContaining(expectResult))
    expect(modes).toMatchSnapshot()
  })

  it(
    'preview path',
    async () => {
      const { stats } = await compile('native', 'dev', false, {
        cwd: projectRoot
      })
      expect(stats.hasErrors()).toBe(false)

      const data = await launchServer({
        port: 8083,
        disableADB: true,
        watch: false,
        cwd: projectRoot
      })
      server = data.server

      bmm.select(0)
      const response1 = await request(server).get('/preview')
      expect(response1.status).toBe(302)
      expect(response1.text).toMatch('/preview/Demo?a=1&amp;b=2')

      bmm.update({ id: 0, name: 'About', pathName: 'About', query: 'c=3&d=4', scene: 0 })
      const response2 = await request(server).get('/preview')
      expect(response2.text).toMatch('/preview/About?c=3&amp;d=4')
    },
    5 * 60 * 1000
  )

  afterAll(async () => {
    server.close()
    await del([projectRoot])
  })
})
