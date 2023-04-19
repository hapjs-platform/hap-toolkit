/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('path')
const webpack = require('webpack')

function buildClient(callback) {
  const webpackConf = require(path.resolve(__dirname, './webpack.config.js'))
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

module.exports = buildClient
