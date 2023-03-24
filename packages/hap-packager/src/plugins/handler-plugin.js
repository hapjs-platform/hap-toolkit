/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import Compilation from 'webpack/lib/Compilation'
import {
  compileOptionsMeta,
  compileOptionsObject
} from '@hap-toolkit/shared-utils/compilation-config'
import { getEntryFiles } from '../common/info'

let ConcatSource

/**
 * 对createAppHandler, createPageHandler包装，使得同一套代码适应多个平台
 * @param options
 * @constructor
 */
function HandlerPlugin(options) {
  this.options = options
}

HandlerPlugin.prototype.apply = function (compiler) {
  ConcatSource = compiler.webpack.sources.ConcatSource
  const workersPath = this.options.workers
  const enableE2e = this.options.enableE2e
  compiler.hooks.compilation.tap('HandlerPlugin', function (compilation) {
    compilation.hooks.processAssets.tap(
      {
        name: 'HandlerPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
      },
      () => {
        // 如果进行抽取公共js则需通过入口文件来判断是不是抽取出的Chunks
        const entryFiles = getEntryFiles(compiler.options.entry)
        compilation.chunks.forEach(function (chunk) {
          chunk.files.forEach(function (fileName) {
            if (fileName.startsWith(workersPath)) return
            const sourceList = wrapCode(fileName, compilation, enableE2e, entryFiles)
            sourceList && (compilation.assets[fileName] = sourceList)
          })
        })
      }
    )
  })
}

function wrapCode(fileName, compilation, enableE2e, entryFiles) {
  if (!/\.js$/.test(fileName)) {
    return
  }

  if (entryFiles.indexOf(fileName) === -1) {
    if (compileOptionsObject.splitChunksMode === compileOptionsMeta.splitChunksModeEnum.SMART) {
      // 抽取的JS chunk的处理，不加createPageHandler
      return new ConcatSource(compilation.assets[fileName])
    }
    compilation.errors.push(
      new Error(
        '### App Loader ### 使用了动态导入js, 请添加 `--split-chunks-mode=smart` 命令进行编译'
      )
    )
  } else {
    // 入口文件(非抽取 js chunk)的处理
    if (fileName.match(/\bapp\.js$/)) {
      // src/app.js
      return new ConcatSource(
        // Arg0
        `(function(){
    ${enableE2e ? 'global = typeof window === "undefined" ? global.__proto__  : window ;' : ''}
    var $app_define_wrap$ = $app_define_wrap$ || function() {}
    var manifestJson = ${JSON.stringify(global.framework.manifest)}
    var createAppHandler = function() {
      return `,
        // Arg1
        compilation.assets[fileName],
        // Arg2
        `
    };
    if (typeof window === "undefined") {
      return createAppHandler();
    }
    else {
      window.createAppHandler = createAppHandler
      // H5注入manifest以获取features
      global.manifest = manifestJson;
    }
  })();`
      )
    } else {
      // 非src/app.js
      return new ConcatSource(
        // Arg0
        `(function(){
    ${enableE2e ? 'global = typeof window === "undefined" ? global.__proto__  : window ;' : ''}
    var createPageHandler = function() {
      return `,
        // Arg1
        compilation.assets[fileName],
        // Arg2
        `
    };
    if (typeof window === "undefined") {
      return createPageHandler();
    }
    else {
      window.createPageHandler = createPageHandler
    }
  })();`
      )
    }
  }
}

module.exports = HandlerPlugin
