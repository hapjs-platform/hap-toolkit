/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const configClient = {
  mode: 'production',
  context: __dirname,
  entry: {
    index: './src/client/index.js'
  },
  output: {
    filename: '[name]-[hash:8].js',
    path: path.resolve(__dirname, 'lib/client')
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
      template: path.resolve(__dirname, './src/client/index.html'),
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

module.exports = configClient
