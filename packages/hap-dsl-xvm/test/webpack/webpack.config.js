/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { sync as resolveSync } from 'resolve'
import path from '@jayfate/path'
import webpack from 'webpack'

console.log(`aaa`)
const { resolveEntries, resolveLoader } = require('./common')

const src = path.join(__dirname, '../case/ux')
const build = path.join(__dirname, '../build/ux')
const dist = path.join(__dirname, '../dist/ux')

const entries = resolveEntries(src, '**/*.{ux,mix}')

const { ResourcePlugin, HandlerPlugin, ZipPlugin } = require('@hap-toolkit/packager')

const { compileOptionsMeta } = require('@hap-toolkit/shared-utils')

module.exports = {
  context: src,
  mode: 'development',
  node: false,
  entry: entries,
  output: {
    filename: '[name].js',
    path: build
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: new RegExp(
          `(${['.ux', '.mix']
            .slice(0, 2)
            .map(k => '\\' + k)
            .join('|')})(\\?[^?]+)?$`
        ),
        use: [resolveLoader('ux-loader.js')]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: resolveSync('@hap-toolkit/packager/lib/loaders/module-loader.js')
          },
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        // 过滤输出的日志，不写默认为false
        suppresslogs: true
      }
    }),
    new ResourcePlugin({
      src: src,
      dest: build,
      projectRoot: '',
      configDebugInManifest: true
    }),
    new ZipPlugin({
      name: 'test',
      output: dist,
      pathSrc: src,
      pathBuild: build,
      signMode: compileOptionsMeta.signModeEnum.NULL
    }),
    new HandlerPlugin({
      pathSrc: src
    })
  ]
}
