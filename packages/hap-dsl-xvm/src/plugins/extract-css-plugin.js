/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import webpack from 'webpack'
import JavascriptModulesPlugin from 'webpack/lib/javascript/JavascriptModulesPlugin'
import NormalModule from 'webpack/lib/NormalModule'

let ConcatSource, OriginalSource

const {
  util: { createHash }
} = webpack

const MODULE_TYPE = `css/extract`

const pluginName = 'css-extract-plugin'

const REGEXP_NAME = /\[name\]/i
const REGEXP_PLACEHOLDERS = /\[name\]/g
const DEFAULT_FILENAME = '[name].css.json'

class CssDependency extends webpack.Dependency {
  constructor({ identifier, content, media, sourceMap }, context, identifierIndex) {
    super()

    this.identifier = identifier
    this.identifierIndex = identifierIndex
    this.content = content
    this.media = media
    this.sourceMap = sourceMap
    this.context = context
  }

  getResourceIdentifier() {
    return `css-module-${this.identifier}-${this.identifierIndex}`
  }
}

class CssDependencyTemplate {
  apply() {}
}

class CssModule extends webpack.Module {
  constructor(dependency) {
    super(MODULE_TYPE, dependency.context)
    this.id = ''
    this._identifier = dependency.identifier
    this._identifierIndex = dependency.identifierIndex
    this.content = dependency.content
    this.media = dependency.media
    this.sourceMap = dependency.sourceMap
  }

  size() {
    return this.content.length
  }

  identifier() {
    return `css ${this._identifier} ${this._identifierIndex}`
  }

  readableIdentifier(requestShortener) {
    return `css ${requestShortener.shorten(this._identifier)}${
      this._identifierIndex ? ` (${this._identifierIndex})` : ''
    }`
  }

  nameForCondition() {
    const resource = this._identifier.split('!').pop()
    const idx = resource.indexOf('?')

    if (idx >= 0) {
      return resource.substring(0, idx)
    }

    return resource
  }

  updateCacheModule(module) {
    this.content = module.content
    this.media = module.media
    this.sourceMap = module.sourceMap
  }

  needRebuild() {
    return true
  }

  build(options, compilation, resolver, fileSystem, callback) {
    this.buildInfo = {}
    this.buildMeta = {}
    callback()
  }

  updateHash(hash, compilation) {
    const exportsInfo = compilation.chunkGraph.moduleGraph.getExportsInfo(this)
    exportsInfo.updateHash(hash)

    hash.update(this.content)
    hash.update(this.media || '')
    hash.update(this.sourceMap ? JSON.stringify(this.sourceMap) : '')
  }
}

class CssModuleFactory {
  create({ dependencies: [dependency] }, callback) {
    callback(null, new CssModule(dependency))
  }
}

class ExtractCssPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        filename: DEFAULT_FILENAME,
        moduleFilename: () => this.options.filename || DEFAULT_FILENAME,
        ignoreOrder: false
      },
      options
    )

    if (!this.options.chunkFilename) {
      const { filename } = this.options

      if (filename.match(REGEXP_PLACEHOLDERS)) {
        this.options.chunkFilename = filename
      }
    }
  }

  apply(compiler) {
    ConcatSource = compiler.webpack.sources.ConcatSource
    OriginalSource = compiler.webpack.sources.OriginalSource

    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      NormalModule.getCompilationHooks(compilation).loader.tap(pluginName, (lc, m) => {
        const loaderContext = lc
        const module = m
        loaderContext[MODULE_TYPE] = (cssModule) => {
          module.addDependency(new CssDependency(cssModule, m.context, 0))
        }
      })

      compilation.dependencyFactories.set(CssDependency, new CssModuleFactory())

      compilation.dependencyTemplates.set(CssDependency, new CssDependencyTemplate())

      compilation.hooks.renderManifest.tap(pluginName, (result, { chunk }) => {
        const renderedModules = Array.from(
          compilation.chunkGraph.getOrderedChunkModulesIterable(chunk)
        ).filter((module) => module.type === MODULE_TYPE)

        if (renderedModules.length > 0) {
          result.push({
            render: () =>
              this.renderContentAsset(
                compilation,
                chunk,
                renderedModules,
                compilation.runtimeTemplate.requestShortener
              ),
            filenameTemplate: ({ chunk: chunkData }) => this.options.moduleFilename(chunkData),
            pathOptions: {
              chunk,
              contentHashType: MODULE_TYPE
            },
            identifier: `${pluginName}.${chunk.id}`,
            hash: chunk.contentHash[MODULE_TYPE]
          })
        }
      })

      JavascriptModulesPlugin.getCompilationHooks(compilation).chunkHash.tap(
        pluginName,
        (chunk, hash) => {
          const { chunkFilename } = this.options

          if (REGEXP_NAME.test(chunkFilename)) {
            hash.update(JSON.stringify(chunk.getChunkMaps(true).name))
          }
        }
      )

      compilation.hooks.contentHash.tap(pluginName, (chunk) => {
        const { outputOptions } = compilation
        const { hashFunction, hashDigest, hashDigestLength } = outputOptions
        const hash = createHash(hashFunction)

        for (const m of Array.from(compilation.chunkGraph.getChunkEntryModulesIterable(chunk))) {
          if (m.type === MODULE_TYPE) {
            m.updateHash(hash, compilation)
          }
        }

        const { contentHash } = chunk

        contentHash[MODULE_TYPE] = hash.digest(hashDigest).substring(0, hashDigestLength)
      })
    })
  }

  renderContentAsset(compilation, chunk, modules, requestShortener) {
    let usedModules

    const [chunkGroup] = chunk.groupsIterable

    if (typeof chunkGroup.getModulePostOrderIndex === 'function') {
      // Store dependencies for modules
      const moduleDependencies = new Map(modules.map((m) => [m, new Set()]))

      // Get ordered list of modules per chunk group
      // This loop also gathers dependencies from the ordered lists
      // Lists are in reverse order to allow to use Array.pop()
      const modulesByChunkGroup = Array.from(chunk.groupsIterable, (cg) => {
        const sortedModules = modules
          .map((m) => {
            return {
              module: m,
              index: cg.getModulePostOrderIndex(m)
            }
          })
          // eslint-disable-next-line no-undefined
          .filter((item) => item.index !== undefined)
          .sort((a, b) => b.index - a.index)
          .map((item) => item.module)

        for (let i = 0; i < sortedModules.length; i++) {
          const set = moduleDependencies.get(sortedModules[i])

          for (let j = i + 1; j < sortedModules.length; j++) {
            set.add(sortedModules[j])
          }
        }

        return sortedModules
      })

      // set with already included modules in correct order
      usedModules = new Set()

      const unusedModulesFilter = (m) => !usedModules.has(m)

      while (usedModules.size < modules.length) {
        let success = false
        let bestMatch
        let bestMatchDeps

        // get first module where dependencies are fulfilled
        for (const list of modulesByChunkGroup) {
          // skip and remove already added modules
          while (list.length > 0 && usedModules.has(list[list.length - 1])) {
            list.pop()
          }

          // skip empty lists
          if (list.length !== 0) {
            const module = list[list.length - 1]
            const deps = moduleDependencies.get(module)
            // determine dependencies that are not yet included
            const failedDeps = Array.from(deps).filter(unusedModulesFilter)

            // store best match for fallback behavior
            if (!bestMatchDeps || bestMatchDeps.length > failedDeps.length) {
              bestMatch = list
              bestMatchDeps = failedDeps
            }

            if (failedDeps.length === 0) {
              // use this module and remove it from list
              const mm = list.pop()
              usedModules.add(mm)
              success = true
              break
            }
          }
        }

        if (!success) {
          // no module found => there is a conflict
          // use list with fewest failed deps
          // and emit a warning
          const fallbackModule = bestMatch.pop()
          if (!this.options.ignoreOrder) {
            compilation.warnings.push(
              new Error(
                `chunk ${chunk.name || chunk.id} [${pluginName}]\n` +
                  'Conflicting order between:\n' +
                  ` * ${fallbackModule.readableIdentifier(requestShortener)}\n` +
                  `${bestMatchDeps
                    .map((m) => ` * ${m.readableIdentifier(requestShortener)}`)
                    .join('\n')}`
              )
            )
          }

          usedModules.add(fallbackModule)
        }
      }
    } else {
      // fallback for older webpack versions
      // (to avoid a breaking change)
      // TODO remove this in next major version
      // and increase minimum webpack version to 4.12.0
      modules.sort((a, b) => a.index2 - b.index2)
      usedModules = modules
    }

    const source = new ConcatSource()

    source.add(`{ "list": [\n`)

    let i = 0

    usedModules.forEach((m, _, o) => {
      source.add(new OriginalSource(m.content, m.readableIdentifier(requestShortener)))
      if (++i !== o.size) {
        source.add(`,`)
        source.add(`\n`)
      }
    })

    source.add(`\n]}`)

    return new ConcatSource(source)
  }
}

module.exports = ExtractCssPlugin
