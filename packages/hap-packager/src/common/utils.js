/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import { sync as resolveSync } from 'resolve'

/**
 * 获取要使用 babel.config.js 的路径
 * @param {string} cwd - 项目地址
 * @returns {string} babel.config.js 地址
 */
export function getBabelConfigJsPath(cwd, useTreeShaking) {
  let babelconfigPath = path.join(cwd, 'babel.config.js')
  if (fs.existsSync(babelconfigPath)) {
    return babelconfigPath
  }
  babelconfigPath = path.resolve(
    __dirname,
    useTreeShaking ? '../../babel.tree.config.js' : '../../babel.config.js'
  )
  return babelconfigPath
}

/**
 * 转换为相对路径
 * @param filepath
 * @returns {*}
 */
export function getFilenameByPath(filepath) {
  return path.relative('.', filepath)
}

/**
 * 匹配数组中的元素，用于寻找目标元素的位置
 *
 * @param {String|RegExp} pattern
 * @returns {Number|undefined}
 */
function predicate(pattern) {
  // f1, f2 will be bound to this
  if (typeof pattern === 'string') {
    return pattern === this.toString()
  } else {
    // RegExp
    return this.match(pattern)
  }
}
/**
 * 根据给定的优先级列表，对文件列表进行排序
 * NOTE 会修改数组本身
 *
 * @param {Array<String>} files - 文件列表
 * @param {Array<String|RegExp>} priorities - 优先级参考列表，可以使用正则表达式
 * @returns {Array<String>} - 排列后的文件列表
 */
export function sortFilesBy(files, priorities) {
  // 用于赋值未匹配到的数值
  const MAX = files.length
  files = files.sort((f1, f2) => {
    // 对比位于 priorities 中的位置，得出优先关系
    let idx1 = priorities.findIndex(predicate, f1)
    let idx2 = priorities.findIndex(predicate, f2)
    idx1 = idx1 === -1 ? MAX : idx1
    idx2 = idx2 === -1 ? MAX : idx2
    return idx1 - idx2
  })
  return files
}

/**
 * 遍历所有子目录，列出文件
 *
 * @param {String} cwd - 目标目录
 * @param [filesys] - 文件系统，允许 memory-fs
 * @returns {Files} - 基于 cwd 的文件列表
 */
export function lsdirdeep(cwd, filesys = fs) {
  // 递归函数
  function lsdir(cwd, dir, filesys) {
    let files = []
    const directory = path.posix.join(cwd, dir)
    const rawFiles = filesys.readdirSync(directory)
    rawFiles.forEach((file) => {
      const filepath = path.posix.join(directory, file)
      const relatpath = path.posix.join(dir, file)
      const stat = filesys.statSync(filepath)
      if (stat.isFile()) {
        files.push(relatpath)
      } else {
        files = files.concat(lsdir(cwd, relatpath, filesys))
      }
    })
    return files
  }
  return lsdir(cwd, '.', filesys)
}

/**
 * 包装webpack loader
 * @param {string} pathSrc 项目src
 * @param {Object} rule loader规则
 */
export function loaderWrapper(pathSrc, rule) {
  if (!Array.isArray(rule.use)) {
    rule.use = [rule.use]
  }
  // 这个loader是用来解析@system或者@service等feature的
  rule.use.unshift({
    loader: resolveSync('../loaders/module-loader')
  })
  // 用来判断manifest.json内是否存在上面传入的@service或者@system的feature
  rule.use.push({
    loader: resolveSync('../loaders/manifest-loader'),
    options: {
      path: pathSrc
    }
  })
}

/**
 * 判断是否为对象
 */
const toString = Object.prototype.toString
const OBJECT_STRING = '[object Object]'
export function isPlainObject(obj) {
  return toString.call(obj) === OBJECT_STRING
}

/**
 * 获取入口页面所需的骨架屏文件
 * @param {Object} skeletonConf - 骨架屏配置
 * @param {String} entry - 入口页面
 * @returns {[Array<RegExp>, Object]} - 骨架屏文件
 */
function getEntrySkeleton(skeletonConf, entry) {
  if (!skeletonConf) {
    return []
  }

  const { singleMap, anchorMaps } = skeletonConf
  let skFiles = []
  // 检查一对一情况
  const page = Object.keys(singleMap || {}).find((page) => {
    return page === entry
  })
  if (page) {
    skFiles.push(singleMap[page])
  }
  // 检查一对多情况，假设多个相同，也只返回第一个
  const anchorMap = Array.from(anchorMaps || []).find((item) => {
    return item.page === entry
  })
  if (anchorMap) {
    skFiles = skFiles.concat(
      Object.keys(anchorMap.skeletonMap || {}).map((page) => {
        return anchorMap.skeletonMap[page]
      })
    )
  }

  skFiles = skFiles.map((f) => {
    return new RegExp(`skeleton/page/${f}$`)
  })
  return skFiles
}
/**
 * 根据 manifest 中的路由配置生成文件优先级
 * @param {Object} manifest - manifest对象
 * @param {Object} skeletonConf - skeleton配置对象
 * @returns {[Array<String|RegExp>, Object]} - 优先级列表
 */
export function genPriorities(manifest, skeletonConf) {
  // 文件的优先级
  const priorities = [
    /^i18n\/.+\.json$/i, // 多语言配置文件要在 manifest 之前
    // 多终端配置文件如manifest-tv.json，也要在manifest之前，不然流式加载初始化的时候，会读不到对应的终端配置文件
    /^manifest-\w+\.json$/,
    'manifest.json',
    'app.js',
    /page-chunks.json$/,
    /skeleton\/config\.json$/,
    // <--- 入口页面将会在这
    /^common\//i // 静态资源
  ]

  if (manifest && manifest.router && manifest.router.entry) {
    const entry = manifest.router.entry
    const entrySkFiles = getEntrySkeleton(skeletonConf, entry)
    priorities.splice(5, 0, ...entrySkFiles, new RegExp(`^${entry}/$`), new RegExp(`^${entry}/.+`))
  }
  return priorities
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}

/**
 * get the last loader path from request path
 * @param {*} reqPath request path in  'xxx/packages/hap-dsl-xvm/lib/loaders/script-loader.js!...!xxx/packages/hap-dsl-xvm/lib/loaders/fragment-loader.js?index=0&type=script!/projectRoot/src/card/index.ux?uxType=card'
 * @returns '/fragment-loader.js'
 */
export function getLastLoaderPath(reqPath) {
  if (!reqPath) {
    return null
  }
  reqPath = reqPath.replace(/\\/g, '/')
  const reqArr = reqPath.split('!')
  let lastLoader = reqArr.find((str) => str !== '') // inline loader reversed by '!'
  if (lastLoader && lastLoader.indexOf('?') > 0) {
    // remove params if exist
    lastLoader = lastLoader.split('?')[0]
  }
  if (lastLoader && lastLoader.lastIndexOf('/') !== -1) {
    return lastLoader.substring(lastLoader.lastIndexOf('/'))
  }
  return null
}
