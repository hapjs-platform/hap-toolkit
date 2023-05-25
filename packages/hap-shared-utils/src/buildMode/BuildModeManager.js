/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import { readJson } from '../index'
import { initProjectConfig, CONFIG_FILE } from './util'
import { eventBus } from '../event-bus'

const { PACKAGER_BUILD_DONE } = eventBus
/**
 * 编译模式管理器
 * @constructor
 * @example
 * const { BuildModeManager } = require('@hap-toolkit/shared-utils/lib/BuildModeManager')
 * const bmm = new BuildModeManager(root)
 * const modeOptions = bmm.getConfig()               // {current: 0, list: [{}]}
 * bmm.addMode({name, pathName, query, scene})       // {current: 1, list: [{name, pathName, query, scene}]}
 * bmm.update({id: 1, name, pathName, query, scene}) // 更新 id=1 的编译模式
 * bmm.delete(1)                                     // 删除 id=1 的编译模式
 *
 * @param {String} [root] - 项目根目录。可通过 {@link BuildModeManager#setRoot} 重设
 */

function BuildModeManager(root) {
  initProjectConfig(root)
  this.setRoot(root)
}

/**
 * 读取配置
 * @private
 * @returns {ProjectConfig}
 */
BuildModeManager.prototype._read = function () {
  let config = {}
  try {
    config = readJson(this._configFile)
  } catch (err) {
    console.log(err.code === 'ENOENT' ? err.message : err)
    // ignore
  }
  if (!config.modeOptions) {
    config.modeOptions = {
      current: -1,
      list: []
    }
  }
  const modeOptions = config.modeOptions
  modeOptions.list = modeOptions.list.filter((m) => m.id !== null && m.id !== -1)
  return config
}

/**
 * 写入文件，会移除无效 id 和 重复 id
 *
 * @private
 * @param {Object} config - 项目配置参数
 */
BuildModeManager.prototype._write = function (config) {
  const modeOptions = config.modeOptions
  //  -1 为“普通模式”
  modeOptions.list = modeOptions.list
    .filter((m) => m.id !== null && m.id !== -1)
    .reduce((modes, mode) => {
      if (!modes.find((m) => m.id === mode.id)) {
        modes.push(mode)
      }
      return modes
    }, [])
  if (this._configFile) {
    fs.writeFileSync(this._configFile, JSON.stringify(config, null, 2))
  }
}

/**
 * 获取编译模式配置
 *
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.getConfig = function () {
  const config = this._read()
  return config.modeOptions
}

/**
 * 获取应用的所有页面
 *
 * @returns {Array<String>}
 */
BuildModeManager.prototype.getAllPages = function () {
  if (!this.root) {
    return []
  }
  const manifestPath = path.join(this.root, 'src/manifest.json')
  try {
    const manifest = readJson(manifestPath)
    const routerPages = manifest.router.pages || {}
    const pages = Object.keys(routerPages)
    return pages
  } catch (err) {
    console.log(err.code === 'ENOENT' ? err.message : err)
    return []
  }
}

/**
 * 获取应用的所有卡片
 *
 * @returns {Array<String>}
 */
BuildModeManager.prototype.getAllCards = function () {
  if (!this.root) {
    return []
  }
  const manifestPath = path.join(this.root, 'src/manifest.json')
  try {
    const manifest = readJson(manifestPath)
    const routerWidgets = manifest.router.widgets || {}
    const widgets = Object.keys(routerWidgets)
    return widgets
  } catch (err) {
    console.log(err.code === 'ENOENT' ? err.message : err)
    return []
  }
}

