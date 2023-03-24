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
const cwd = path.resolve(__dirname, '../packages/hap-packager')
const GLOB_OPTS = { cwd }

function packager__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function packager__lint() {
  return gulp
    .src(['src/**/*.js', 'test/**/*.js', '!test/fixtures/**', '!test/build/**'], GLOB_OPTS)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
}

function packager__transpile() {
  return gulp
    .src(['src/**/*.js'], GLOB_OPTS)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src' }))
    .pipe(gulp.dest('lib', GLOB_OPTS))
}

function packager__minify(callback) {
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

function packager__copy_pem(callback) {
  pump([gulp.src('src/**/*.pem', GLOB_OPTS), gulp.dest('lib', GLOB_OPTS)], callback)
}

// gulp use named function as task name
function packager_test__clean() {
  return del(
    [
      'test/build/',
      'test/node_modules/',
      'test/fixtures/*/build/',
      'test/fixtures/*/dist/',
      'packages/hap-toolkit/fixtures/temp-test-app-*'
    ].map((subpath) => path.resolve(__dirname, '../', subpath)),
    GLOB_OPTS
  )
}

function packager_test__init() {
  const srcdir = './test/case/ux/TestTemplate/ImportTemplateAlias/*'
  const destdir = './node_modules/template-alias'
  return del([destdir], GLOB_OPTS).then(() => {
    gulp.src([srcdir], GLOB_OPTS).pipe(gulp.dest(destdir, GLOB_OPTS))
  })
}
const clean = gulp.parallel(packager__clean, packager_test__clean)
const lint = packager__lint
const transpile = packager__transpile
const minify = shallRun(packager__minify)
const copyPem = packager__copy_pem

const build = gulp.series(gulp.parallel(clean, lint), transpile, minify, copyPem)
const watch = shallWatch(
  'packager',
  gulp.series(build, function packager__watch() {
    return gulp.watch(['src/**/*.js'], GLOB_OPTS, build)
  })
)
const pretest = gulp.series(packager_test__clean, packager_test__init)

module.exports = {
  clean,
  lint,
  build,
  default: build,
  watch,
  pretest
}
