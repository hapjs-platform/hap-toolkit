/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const terser = require('gulp-terser')
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')

const { shallRun, shallWatch } = require('./utils')

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/hap-compiler')
const sourceRoot = path.resolve(cwd, 'src')
const GLOB_OPTS = { cwd }

function compiler__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function compiler__lint() {
  return gulp
    .src(['src/**/*.js'], GLOB_OPTS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function compiler__transpile() {
  return gulp
    .src(['src/**/*.js'], GLOB_OPTS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function compiler__minify(callback) {
  pump(
    [
      gulp.src('lib/**/*.js', GLOB_OPTS),
      sourcemaps.init({ loadMaps: true }),
      terser(),
      sourcemaps.write('.', { sourceRoot }),
      gulp.dest('lib', GLOB_OPTS)
    ],
    callback
  )
}

// gulp use named function as task name
const clean = compiler__clean
const lint = compiler__lint
const transpile = compiler__transpile
const minify = shallRun(compiler__minify)

const build = gulp.series(gulp.parallel(clean, lint), transpile, minify)
const watch = shallWatch(
  'compiler',
  gulp.series(build, function compiler__watch() {
    return gulp.watch(['src/**/*.js'], GLOB_OPTS, build)
  })
)

module.exports = {
  clean,
  lint,
  build,
  default: build,
  watch
}