/**
 * 添加编译模式
 *
 * @private
 * @param {Object} config - 项目配置信息
 * @param {Object} mode - 自定义编译模式条件参数
 * @param {String} mode.name - 名称
 * @param {String} mode.pathName - 启动页面
 * @param {String} [mode.query] - 启动参数
 * @param {String|null} [mode.scene] - 场景值
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype._addMode = function (config, mode, lazy) {
  const modeOptions = config.modeOptions

  let nextId
  if (modeOptions.list.length) {
    nextId =
      Math.max.apply(
        null,
        modeOptions.list.map((m) => m.id)
      ) + 1
  } else {
    nextId = 0
  }
  mode.id = nextId
  modeOptions.list.push(mode)
  modeOptions.current = mode.id
  if (!lazy) {
    this._write(config)
  }
  return modeOptions
}

/**
 * 添加编译模式
 *
 * @param {Object} mode - 自定义编译模式条件参数
 * @param {String} mode.name - 名称
 * @param {String} mode.pathName - 启动页面
 * @param {String} [mode.query] - 启动参数
 * @param {String|null} [mode.scene] - 场景值
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.addMode = function (mode) {
  const config = this._read()
  return this._addMode(config, mode, false)
}

/**
 * 添加多个编译模式
 *
 * @param {Array<Object>} modes - 待添加的编译模式列表
 * @param {String} modes[].name - 名称
 * @param {String} modes[].pathName - 启动页面
 * @param {String} [modes[].query] - 启动参数
 * @param {String|null} [modes[].scene] - 场景值
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.addModes = function (modes) {
  const config = this._read()
  const current = config.modeOptions.current
  modes.forEach((mode) => {
    this._addMode(config, mode, true)
  })
  config.modeOptions.current = current
  this._write(config)
  return config.modeOptions
}

/**
 * 删除 id={id} 的编译模式
 *
 * @param {Number} id - 编译模式 id
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.delete = function (id) {
  const config = this._read()
  const modeOptions = config.modeOptions
  const index = modeOptions.list.findIndex((m) => m.id === id)
  modeOptions.current = -1
  if (index !== -1) {
    modeOptions.list.splice(index, 1)
    this._write(config)
  }
  return modeOptions
}

/**
 * 删除多个编译模式
 */
BuildModeManager.prototype.deleteModes = function (modes) {
  const config = this._read()
  const modeOptions = config.modeOptions
  const current = modeOptions.current

  const list = modeOptions.list.filter((mode) => {
    const hasSameMode = modes.find((deleteMode) => deleteMode.id === mode.id)
    return !hasSameMode
  })

  if (modeOptions.list.length !== list.length) {
    const hasCurrent = list.find((mode) => mode.id === current)
    modeOptions.list = list
    if (!hasCurrent) {
      modeOptions.current = -1
    }
    this._write(config)
  }

  return modeOptions
}

/**
 * 更新编译模式
 *
 * @param {Object} mode - 编译模式参数
 * @param {Number} mode.id - 目标模式 id
 * @param {String} mode.name - 名称
 * @param {String} mode.pathName - 启动页面
 * @param {String} [mode.query] - 启动参数
 * @param {String|null} [mode.scene] - 场景值
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.update = function (mode) {
  const config = this._read()
  const modeOptions = config.modeOptions
  const index = modeOptions.list.findIndex((m) => m.id === mode.id)
  if (index !== -1) {
    modeOptions.list[index] = mode
  }
  this._write(config)
  return modeOptions
}

/**
 * 选择编译模式
 * @param {Number} id - 目标编译模式 id
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.select = function (id) {
  const config = this._read()
  const modeOptions = config.modeOptions
  const index = modeOptions.list.findIndex((m) => m.id === id)
  if (index !== -1) {
    modeOptions.current = id
    this._write(config)
    eventBus.emit(PACKAGER_BUILD_DONE)
  }
  return modeOptions
}

/**
 * 设置为普通编译模式
 * @returns {BuildModeOptions} 当前编译模式配置
 */
BuildModeManager.prototype.setToNormal = function () {
  const config = this._read()
  const modeOptions = config.modeOptions
  modeOptions.current = -1
  this._write(config)
  eventBus.emit(PACKAGER_BUILD_DONE)
  return modeOptions
}

/**
 * 重新设置根目录，便于在多个项目间切换
 * 主要用于内部开发
 *
 * @param {String} [root] - 根目录
 * @returns {BuildModeOptions|null} 当前编译模式配置
 */
BuildModeManager.prototype.setRoot = function (root) {
  if (typeof root === 'string') {
    this.root = root
    this._configFile = path.resolve(root, CONFIG_FILE)
    const config = this._read()
    return config.modeOptions
  }
  return null
}

export default BuildModeManager

/**
 * @typedef BuildModeOptions
 * @desc 编译模式配置信息
 * @property {Number} current - 当前编译模式的 id， -1 表示默认`普通编译`
 * @property {Array<Object>} list - 编译模式列表
 * @property {Number} list[].current - 编译模式 id
 * @property {String} list[].id - 编译模式 id
 * @property {String} list[].name - 编译模式名称
 * @property {String} list[].pathName - 编译模式启动页面
 * @property {String} list[].query - 编译模式启动参数
 * @property {Number} list[].scene - 编译模式进入场景
 */
