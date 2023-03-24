/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const jestCli = require('jest-cli')
const PluginError = require('plugin-error')

// gulp --dev
const DEV_MODE = process.argv.indexOf('--dev') !== -1

/**
 * Do nothing.
 */
function NOOP(callback) {
  callback()
}

/**
 * Shall we run minify-task ... or just NOOP ?
 * TODO silence NOOP message
 *
 * @param task - task function
 * @returns {Function}
 */
function shallRun(task) {
  return DEV_MODE ? NOOP : task
}

const nameMap = {
  c: 'compiler',
  d: 'debugger',
  p: 'packager',
  s: 'server',
  t: 'toolkit',
  x: 'dsl-xvm'
}
const isWatchMode = process.argv.indexOf('watch') !== -1
const moduleOpts = ['--modules', '-m']
const moduleIdx = process.argv.findIndex((arg) => moduleOpts.includes(arg))
let modules = moduleIdx === -1 ? [] : (process.argv[moduleIdx + 1] || '').split(',')

modules = modules.filter((m) => Boolean(m.trim()))

/**
 * Shall watch for module xxx ?
 * @usage
 * gulp watch --modules # watch all
 * gulp watch --modules debugger # watch debugger
 * gulp watch --modules debugger,packager # watch both debugger and packager
 * gulp watch -m d,p # same as above
 *
 * @param moduleName - module name
 * @param task - module's watching task
 * @returns {Function}
 */
function shallWatch(moduleName, task) {
  const firstChar = moduleName[0]
  if (!nameMap[firstChar]) {
    console.warn('! 未配置监听模块名', moduleName)
  }
  const contained = modules.some((module) => module[0] === firstChar)
  if (isWatchMode && (modules.length === 0 || contained)) {
    console.log('> watching', moduleName)
    return task
  } else {
    return NOOP
  }
}

/**
 * 在`cwd`下执行 jest
 *
 * @param String [cwd=process.cwd()] - 工作目录
 * @returns {<Promise>}
 */
function runTest(cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV == null) {
      // 命令行执行的 jest 也会设置 NODE_ENV=test
      process.env.NODE_ENV = 'test'
    }
    // from alansouzati/gulp-jest, resolved issue #53
    jestCli.runCLI({}, [cwd]).then(({ results }) => {
      if (results.numFailedTests || results.numFailedTestSuites) {
        reject(new PluginError('jest', { message: 'Tests failed at ' + cwd }))
      } else if (typeof results.success !== 'undefined' && !results.success) {
        reject(
          new PluginError('jest', {
            message: 'Tests Failed due to coverage threshold breaches'
          })
        )
      } else {
        resolve()
      }
    })
  })
}

module.exports = {
  DEV_MODE,
  NOOP,
  shallRun,
  shallWatch,
  runTest
}
