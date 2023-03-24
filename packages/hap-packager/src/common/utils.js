/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from '@jayfate/path'
import crypto from 'crypto'

import { colorconsole } from '@hap-toolkit/shared-utils'

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
 * 判断对象是否为空（没有任何属性）
 * @param e
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
  if (!obj) {
    return !0
  }
  /* eslint-disable no-unused-vars */
  for (const t in obj) {
    return !1
  }
  /* eslint-enable no-unused-vars */
  return !0
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
 * 可序列化包含函数的的数据
 * JSON.stringify 不能直接对函数进行序列化
 * 序列化结果的函数两侧不会带有双引号
 *
 * 如:
 * serialize({
 *  func: function foo () {
 *
 *  }
 * }, 2)
 * =>
 * // 字符串
 * {
 *   "func": function foo () {
 *
 *   }
 * }
 * 参考 [Yahoo][1] 的实现，但解决了“碰撞”问题
 *
 * [1]: https://github.com/yahoo/serialize-javascript/blob/master/index.js
 *
 * @param {*} target - 转换对象
 * @param {Number | String} [space] - JSON.stringify 的第三个参数
 * @returns {String}
 */
export function serialize(target, space) {
  const type = typeof target
  if (type === 'undefined') {
    return target
  }
  if (type === 'function') {
    return target.toString()
  }
  // 用于保存出现的函数
  const functions = []
  // 函数在上面数组中的序号(index)
  let id = -1

  /*
   * 1, 生成一个用户数据中不会出现的占位符，标记函数出现的位置
   * 先将数据做简单序列化（函数的 key 也会计入检查），用于检查占位符，
   * 确保不会出现“碰撞” （用户数据中正好包含占位符）
   */
  let PLACEHOLDER = `__FKS_${Math.random().toString(16).slice(2, 10)}_FKE__`
  const origin = JSON.stringify(target, (key, value) => (typeof value === 'function' ? '' : value))
  while (origin.indexOf(PLACEHOLDER) > -1) {
    PLACEHOLDER = `_${PLACEHOLDER}_`
  }

  /*
   * 2, 使用 JSON.stringify 做初步的序列化
   * 保存出现的 function，并用占位符暂时替代
   */
  let code = JSON.stringify(
    target,
    function (key, value) {
      if (typeof value === 'function') {
        functions.push(value)
        id++
        return PLACEHOLDER + id // 每个函数对应的占位符
      }
      return value
    },
    space
  )

  /*
   * 3, 将 functions 中保存的函数转成字符串，替换对应占位符（包括双引号）
   */
  const PLACEHOLDER_RE = new RegExp(`"${PLACEHOLDER}(\\d+)"`, 'g')
  code = code.replace(PLACEHOLDER_RE, (_, id) => functions[id].toString())

  return code
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
    loader: require.resolve('../loaders/module-loader')
  })
  // 用来判断manifest.json内是否存在上面传入的@service或者@system的feature
  rule.use.push({
    loader: require.resolve('../loaders/manifest-loader'),
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
 * ux文件的类型
 */
export const ENTRY_TYPE = {
  APP: 'app',
  PAGE: 'page',
  COMP: 'comp',
  CARD: 'card',
  JS: 'js'
}

/**
 * 片段的类型
 */
export const FRAG_TYPE = {
  IMPORT: 'import',
  TEMPLATE: 'template',
  STYLE: 'style',
  SCRIPT: 'script'
}

/**
 * 获取 SHA256 摘要
 * @param {Buffer} buffer - buffer
 * @string {String<hex-string>} - hash 值
 */
export function calcDataDigest(buffer) {
  const hash = crypto.createHash('SHA256')
  hash.update(buffer)
  return hash.digest()
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
  } else {
    colorconsole.error(`manifest.json 中未配置入口页面 router.entry`)
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
