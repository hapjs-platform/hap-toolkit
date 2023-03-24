/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const terser = require('terser')
const gulpTerser = require('gulp-terser')
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')
const htmlmin = require('gulp-htmlmin')

const { shallRun, shallWatch, DEV_MODE } = require('./utils')

/* eslint-disable camelcase */
const cwd = path.resolve(__dirname, '../packages/hap-server')
const GLOB_OPTS = { cwd }

function server__clean() {
  return del(['lib'], GLOB_OPTS)
}

function server__lint() {
  return gulp
    .src(['src/**/*.js', '!src/preview/static/**'], GLOB_OPTS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function server__transpile() {
  return gulp
    .src(['src/**/*.js', '!src/preview/static/**'], GLOB_OPTS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function server__minify(callback) {
  pump(
    [
      gulp.src(['lib/**/*.js', '!lib/preview/static/**'], GLOB_OPTS),
      sourcemaps.init({ loadMaps: true }),
      gulpTerser(),
      sourcemaps.write('.', { sourceRoot: '../src' }),
      gulp.dest('lib', GLOB_OPTS)
    ],
    callback
  )
}

function server__template_minify() {
  let stream = gulp.src('src/**/*.html', GLOB_OPTS)
  if (!DEV_MODE) {
    stream = stream.pipe(
      htmlmin({
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      })
    )
  }
  stream = stream.pipe(gulp.dest('lib', GLOB_OPTS))
  return stream
}

function server__copy_static() {
  return gulp
    .src(['src/preview/static/**', '!src/**/*.html'], {
      ...GLOB_OPTS,
      base: path.resolve(cwd, 'src')
    })
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

// gulp use named function as task name
const clean = server__clean
const lint = server__lint
const transpile = server__transpile
const minify = shallRun(server__minify)

const build = gulp.series(
  gulp.parallel(clean, lint),
  gulp.parallel(transpile, server__template_minify, server__copy_static),
  minify
)
const watch = shallWatch(
  'server',
  gulp.series(build, function server__watch() {
    return gulp.watch(['src/**'], GLOB_OPTS, build)
  })
)

module.exports = {
  clean,
  lint,
  build,
  default: gulp.series(build),
  watch
}
