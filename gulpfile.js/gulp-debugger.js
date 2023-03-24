/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const webpack = require('webpack')
const terser = require('gulp-terser')
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')

const { shallRun, shallWatch } = require('./utils')

const buildClient = require(path.resolve(__dirname, '../packages/hap-debugger/build-client.js'))

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/hap-debugger')
const GLOB_OPTS = { cwd }

function debugger__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function debugger__lint() {
  return gulp
    .src(['src/**/*.js', 'webpack.config.js'], {
      cwd,
      base: cwd
    })
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function debugger__transpile() {
  return gulp
    .src(
      [
        'src/**/*.js',
        '!src/client/**' // webpack will handle
      ],
      GLOB_OPTS
    )
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function debugger__minify(callback) {
  pump(
    [
      gulp.src(
        [
          'lib/**/*.js',
          '!lib/client/*' // webpack handled
        ],
        GLOB_OPTS
      ),
      sourcemaps.init({ loadMaps: true }),
      terser(),
      sourcemaps.write('.', { sourceRoot: '../src' }),
      gulp.dest('lib', GLOB_OPTS)
    ],
    callback
  )
}

// gulp use named function as task name
const clean = gulp.parallel(debugger__clean)
const lint = debugger__lint
const transpile = debugger__transpile
const minify = shallRun(debugger__minify)
const debukker = gulp.series(gulp.parallel(clean, lint), buildClient, transpile, minify)
const watch = shallWatch(
  'debugger',
  gulp.parallel(
    gulp.series(transpile, minify, function debugger__watch() {
      return gulp.watch(
        [
          'src/**/*.{js,html}',
          '!src/client/js/*' // webpack will handle
        ],
        GLOB_OPTS,
        gulp.series(transpile, minify)
      )
    })
  )
)

module.exports = {
  clean,
  lint,
  default: debukker,
  watch
}
