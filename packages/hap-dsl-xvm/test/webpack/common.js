/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const glob = require('glob')

exports.resolveEntries = function resolveEntries(cwd, pattern) {
  const files = glob.sync(pattern, { cwd })
  const entries = files.reduce((obj, file) => {
    // TODO resolve from manifest
    if (file.match(/\/common\//i)) {
      return obj
    }
    const outputName = file.replace(/\.(ux|mix)$/, '')
    const type = file.indexOf('TestCard') >= 0 ? 'card' : 'page'
    obj[outputName] = `./${file}?uxType=${type}`
    return obj
  }, {})
  return entries
}

exports.resolveLoader = function(loader) {
  return require.resolve(`../../lib/loaders/${loader}`)
}
