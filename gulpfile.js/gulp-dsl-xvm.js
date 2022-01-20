/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const terser = require('gulp-terser')
const jest = require('gulp-jest').default
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')

const { shallRun, shallWatch } = require('./utils')

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/hap-dsl-xvm')
const sourceRoot = path.resolve(cwd, 'src')
const GLOB_OPTS = { cwd }

function dslXvm__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function dslXvm__lint() {
  return gulp
    .src(['src/**/*.js', 'test/**/*.js', '!test/build/**'], GLOB_OPTS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function dslXvm__transpile() {
  return gulp
    .src(['src/**/*.js'], GLOB_OPTS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function dslXvm__minify(callback) {
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
const clean = dslXvm__clean
const lint = dslXvm__lint
const transpile = dslXvm__transpile
const minify = shallRun(dslXvm__minify)

const build = gulp.series(gulp.parallel(clean, lint), transpile, minify)
const watch = shallWatch(
  'dsl-xvm',
  gulp.series(build, function dslXvm__watch() {
    return gulp.watch(['src/**/*.js'], GLOB_OPTS, build)
  })
)

module.exports = {
  clean,
  lint,
  build,
  default: build,
  watch,
  test: function dslXvm__test() {
    return gulp.src(['test/**/*.test.js'], GLOB_OPTS).pipe(
      jest({
        rootDir: cwd
      })
    )
  }
}
