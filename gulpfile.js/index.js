/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const samples = require('./gulp-sample')
const integrationTests = require('./gulp-integration-tests')
const compiler = require('./gulp-compiler')
const debukker = require('./gulp-debugger')
const packager = require('./gulp-packager')
const server = require('./gulp-server')
const sharedUtils = require('./gulp-shared-utils')
const toolkit = require('./gulp-toolkit')
const dslXvm = require('./gulp-dsl-xvm')

const { runTest } = require('./utils')

const target = {}

const taskNames = ['build', 'clean', 'lint', 'watch']
const modules = {
  samples,
  'integration-tests': integrationTests,
  compiler,
  debugger: debukker,
  server,
  packager,
  toolkit,
  'shared-utils': sharedUtils,
  'dsl-xvm': dslXvm
}
const moduleNames = Object.keys(modules)
const tasks = []

moduleNames.forEach((moduleName) => {
  if (modules[moduleName].default) {
    target[moduleName] = modules[moduleName].default
    tasks.push(target[moduleName])
  }
})
target.default = gulp.parallel.apply(gulp, tasks)

taskNames.forEach((taskName) => {
  const tasks = []
  moduleNames.forEach((moduleName) => {
    const module = modules[moduleName]
    if (module[taskName]) {
      tasks.push(module[taskName])
    }
  })
  target[taskName] = gulp.parallel.apply(gulp, tasks)
})

module.exports = {
  ...target,
  test: gulp.series(packager.pretest, function testAll() {
    return runTest(path.resolve(__dirname, '..'))
  })
}
