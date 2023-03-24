/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Compilation from 'webpack/lib/Compilation'

/**
 * @param options
 * @constructor
 */
function SourcemapFixPlugin(options = {}) {
  this.options = options
}

let ConcatSource
SourcemapFixPlugin.prototype.apply = function (compiler) {
  ConcatSource = compiler.webpack.sources.ConcatSource
  compiler.hooks.compilation.tap('SourcemapFixPlugin', function (compilation) {
    compilation.hooks.processAssets.tap(
      {
        name: 'SourcemapFixPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
      },
      () => {
        compilation.chunks.forEach(function (chunk) {
          chunk.files.forEach(function (fileName) {
            // 在首行添加空行，解决运行时在首行插入代码，导致异常的首行列信息定位到源文件错误的问题
            const sourceList = warpNewLine(fileName, compilation)
            sourceList && (compilation.assets[fileName] = sourceList)
          })
        })
      }
    )
  })
}

function warpNewLine(fileName, compilation) {
  if (!/\.js$/.test(fileName)) {
    return
  }
  return new ConcatSource('\n', compilation.assets[fileName])
}

module.exports = SourcemapFixPlugin
