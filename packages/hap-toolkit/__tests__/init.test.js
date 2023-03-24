/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const process = require('process')
const fs = require('fs')
const path = require('@jayfate/path')
const glob = require('glob')
const del = require('del')
const { run, lsfiles } = require('hap-dev-utils')

describe('initialize a project', () => {
  const packageInfo = require('../package.json')
  const hapbin = path.resolve(__dirname, '../bin/index.js')

  it(
    'folder existed',
    async () => {
      const TEST_NAME = 'existed-app'
      const TEST_NAME2 = 'not-existed-app'
      const dialogs = [
        {
          pattern: /Init your project/,
          feeds: '\r'
        },
        {
          pattern: /Please pick a new name/,
          type: 'stderr',
          dialogs: [
            {
              pattern: /Init your project/,
              feeds: TEST_NAME2 + '\r'
            }
          ]
        }
      ]
      await del([TEST_NAME, TEST_NAME2], { force: true })
      fs.mkdirSync(TEST_NAME)
      const { stderr } = await run(process.execPath, [hapbin, 'init', TEST_NAME], dialogs)
      expect(stderr).toMatch('Please pick a new name')
      await del([TEST_NAME, TEST_NAME2], { force: true })
    },
    5 * 60 * 1000
  )

  it(
    'init project',
    async () => {
      // TODO fix：
      // 在Windows 上与对话交互有关的测试都过不了
      const TEST_NAME = 'auto-testapp'
      const targetdir = path.resolve(__dirname, TEST_NAME)

      const dialogs = [
        {
          pattern: /Init your project/,
          feeds: '\r'
        }
      ]

      await del([targetdir], { force: true })
      await run(process.execPath, [hapbin, 'init', TEST_NAME], dialogs)
      const files = await lsfiles('**/{*,.*}', { cwd: targetdir })
      expect(files).toMatchSnapshot()

      const writedPkg = fs.readFileSync(`./${TEST_NAME}/package.json`, 'utf-8')
      const pkgInfo = JSON.parse(writedPkg)
      expect(pkgInfo.devDependencies['hap-toolkit']).toBe('^' + packageInfo.version)
      await del([TEST_NAME], { force: true })
    },
    5 * 60 * 1000
  )

  it(
    'init vue demo project',
    async () => {
      // const TEST_NAME = 'project-vue-demo-testapp'
      // const targetdir = path.resolve(process.cwd(), TEST_NAME)
      // const dialogs = [
      //   {
      //     pattern: /Init your project/,
      //     feeds: '\r'
      //   }
      // ]
      // await del([TEST_NAME], { force: true })
      // await run(process.execPath, [hapbin, 'init', TEST_NAME, '--dsl=vue'], dialogs)
      // const files = await lsfiles('**/{*,.*}', { cwd: targetdir })
      // // 没有ux文件
      // files.forEach((item) => {
      //   expect(item).not.toMatch(/\.ux$/)
      // })
      // await del([TEST_NAME], { force: true })
    },
    5 * 60 * 1000
  )
})
