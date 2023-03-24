/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const del = require('del')
const glob = require('glob')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib/commands/compile')
const { compileOptionsMeta } = require('@hap-toolkit/shared-utils/compilation-config')
const { resign } = require('../lib/commands/resign')
const { setRemoteCryptoSignFunction } = require('@hap-toolkit/packager/lib/index')

describe('resign quickapp', () => {
  it(
    'resign rpk/rpks',
    async () => {
      const testAppDir = path.resolve(__dirname, '../fixtures/subpackage-app')
      const tempAppDir = await copyApp(testAppDir)

      const options = {
        optimizeUnusedResource: true,
        cwd: tempAppDir,
        disableSign: true,
        signMode: compileOptionsMeta.signModeEnum.NULL
      }

      // 仅验证函数调用成功，不做真正的签名
      setRemoteCryptoSignFunction((...args) => {
        return args[0]
      })

      const { stats } = await compile('native', 'prod', false, options)
      expect(stats.hasErrors()).toBeFalsy()

      const distProjectBuildPath = path.join(tempAppDir, 'dist')
      const files = glob.sync('**/*.{rpk,rpks}', {
        cwd: distProjectBuildPath
      })

      files.forEach((item) => {
        expect(item).toMatch(/.*nosign.*/)
      })

      await resign({
        sign: 'sign/debug',
        dest: 'dest',
        origin: 'dist'
      })

      const distProjectResignPath = path.join(tempAppDir, 'dest')
      const resignFiles = glob.sync('**/*.{rpk,rpks}', {
        cwd: distProjectResignPath
      })

      expect(resignFiles.length).toEqual(files.length)

      await del([tempAppDir], { force: true })
    },
    5 * 60 * 1000
  )
})
