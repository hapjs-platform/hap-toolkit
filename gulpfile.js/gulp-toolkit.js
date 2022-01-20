/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const eslint = require('gulp-eslint')
const babel = require('gulp-babel')
const terser = require('gulp-terser')
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')

const { shallRun, shallWatch } = require('./utils')

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/hap-toolkit/')
const GLOB_OPTS = { cwd }

function toolkit__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function toolkit__lint() {
  return gulp
    .src(['bin/*.js', 'src/**/*.js', 'gen-webpack-conf/*.js'], GLOB_OPTS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function toolkit__transpile() {
  return gulp
    .src(['src/**/*.js'], GLOB_OPTS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function toolkit__minify(callback) {
  pump(
    [
      gulp.src('lib/**/*.js', GLOB_OPTS),
      sourcemaps.init({ loadMaps: true }),
      terser(),
      sourcemaps.write('.', { sourceRoot: '../src' }),
      gulp.dest('lib', GLOB_OPTS)
    ],
    callback
  )
}

// gulp use named function as task name
const clean = toolkit__clean
const lint = toolkit__lint
const transpile = toolkit__transpile
const minify = shallRun(toolkit__minify)

const build = gulp.series(gulp.parallel(clean, lint), transpile, minify)

const watch = shallWatch(
  'toolkit',
  gulp.series(build, function toolkit__watch() {
    return gulp.watch(['bin/index.js', 'src/**/*.js', 'gen-webpack-conf.js'], GLOB_OPTS, build)
  })
)

module.exports = {
  clean,
  lint,
  default: build,
  build,
  watch
}
