/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { colorconsole, readJson, logger } = require('@hap-toolkit/shared-utils')
const eventBus = require('@hap-toolkit/shared-utils/event-bus')
const { resolveEntries } = require('../utils')

const { PACKAGER_WATCH_START } = eventBus

function sort(list) {
  return list.sort((a, b) => a.localeCompare(b))
}

module.exports = class ManifestWatchPlugin {
  /**
   * @param {Object} options - 配置参数
   * @param {String} options.root - 应用根目录
   */
  constructor(options) {
    this.appRoot = options.appRoot
    this.root = options.root
    this.manifestFile = path.resolve(this.root, 'manifest.json')
    let entries = {}
    try {
      /** @readonly */
      const manifest = readJson(this.manifestFile)
      entries = resolveEntries(manifest, this.root, this.appRoot)
    } catch (_) {}
    this.list = Object.keys(entries)
    this.list = sort(this.list)
  }
  hasChanged(newList) {
    const sorted = sort(newList)
    const changed = JSON.stringify(sorted) !== JSON.stringify(this.list)
    if (changed) {
      this.list = sorted
    }
    return changed
  }
  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('watch', (compiler, callback) => {
      eventBus.emit(PACKAGER_WATCH_START)
      logger.clear()
      try {
        const modifiedFiles = compiler.modifiedFiles
        // 当发生变化的文件是 app.json，且 list 列表有增/删时，更新入口文件
        // TODO 页面减少时不会移除 entry
        // https://stackoverflow.com/a/39401288/1087831
        if (modifiedFiles && modifiedFiles.has(this.manifestFile)) {
          /** @readonly */
          const manifest = readJson(this.manifestFile)
          const entries = resolveEntries(manifest, this.root, this.appRoot)
          const newList = Object.keys(entries)
          if (this.hasChanged(newList)) {
            // 增删页面要修改 webpack entries
            this.list = newList
            compiler.options.entry = entries
          }
        }
      } catch (err) {
        // 需要将错误显示出来，watch时修改才有显示
        colorconsole.error(err.message)
        logger.add(err.message)
      }
      callback()
    })
  }
}
