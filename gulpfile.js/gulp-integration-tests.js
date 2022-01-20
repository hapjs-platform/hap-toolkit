/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const del = require('del')

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/integration-tests/')
const GLOB_OPTS = { cwd }

function integrationTests__clean() {
  return del([], GLOB_OPTS).then(() => {
    return del(['existed-app-*', 'no-exist-app-*', 'integration-auto-testapp-*'], {
      cwd: path.resolve(cwd, '../../', 'test/build/projects')
    })
  })
}

// gulp use named function as task name
const clean = integrationTests__clean

module.exports = {
  clean
}
