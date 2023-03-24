/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import NativeModule from 'module'
import Compilation from 'webpack/lib/Compilation'
import NormalModule from 'webpack/lib/NormalModule'
import NodeTemplatePlugin from 'webpack/lib/node/NodeTemplatePlugin'
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin'
import LibraryTemplatePlugin from 'webpack/lib/LibraryTemplatePlugin'
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin'
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin'

import { compileOptionsObject } from '@hap-toolkit/shared-utils/compilation-config'

const pluginName = `extract-css`

const MODULE_TYPE = `css/extract`

const exec = (loaderContext, code, filename) => {
  const module = new NativeModule(filename, loaderContext)

  module.paths = NativeModule._nodeModulePaths(loaderContext.context)
  module.filename = filename
  module._compile(code, filename)

  return module.exports
}

// pitch触发
module.exports.pitch = function (request) {
  const loaders = this.loaders.slice(this.loaderIndex + 1)

  const childFilename = '*'

  const outputOptions = {
    filename: childFilename
  }

  const childCompiler = this._compilation.createChildCompiler(`${pluginName}`, outputOptions)

  new NodeTemplatePlugin(outputOptions).apply(childCompiler)
  new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler)
  new NodeTargetPlugin().apply(childCompiler)
  new SingleEntryPlugin(this.context, `!!${request}`, pluginName).apply(childCompiler)
  new LimitChunkCountPlugin({ maxChunks: 1 }).apply(childCompiler)

  let source

  childCompiler.hooks.thisCompilation.tap(`${pluginName} loader`, (compilation) => {
    NormalModule.getCompilationHooks(compilation).loader.tap(
      `${pluginName} loader`,
      (loaderContext, module) => {
        loaderContext.emitFile = this.emitFile
        loaderContext[MODULE_TYPE] = false

        if (module.request === request) {
          module.loaders = loaders.map((loader) => {
            return {
              loader: loader.path,
              options: loader.options,
              ident: loader.ident
            }
          })
        }
      }
    )

    compilation.hooks.processAssets.tap(
      {
        name: pluginName,
        stage: Compilation.PROCESS_ASSETS_STAGE_REPORT
      },
      () => {
        source = compilation.assets[childFilename] && compilation.assets[childFilename].source()
        compilation.chunks.forEach((chunk) => {
          chunk.files.forEach((file) => {
            delete compilation.assets[file]
          })
        })
      }
    )
  })

  const callback = this.async()

  childCompiler.runAsChild((err, entries, compilation) => {
    if (err) {
      return callback(err)
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0])
    }

    compilation.fileDependencies.forEach((dep) => {
      this.addDependency(dep)
    }, this)

    compilation.contextDependencies.forEach((dep) => {
      this.addContextDependency(dep)
    }, this)

    if (!source) {
      return callback(new Error("Didn't get a result from child compiler"))
    }

    let cssObject = {}

    const cssModuleObject = exec(this, source, request)

    try {
      cssObject = {
        content: JSON.stringify(cssModuleObject),
        identifier: request
      }

      this[MODULE_TYPE](cssObject)
    } catch (e) {
      return callback(e)
    }

    let resultObject = cssModuleObject

    if (compileOptionsObject.removeUxStyle) {
      resultObject = {
        '@info': cssModuleObject[`@info`]
      }
    }

    let resultSource = `
      module.exports = ${JSON.stringify(resultObject)};
      // extracted by ${pluginName}
    `

    return callback(null, resultSource)
  })
}
