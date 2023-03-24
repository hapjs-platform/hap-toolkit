/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['@babel/preset-env', { modules: false }]],
    plugins: ['@babel/plugin-proposal-optional-chaining'],
    babelrcRoots: ['.', 'node_modules']
  }
}
