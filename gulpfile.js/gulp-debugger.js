/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const gulp = require('gulp')
const webpack = require('webpack')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const terser = require('gulp-terser')
const pump = require('pump')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')

const { shallRun, shallWatch } = require('./utils')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const cwd = path.resolve(__dirname, '../packages/hap-debugger')
const src = path.resolve(cwd, 'src')

const webpackConf = {
  mode: 'production',
  context: src,
  entry: {
    index: path.resolve(src, './client/index.js')
  },
  output: {
    filename: '[name]-[hash:8].js',
    path: path.resolve(src, '../lib/client')
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, './client/index.html'),
      filename: './index.html', // 这是相对于output输出路径的根;
      inject: 'body',
      minify: {
        minifyCSS: true,
        removeComments: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: './index-[hash:8].css'
    })
  ],
  optimization: {
    minimizer: [new CssMinimizerPlugin({})]
  }
}

function buildClient(callback) {
  webpack(webpackConf, (err, stats) => {
    if (err) {
      console.log(err.message)
    }
    if (stats && stats.hasErrors()) {
      console.log(
        stats.toString({
          chunks: false,
          colors: true
        })
      )
    }
    callback && callback()
  })
}

const GLOB_OPTS = { cwd }

function debugger__clean() {
  return del(['lib/'], GLOB_OPTS)
}

function debugger__lint() {
  return gulp
    .src(['src/**/*.js'], {
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
