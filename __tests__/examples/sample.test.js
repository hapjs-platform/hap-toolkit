/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const { Writable } = require('stream')
const fetch = require('node-fetch')
const fkill = require('fkill')
const stripAnsi = require('strip-ansi')
const { run, lsfiles, readZip, wipeDynamic } = require('hap-dev-utils')
const { compile } = require('../../packages/hap-toolkit/lib')

// IMPORTANT run `lerna bootstrap` before running tests
describe('hap-toolkit', () => {
  const cwd = path.resolve(__dirname, '../../examples/sample')

  it(
    'hap-build: 默认流式打包，包内存在META-INF文件',
    async () => {
      await run('npm', ['run', 'build'], [], { cwd })
      const rpks = await lsfiles('dist/*.rpk', { cwd })
      // TODO more details
      expect(rpks.length).toBe(1)
      let rpkPath = path.resolve(cwd, rpks[0])
      // 读取压缩包中的内容
      const packages = await readZip(rpkPath)
      const hasMeta = packages.files['META-INF/']
      const hasMetaCert = packages.files['META-INF/CERT']
      expect(hasMeta).toBeTruthy()
      expect(hasMetaCert).toBeTruthy()
    },
    6 * 60 * 1000
  )

  it(
    'hap-build [--disable-stream-pack]: 包内不存在META-INF文件',
    async () => {
      await run('npm', ['run', 'build', '-- --disable-stream-pack'], [], { cwd })
      const rpks = await lsfiles('dist/*.rpk', { cwd })
      let rpkPath = path.resolve(cwd, rpks[0])
      // 读取压缩包中的内容
      const packages = await readZip(rpkPath)
      const hasMeta = packages.files['META-INF/']
      expect(hasMeta).toBeFalsy()
    },
    6 * 60 * 1000
  )

  it(
    'hap-server',
    async () => {
      const dialogs = [
        {
          pattern: (output) => {
            return output.match(/生成HTTP服务器的二维码: (http:\/\/.*)/)
          },
          feeds: (proc, output) => {
            const match = output.match(/生成HTTP服务器的二维码: (http:\/\/.*)/)
            const url = match[1]
            const p1 = fetch(url)
              .then((res) => {
                expect(res.status).toBe(200)
                return res.text()
              })
              .then((text) => {
                expect(text).toMatch('<title>调试器</title>')
              })
            const p2 = fetch(url + '/qrcode')
              .then((res) => res.arrayBuffer())
              .then((buffer) => {
                expect(Buffer.from(buffer).readUInt32BE(0)).toBe(0x89504e47)
              })

            Promise.all([p1, p2]).then(async () => {
              await fkill(proc.pid)
            })
          }
        },
        {
          pattern: /listen EADDRINUSE: address already in use/,
          type: 'stderr',
          feeds: (proc, output) => {
            proc.kill('SIGINT')
            proc.kill('SIGTERM')
            throw new Error('address in use')
          }
        }
      ]

      await run('npm', ['run', 'server'], dialogs, { cwd })
    },
    6 * 60 * 1000
  )

  it(
    'missed release pem files',
    async () => {
      let happened = false
      const dialogs = [
        {
          pattern: /编译错误，缺少release签名私钥文件/,
          type: 'stderr',
          feeds: (proc, output) => {
            happened = true
          }
        }
      ]
      await run('npm', ['run', 'release'], dialogs, { cwd })
      /**
      TODO fix:
      在windows平台上， function talkTo 里面不能正确拿到完整的 stdout, stderr
       */

      expect(happened).toBe(true)
    },
    6 * 60 * 1000
  )

  // 这里会记录很多内容到 snapshots
  it(
    'compile native',
    async () => {
      const projectRoot = path.resolve(__dirname, '../../examples/sample')

      const outputs = []
      const outputStream = new Writable({
        write(chunk, encoding, next) {
          outputs.push(chunk.toString())
          next()
        }
      })
      // 第三个参数为是否开启watch，true为开启
      // TODO other than `native`?
      const data = await compile('native', 'dev', false, {
        cwd: projectRoot,
        log: outputStream,
        buildNameFormat: 'CUSTOM=dev'
      })
      // 更详细的 snapshots
      const json = data.stats.toJson({
        source: true
      })
      const wipe = (content) =>
        wipeDynamic(content, [
          [projectRoot, '<project-root>'],
          [/大小为 \d+ KB/g, '大小为 <SIZE> KB']
        ])
      json.modules.forEach((module) => {
        if (module.source) {
          expect(wipe(module.source)).toMatchSnapshot(wipe(module.identifier))
        }
      })

      const rpks = await lsfiles('dist/*.rpk', { cwd: projectRoot })
      const hasCustom = rpks[0].indexOf('dev') !== -1
      expect(hasCustom).toBeTruthy()

      expect(json.assets.map((a) => a.name).sort()).toMatchSnapshot('assets list')
      const output = stripAnsi(outputs.join('\n'))
      // TODO expect(wipe(output)).toMatchSnapshot('outputs')
      expect(wipe(output)).not.toBeNull()
    },
    6 * 60 * 1000
  )
})
