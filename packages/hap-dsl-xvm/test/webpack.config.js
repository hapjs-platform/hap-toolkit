/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { sync as resolveSync } from 'resolve'
import path from 'path'
import webpack from 'webpack'
import { ResourcePlugin, HandlerPlugin, ZipPlugin } from '@hap-toolkit/packager'
import { compileOptionsMeta, globalConfig } from '@hap-toolkit/shared-utils'
import { resolveTestEntries, resolveLoader } from './utils'

const src = path.join(__dirname, './case/ux')
const build = path.join(__dirname, './build/ux')
const dist = path.join(__dirname, './dist/ux')

Object.assign(globalConfig, { SRC_DIR: src, BUILD_DIR: build, DIST_DIR: dist })

const entries = resolveTestEntries(src, '**/*.{ux,mix}')

export default {
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
