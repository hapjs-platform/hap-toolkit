/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const process = require('process')
const fs = require('fs')
const { spawn } = require('child_process')
const JSZip = require('jszip')
const path = require('@jayfate/path')
const glob = require('glob')
const fse = require('fs-extra')

/**
 * 与子进程"对话"
 *
 * @param {ChildProcess} proc - 子进程
 * @param {Array<Object>} dialogs - 对话列表
 */
function talkTo(proc, dialogs) {
  proc.stdout.on('data', stdHandler('stdout', dialogs))
  proc.stderr.on('data', stdHandler('stderr', dialogs))

  function stdHandler(type, dialogs) {
    const consumer = process[type]
    let _dialogs = dialogs.filter(
      (dlg) => dlg.type === type || (type === 'stdout' && dlg.type !== 'stderr')
    )
    let output = ''
    return function (data) {
      consumer.write(data)
      output += data
      if (!_dialogs.length) {
        return
      }
      const idx = _dialogs.findIndex((dlg) => {
        if (typeof dlg.pattern === 'object' && dlg.pattern.constructor === RegExp) {
          return output.match(dlg.pattern)
        } else if (typeof dlg.pattern === 'function') {
          return dlg.pattern(output, proc)
        }
      })
      // 匹配到特定模式，写入响应 feeds，实现交互的模拟
      if (idx > -1) {
        const dialog = _dialogs[idx]
        switch (typeof dialog.feeds) {
          case 'string':
            proc.stdin.write(dialog.feeds || '')
            break
          case 'function':
            dialog.feeds(proc, output)
            break
        }
        _dialogs.splice(idx, 1)
        if (dialog.dialogs && !proc.killed) {
          talkTo(proc, dialog.dialogs)
        }
      }
    }
  }
}

/**
 * 为执行任务设定模式和输入
 * 以便测试命令行交互
 *
 * TODO run with nyc to collect coverage
 *
 * @param {String} file - 执行文件
 * @param {Array<String>} args - 执行参数
 * @param {Array<Object>} dialogs - 对话描述
 * @returns {Promise}
 */
function run(cmd, args = [], dialogs = [], opts = {}) {
  return new Promise((resolve, reject) => {
    let stdout = ''
    let stderr = ''
    const proc = spawn(cmd, args, {
      shell: true,
      detached: true,
      env: {
        ...process.env,
        NODE_OPTIONS: `--require ${path.resolve(__dirname, 'inject.js')}`
      },
      ...opts
    })
    talkTo(proc, dialogs)
    proc.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    proc.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    function endChild() {
      resolve({ stdout, stderr })
    }
    proc.on('SIGINT', endChild)
    proc.on('SIGKILL', endChild)
    proc.on('SIGTERM', endChild)
    proc.on('beforeExit', endChild)
    proc.on('exit', endChild)
    proc.on('close', endChild)

    function end() {
      proc.kill('SIGINT')
      proc.kill('SIGTERM')
    }
    process.on('SIGINT', end)
    process.on('SIGKILL', end)
    process.on('SIGTERM', end)
    process.on('beforeExit', end)
    process.on('exit', end)
  })
}

/**
 * 列出所有文件/文件夹
 *
 * @param {string} pattern - glob pattern
 * @param {Object} globopts  - glob options
 * @returns {<Promise>}
 */
function lsfiles(pattern = '**/{*,.*}', globopts = {}) {
  return new Promise((resolve, reject) => {
    glob(pattern, globopts, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

let uniqueId = process.env.JEST_WORKER_ID * 1000
/**
 * 复制一份项目
 * 供测试
 *
 * @param {String} projectDir - 项目目录
 * @returns {Promise<projectDir,buildDir>}
 */
async function copyApp(projectDir) {
  let target = path.resolve(projectDir, '../temp-test-app-' + uniqueId++)
  while (fse.existsSync(target)) {
    target = path.resolve(projectDir, '../temp-test-app-' + uniqueId++)
  }
  try {
    await fse.copy(projectDir, target)
  } catch (error) {
    console.log(error)
    console.log(`recopy`)
    target = copyApp(projectDir)
  }
  return target
}

/**
 * 读取 zip(rpk) 文件内容
 *
 * @param zipfile
 * @returns {undefined}
 */
function readZip(zipfile) {
  return new Promise((resolve, reject) => {
    fs.readFile(zipfile, (err, buffer) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        JSZip.loadAsync(buffer).then(resolve, reject)
      }
    })
  })
}

const version = require('./package.json').version
const versionRe = new RegExp(version.replace(/\./g, '\\.'), 'g')
const cwdRe = new RegExp(path.resolve(process.cwd()), 'g')
const buildTimeRe = /(Build Time Cost:\s+)[0-9.]+s/gm
/**
 * 将各种动态数据置换为占位符
 *
 * @param {String} string
 * @param {Array<Array<String|RegExp>>} [extendList=[]] - 自定义的数据
 * @returns {String}
 */
function wipeDynamic(string, extendList = []) {
  let wiped = string
  extendList.forEach(([pattern, placeholder]) => {
    if (typeof pattern === 'string') {
      pattern = path.resolve(pattern)
    }
    const re = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern
    wiped = wiped.replace(re, placeholder)
  })
  wiped = wiped
    .replace(versionRe, '<VERSION>')
    .replace(cwdRe, '<CWD>')
    .replace(buildTimeRe, '$1: <time-cost>')
  return wiped
}

/**
 * 用标线分行隔开
 * 同时 wipeDynamic
 *
 * @param {Array<String>} arr
 * @returns {String}
 */
function rowify(arr) {
  const joined = arr.join('\n' + '~'.repeat(80) + '\n')
  return wipeDynamic(joined)
}

module.exports = {
  run,
  lsfiles,
  copyApp,
  readZip,
  wipeDynamic,
  rowify
}
