/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import fs from 'fs'
import { colorconsole, readJson, logger, eventBus } from '@hap-toolkit/shared-utils'
import { resolveEntries } from '../utils'

const { PACKAGER_WATCH_START } = eventBus

function sort(list) {
  return list.sort((a, b) => a.localeCompare(b))
}

export default class ManifestWatchPlugin {
  /**
   * @param {Object} options - 配置参数
   * @param {String} options.root - 应用根目录
   */
  constructor(options) {
    this.appRoot = options.appRoot
    this.root = options.root
    this.buildDir = options.buildDir
    this.entryState = options.entryState
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

  getRemovedEntries(newList) {
    const newSet = new Set(newList)
    return this.list.filter((key) => !newSet.has(key))
  }

  updateEntries(entries) {
    const newList = sort(Object.keys(entries))
    const removedEntries = this.getRemovedEntries(newList)
    const changed = JSON.stringify(newList) !== JSON.stringify(this.list)
    if (changed) {
      this.list = newList
      this.entryState && (this.entryState.current = entries)
    }
    return {
      changed,
      removedEntries
    }
  }

  removeBuildArtifacts(entryKeys) {
    if (!this.buildDir || !entryKeys || entryKeys.length === 0) {
      return
    }
    entryKeys.forEach((entryKey) => {
      const entryDir = path.dirname(entryKey)
      if (entryDir && entryDir !== '.') {
        const targetDir = path.join(this.buildDir, entryDir)
        if (fs.existsSync(targetDir)) {
          fs.rmSync(targetDir, { recursive: true, force: true })
          this.removeEmptyParentDirs(path.dirname(targetDir))
        }
        return
      }

      ;[
        `${entryKey}.js`,
        `${entryKey}.js.map`,
        `${entryKey}.css.json`,
        `${entryKey}.template.json`
      ].forEach((relativeFile) => {
        const targetFile = path.join(this.buildDir, relativeFile)
        if (!fs.existsSync(targetFile)) {
          return
        }
        fs.unlinkSync(targetFile)
        this.removeEmptyParentDirs(path.dirname(targetFile))
      })
    })
  }

  removeEmptyParentDirs(dir) {
    while (dir && dir.startsWith(this.buildDir) && dir !== this.buildDir) {
      if (!fs.existsSync(dir) || fs.readdirSync(dir).length > 0) {
        return
      }
      fs.rmdirSync(dir)
      dir = path.dirname(dir)
    }
  }

  apply(compiler) {
    compiler.hooks.watchRun.tapAsync('watch', (compiler, callback) => {
      eventBus.emit(PACKAGER_WATCH_START)
      logger.clear()
      try {
        const modifiedFiles = compiler.modifiedFiles
        // 当发生变化的文件是 manifest.json，且入口列表有增删时，更新当前编译入口
        if (modifiedFiles && modifiedFiles.has(this.manifestFile)) {
          /** @readonly */
          const manifest = readJson(this.manifestFile)
          const entries = resolveEntries(manifest, this.root, this.appRoot)
          const { changed, removedEntries } = this.updateEntries(entries)
          if (changed) {
            this.removeBuildArtifacts(removedEntries)
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
