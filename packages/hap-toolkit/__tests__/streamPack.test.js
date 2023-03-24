/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
const path = require('@jayfate/path')
const del = require('del')
const glob = require('glob')
const JSZip = require('jszip')
const { copyApp } = require('hap-dev-utils')
const { compile } = require('../lib/commands/compile')

describe('resign quickapp', () => {
  it(
    'files in subpackage when --disable-stream-pack is true',
    async () => {
      const testAppDir = path.resolve(__dirname, '../fixtures/subpackage-app')
      const tempAppDir = await copyApp(testAppDir)

      const options = {
        optimizeUnusedResource: true,
        cwd: tempAppDir,
        disableStreamPack: true
      }

      const { stats } = await compile('native', 'prod', false, options)
      expect(stats.hasErrors()).toBeFalsy()

      const distProjectBuildPath = path.join(tempAppDir, 'dist')
      const rpk = glob.sync('**/*.rpk', {
        cwd: distProjectBuildPath
      })

      const rpks = glob.sync('**/*.rpks', {
        cwd: distProjectBuildPath
      })

      let rpkContents
      if (rpk && rpk[0]) {
        rpkContents = await JSZip.loadAsync(
          fs.readFileSync(path.resolve(distProjectBuildPath, rpk[0]))
        )
        expect(rpkContents.files['META-INF/']).toBeFalsy()
      }

      let rpksContents

      if (rpks && rpks[0]) {
        rpksContents = await JSZip.loadAsync(
          fs.readFileSync(path.resolve(distProjectBuildPath, rpks[0]))
        )
        expect(rpksContents.files['META-INF/']).toBeFalsy()
        const files = Object.keys(rpksContents.files)
        for (let i = 0; i < files.length; i++) {
          const item = files[i]
          const result = await JSZip.loadAsync(rpksContents.files[item].async('nodebuffer'))
          expect(result.files['META-INF/']).toBeFalsy()
        }
      }

      await del([tempAppDir], { force: true })
    },
    5 * 60 * 1000
  )

  it(
    'files in subpackage when --disable-stream-pack is false',
    async () => {
      const testAppDir = path.resolve(__dirname, '../fixtures/subpackage-app')
      const tempAppDir = await copyApp(testAppDir)

      const options = {
        optimizeUnusedResource: true,
        cwd: tempAppDir,
        disableStreamPack: false
      }

      const { stats } = await compile('native', 'prod', false, options)
      expect(stats.hasErrors()).toBeFalsy()

      const distProjectBuildPath = path.join(tempAppDir, 'dist')
      const rpk = glob.sync('**/*.rpk', {
        cwd: distProjectBuildPath
      })

      const rpks = glob.sync('**/*.rpks', {
        cwd: distProjectBuildPath
      })

      let rpkContents
      if (rpk && rpk[0]) {
        rpkContents = await JSZip.loadAsync(
          fs.readFileSync(path.resolve(distProjectBuildPath, rpk[0]))
        )
        expect(rpkContents.files['META-INF/']).toBeDefined()
      }

      let rpksContents

      if (rpks && rpks[0]) {
        rpksContents = await JSZip.loadAsync(
          fs.readFileSync(path.resolve(distProjectBuildPath, rpks[0]))
        )
        expect(rpksContents.files['META-INF/']).toBeFalsy()
        const files = Object.keys(rpksContents.files)
        for (let i = 0; i < files.length; i++) {
          const item = files[i]
          const result = await JSZip.loadAsync(rpksContents.files[item].async('nodebuffer'))
          expect(result.files['META-INF/']).toBeDefined()
        }
      }

      await del([tempAppDir], { force: true })
    },
    5 * 60 * 1000
  )
})
