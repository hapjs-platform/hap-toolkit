/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const fs = require('fs')
const path = require('@jayfate/path')
const { Writable } = require('stream')
const del = require('del')
const glob = require('glob')
const stripAnsi = require('strip-ansi')
const { copyApp, wipeDynamic } = require('hap-dev-utils')
const { compile, stopWatch } = require('../lib')
const JSZip = require('jszip')

describe('测试compile', () => {
  const platform = 'native'
  let projectRoot
  let buildDir
  let outputs
  let outputStream
  let sitemapPath
  let babelConfigPath

  beforeAll(async () => {
    const testAppDir = path.resolve(__dirname, '../fixtures/app')
    projectRoot = await copyApp(testAppDir)
    buildDir = path.resolve(projectRoot, 'build')
    outputs = []
    outputStream = new Writable({
      write(chunk, encoding, next) {
        outputs.push(chunk.toString())
        next()
      }
    })
    sitemapPath = path.join(projectRoot, 'src/sitemap.json')
    babelConfigPath = path.join(projectRoot, 'babel.config.js')
  })

  it('generate webpack config', () => {
    const genWebpackConf = require('../gen-webpack-conf')
    const conf = genWebpackConf(
      {
        cwd: projectRoot
      },
      'development'
    )
    expect(conf.entry).toMatchSnapshot()
  })

  it(
    'compile release',
    async () => {
      const mode = 'prod'
      const expectResult = [
        'app.js',
        'CardDemo/index.js',
        'Common/logo.png',
        'Common/tu.9.png',
        'Demo/index.js',
        'workers/request/index.js'
      ]

      const { stats } = await compile(platform, mode, false, {
        cwd: projectRoot
      })
      expect(stats.hasErrors()).toBe(false)

      const result = glob.sync('**/*.{json,css,png,js,js.map}', {
        cwd: buildDir
      })
      expect(result).toEqual(expect.arrayContaining(expectResult))
      expect(result).toMatchSnapshot()
    },
    5 * 60 * 1000
  )

  it(
    'compile preview package',
    async () => {
      // 为保证测试简单，随机写死一个hash
      const userHash = '49ba59abbe56e057'
      const previewPackageSuffix = '.__preview__'
      const mode = 'prod'
      const tempPreviewPath = path.resolve(__dirname, '../fixtures/')
      const manifestPath = path.resolve(buildDir, './manifest.json')
      const { stats } = await compile(platform, mode, false, {
        cwd: projectRoot,
        buildPreviewRpkOptions: {
          setPreviewPkgPath: tempPreviewPath,
          userNameHash: userHash
        }
      })
      expect(stats.hasErrors()).toBe(false)
      // 1、是否正确输出到了指定目录
      const manifest = JSON.parse(fs.readFileSync(manifestPath).toString())
      const previewRpkOutput = `${tempPreviewPath}/${manifest.package}.__preview__.debug.${manifest.versionName}.rpk`
      const err = fs.accessSync(previewRpkOutput, fs.constants.F_OK)
      expect(err).toBe(undefined)
      // 2、输出文件内的包名和name是否被正确替换
      const outputRpkBuf = fs.readFileSync(previewRpkOutput)
      const outputRpkZip = await JSZip.loadAsync(outputRpkBuf)
      const manifestJSON = await outputRpkZip.file('manifest.json').async('string')
      const pkgNameExistResult =
        JSON.parse(manifestJSON).package.indexOf(previewPackageSuffix) !== -1
      const nameExistResult = JSON.parse(manifestJSON).name === userHash
      expect(pkgNameExistResult).toBe(true)
      expect(nameExistResult).toBe(true)
      // 3、原build目录内的包名是否正确被重置
      const manifestJsonOther = JSON.parse(fs.readFileSync(manifestPath).toString())
      const pkgNameResetResult = manifestJsonOther.package.indexOf(previewPackageSuffix) === -1 // 说明包名被重置了
      const nameResetResult = manifestJsonOther.name !== userHash // 说明name被重置了
      expect(pkgNameResetResult).toBe(true)
      expect(nameResetResult).toBe(true)
      // 删除临时rpk文件
      const _err = fs.unlinkSync(previewRpkOutput)
      expect(_err).toBe(undefined)
    },
    5 * 60 * 1000
  )

  // 这里会记录很多内容
  it(
    'compile build devtool=false',
    async () => {
      const mode = 'dev'
      const expectResult = [
        'app.js',
        'CardDemo/index.js',
        'Demo/index.js',
        'workers/request/index.js'
      ]

      // 第三个参数为是否开启watch，true为开启
      const data = await compile(platform, mode, true, {
        cwd: projectRoot,
        log: outputStream,
        devtool: false
      })
      expect(data.compileError).toBeNull()
      expect(data.stats.hasErrors()).toBe(false)

      const result = glob.sync('**/*.{js,js.map}', {
        cwd: buildDir
      })
      expect(result).toEqual(expect.arrayContaining(expectResult))
      expect(result).toMatchSnapshot()

      // 更详细的 snapshots
      const json = data.stats.toJson({
        source: true
      })
      json.modules.forEach((module, index) => {
        expect(wipeDynamic(module.source, [[projectRoot, '<project-root>']])).toMatchSnapshot()
      })
      expect(json.assets.map((a) => a.name)).toMatchSnapshot('assets list')
      // eg. '\u001B[4mUnicorn\u001B[0m' => 'Unicorn'
      const output = stripAnsi(outputs.join('\n'))
      expect(wipeDynamic(output)).toMatchSnapshot('outputs')
    },
    5 * 60 * 1000
  )

  // 保证上一个 watcher 实例关闭，这里不加就报错
  it('stop watch', async () => {
    const data = await stopWatch()
    expect(data.stopWatchError).toBeNull()
  })

  it(
    'compile build devtool=source-map',
    async () => {
      const mode = 'dev'
      const expectResult = [
        'app.js',
        'app.js.map',
        'CardDemo/index.js',
        'CardDemo/index.js.map',
        'Common/logo.png',
        'Common/tu.9.png',
        'Demo/index.js',
        'Demo/index.js.map',
        'workers/request/index.js',
        'workers/request/index.js.map'
      ]

      // 第三个参数为是否开启watch，true为开启
      const data = await compile(platform, mode, true, { cwd: projectRoot, devtool: 'source-map' })
      expect(data.compileError).toBeNull()
      expect(data.stats.hasErrors()).toBe(false)

      const result = glob.sync('**/*.{json,css,png,js,js.map}', {
        cwd: buildDir
      })
      expect(result).toEqual(expect.arrayContaining(expectResult))
      expect(result).toMatchSnapshot()
    },
    5 * 60 * 1000
  )

  it('stop watch', async () => {
    const data = await stopWatch()
    expect(data.stopWatchError).toBeNull()
  })

  it(
    'validate sitemap',
    async () => {
      const mode = 'dev'
      const errPage = '123'
      const sitemap = {
        doc: 'https://doc.quickapp.cn/framework/sitemap.html',
        rules: [{ rule: 'enable', page: errPage }]
      }
      fs.writeFileSync(sitemapPath, JSON.stringify(sitemap))

      // 第三个参数为是否开启watch，true为开启
      try {
        await compile(platform, mode, false, { cwd: projectRoot, devtool: 'source-map' })
      } catch (err) {
        expect(err.message).toMatch(`sitemap rules第1项配置错误，该page不存在：${errPage}`)
      }
    },
    5 * 60 * 1000
  )

  it(
    'compile without babel.config.js',
    async () => {
      const mode = 'dev'
      // 删去 sitemap 以防校验影响
      fs.unlinkSync(sitemapPath)
      fs.unlinkSync(babelConfigPath)

      const { stats } = await compile(platform, mode, false, {
        cwd: projectRoot
      })
      expect(stats.hasErrors()).toBe(false)
    },
    5 * 60 * 1000
  )

  it(
    'compile with custom babel.config.js plugin',
    async () => {
      const mode = 'dev'
      const customBabelPlugin = '@babel/plugin-custom-demo'
      const babelConfig = `
      module.exports = function(api) {
        api.cache(true)
        return {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs', '${customBabelPlugin}'],
          babelrcRoots: ['.', 'node_modules']
        }
      }
      `
      fs.writeFileSync(babelConfigPath, babelConfig)

      const { stats } = await compile(platform, mode, false, {
        cwd: projectRoot
      })
      stats.compilation.errors.forEach((error) => {
        expect(error.message).toMatch(`Cannot find module '${customBabelPlugin}'`)
      })
    },
    5 * 60 * 1000
  )

  afterAll(async () => {
    await del([projectRoot])
  })
})
