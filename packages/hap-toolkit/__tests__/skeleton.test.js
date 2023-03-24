/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const path = require('@jayfate/path')
const fse = require('fs-extra')
const del = require('del')
const request = require('supertest')
const { copyApp } = require('hap-dev-utils')
const { compile, launchServer } = require('../lib')

describe('测试骨架屏功能', () => {
  let server
  let projectRoot
  let skSingleFile
  let skAnchorFile

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/app')
    projectRoot = await copyApp(testAppDir)
  })

  it(
    'save skeleton file',
    async () => {
      const data = await launchServer({
        port: 8083,
        disableADB: true,
        watch: false,
        cwd: projectRoot
      })
      server = data.server

      const response = await request(server).post('/saveskeletonfile').send({
        page: 'Demo',
        file: 'demo.sk',
        code: '<skeleton><clipPath width="750"></clipPath></skeleton>'
      })
      expect(response.status).toBe(200)

      const configFile = path.join(projectRoot, 'src/skeleton/config.json')
      const skFile = path.join(projectRoot, 'src/skeleton/page/demo.sk')

      expect(fse.existsSync(configFile)).toBeTruthy()
      expect(fse.existsSync(skFile)).toBeTruthy()
      expect(fse.readFileSync(configFile, 'utf-8')).toMatchSnapshot()
      expect(fse.readFileSync(skFile, 'utf-8')).toMatchSnapshot()
    },
    5 * 60 * 1000
  )

  it(
    'validate skeleton file',
    async () => {
      const skPath = path.join(projectRoot, 'src/skeleton')
      const skConfigPath = path.join(skPath, 'config.json')
      skSingleFile = path.join(skPath, 'page/demo.sk')
      skAnchorFile = path.join(skPath, 'page/anchor.sk')

      const page = 'Demo'
      const anchor = 'anchor456'
      const skConfigJson = {
        singleMap: { [page]: 'demo.sk' },
        anchorMaps: [
          {
            page: page,
            skeletonMap: {
              [anchor]: 'anchor.sk'
            }
          }
        ]
      }
      fse.emptyDirSync(skPath)
      fse.writeJsonSync(skConfigPath, skConfigJson)

      try {
        await compile('native', 'dev', false, { cwd: projectRoot })
      } catch (error) {
        expect(error.message).toMatch(
          `骨架屏singleMap配置页面 ${page} 的sk文件 ${skSingleFile} 不存在，请检查`
        )
      }

      fse.ensureFileSync(skSingleFile)
      try {
        await compile('native', 'dev', false, { cwd: projectRoot })
      } catch (error) {
        expect(error.message).toMatch(
          `骨架屏anchorMaps第 1 配置锚点 ${anchor} 的sk文件 ${skAnchorFile} 不存在，请检查`
        )
      }
    },
    5 * 60 * 1000
  )

  it(
    'compile with skeleton file',
    async () => {
      fse.ensureFileSync(skSingleFile)
      fse.ensureFileSync(skAnchorFile)

      const { stats } = await compile('native', 'dev', false, { cwd: projectRoot })
      expect(stats.hasErrors()).toBeFalsy()

      const skBuildConfigPath = path.join(projectRoot, 'build/skeleton/config.json')
      const skDemoBuildFile = path.join(projectRoot, 'build/skeleton/page/demo.sk')
      const skAnchorBuildFile = path.join(projectRoot, 'build/skeleton/page/anchor.sk')

      expect(fse.existsSync(skBuildConfigPath)).toBeTruthy()
      expect(fse.existsSync(skDemoBuildFile) && fse.existsSync(skAnchorBuildFile)).toBeTruthy()
    },
    5 * 60 * 1000
  )

  afterAll(async () => {
    server.close()
    await del([projectRoot])
  })
})
