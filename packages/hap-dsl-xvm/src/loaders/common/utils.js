/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import loaderUtils from 'loader-utils'
import hash from 'hash-sum'
import { SourceMapGenerator, SourceMapConsumer } from 'source-map'
import globalConfig from '@hap-toolkit/shared-utils/config'

/**
 * 从文件路径中获取最后一部分（文件名(不包含扩展名)或目录名）
 * @param resourcePath
 * @returns {XML|void|string|*}
 */
export function getNameByPath(resourcePath) {
  return path.basename(resourcePath).replace(/\..*$/, '')
}

/**
 * 生成带hash的文件名（'./filename?xxxxxxxxxx）,hash由文件内容生成
 * @param resourcePath
 * @param content
 * @returns {string}
 */
export function getFileNameWithHash(resourcePath, content) {
  const filename = path.relative('.', resourcePath)
  const cacheKey = hash(filename + content)
  return `./${filename}?${cacheKey}`
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
 * 生成require代码
 * @param loaderContext
 * @param loader
 * @param filepath
 * @returns {string}
 */
export function makeRequireString(loaderContext, loader, filepath) {
  print({
    loader: loader,
    filepath: filepath
  })

  // 如果有loader则拼接请求请求字符串，否则直接使用原始文件名
  return (
    'require(' +
    loaderUtils.stringifyRequest(loaderContext, loader ? `!${loader}!${filepath}` : `${filepath}`) +
    ')\n'
  )
}

/**
 * 生成Loader请求字符串：loader?query!loader?query
 * @param loaders
 */
export function stringifyLoaders(loaders) {
  return loaders
    .map((loader) => {
      if (typeof loader === 'string') {
        // 如果已经是字符串，则不用转换
        return loader
      } else {
        const name = loader.name // 加载器名称
        const query = []
        if (loader.query) {
          // 处理query字段
          for (const k in loader.query) {
            const v = loader.query[k]
            if (v != null) {
              if (v === true) {
                query.push(k)
              } else {
                if (v instanceof Array) {
                  query.push(`${k}[]=${v.join(',')}`)
                } else {
                  query.push(`${k}=${v}`)
                }
              }
            }
          }
        }
        return `${name}${query.length ? '?' + query.join('&') : ''}`
      }
    })
    .join('!')
}

/**
 *
 * @param loader
 * @param source
 * @param iterator
 * @returns {*}
 */
export function generateMap(loader, source, iterator) {
  const filePath = loader.resourcePath

  const fileNameWithHash = getFileNameWithHash(filePath)
  const sourceRoot = path.resolve('.')

  const map = new SourceMapGenerator({
    sourceRoot,
    skipValidation: true
  })
  map.setSourceContent(fileNameWithHash, source)

  for (const { original, generated } of iterator) {
    map.addMapping({
      source: fileNameWithHash,
      original,
      generated
    })
  }

  return map
}

/**
 *
 * @param loader
 * @param target
 * @param map
 * @returns {{source: *, original: Array, generated: Array, mapping: {}, sourcesContent}}
 */
export function consumeMap(loader, target, map) {
  const smc = new SourceMapConsumer(map)
  let source
  const original = []
  const generated = []
  const mapping = {}

  splitSourceLine(target).forEach((input, line) => {
    const column = 0
    line = line + 1

    const pos = smc.originalPositionFor({
      line,
      column
    })

    if (pos.source) {
      source = pos.source
      original.push({
        line: pos.line,
        column: pos.column
      })
      generated.push({
        line,
        column
      })
      mapping[`line-${line}-column-${column}`] = {
        line: pos.line,
        column: pos.column
      }
    }
  })

  return {
    source,
    original,
    generated,
    mapping,
    sourcesContent: smc.sourcesContent
  }
}

/**
 * 根据回车换行分割源代码
 * @type {RegExp}
 */
const REGEXP_LINE = /\r?\n/g // 回车换行
export function splitSourceLine(source) {
  return source.split(REGEXP_LINE)
}

/**
 * 打印日志
 * @param str
 */
const showLog = false
export function print(log) {
  if (showLog) {
    let str = ''
    if (typeof log === 'string') {
      str = '######### ' + log + ' #########'
    } else {
      for (const i in log) {
        str += '######### ' + i + ' : ' + log[i] + ' #########\n'
      }
    }
    console.log(str)
  }
}

/**
 * 获取webpack的配置对象
 * @desc options参数虽不推荐使用，亦可以使用其它方式
 * @param loader
 */
export function getWebpackOptions(loader) {
  return loader.options || {}
}

/**
 * 是否需要渲染
 * @param type
 * @returns {boolean}
 */
export function isUXRender(type) {
  return type === ENTRY_TYPE.PAGE || type === ENTRY_TYPE.CARD
}

/**
 * 将路径转回绝对路径，例如：
 * src下的资源：/page/a.png => /<project-root>/src/page/a.png
 * node_modules下的资源：/node_modules/module/b.png => /<project-root>/node_modules/module/b.png
 * @param {string} filePath - 路径
 * @returns {string} - 文件绝对路径
 */
export function convertPath(filePath) {
  let pathBase = path.join(globalConfig.projectPath, 'src')
  // 需考虑 windows 下的路径反斜杆
  if (/^[/\\]node_modules/.test(filePath)) {
    pathBase = globalConfig.projectPath
  }
  return process.platform === 'win32'
    ? path.join(pathBase, filePath).replace(/\//g, '\\')
    : path.join(pathBase, filePath)
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
