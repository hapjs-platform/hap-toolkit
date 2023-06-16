/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// TODO duplicate of packager/src/common/utils.js
import fs from 'fs'
import path from 'path'
import { globalConfig } from '@hap-toolkit/shared-utils'

/**
 * 合并数组属性
 * @param dest
 * @param src
 */
export function merge(target, ...src) {
  if (src.length) {
    src.forEach((item) => {
      target = target.concat(item)
    })
  }
  return target
}

/**
 * -xxx-xxx转换为XxxXxx
 * @param value
 * @returns {void|string|XML|*}
 */
export function hyphenedToCamelCase(value) {
  return value.replace(/-([a-z])/g, function (s, m) {
    return m.toUpperCase()
  })
}

/**
 * XxxXxx转换为-xxx-xxx
 * @param value
 * @returns {void|string|XML|*}
 */
export function camelCaseToHyphened(value) {
  return value.replace(/([A-Z])/g, function (s, m) {
    return '-' + m.toLowerCase()
  })
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
 * 拆分上下左右类型简写属性
 * @param names   属性名数组
 * @param values  属性值数组
 * @returns {array}
 */
export function splitAttr(names, values) {
  const resultArray = []
  if (values) {
    names.forEach((n, idx) => {
      resultArray[idx] = {}
      resultArray[idx].n = n
    })

    switch (values.length) {
      case 1:
        names.forEach((n, idx) => {
          resultArray[idx].v = values[0]
        })
        break
      case 2:
        names.forEach((n, idx) => {
          if (idx % 2) {
            resultArray[idx].v = values[1]
          } else {
            resultArray[idx].v = values[0]
          }
        })
        break
      case 3:
        names.forEach((n, idx) => {
          if (idx % 2) {
            resultArray[idx].v = values[1]
          } else {
            resultArray[idx].v = values[idx]
          }
        })
        break
      default:
        names.forEach((n, idx) => {
          resultArray[idx].v = values[idx]
        })
    }
  }
  return resultArray
}

/**
 * 值的有效性检验
 * @param value  值
 */
export function isValidValue(value) {
  return typeof value === 'number' || typeof value === 'string'
}

/**
 * @param relativePath
 * @param filePath
 * @returns {*}
 * @desc 将文件相对路径转为项目根目录('src/')下的绝对路径
 */
export function resolvePath(relativePath, filePath) {
  if (filePath && !path.isAbsolute(relativePath)) {
    const absolutePath = path.join(path.dirname(filePath), relativePath)
    const relativeProjectPath = path.relative(
      path.resolve(globalConfig.projectPath, './src'),
      absolutePath
    )
    const newAbsolutePath = path.join('/', relativeProjectPath)
    // 兼容windows
    relativePath = newAbsolutePath.replace(/\\/g, '/')
  }
  return relativePath
}

/**
 * 判断文件是否存在
 * @param {string} resourcePath
 * @param {string} filePath
 * @returns {boolean}
 */
export function fileExists(resourcePath, filePath) {
  let absolutePath
  if (path.isAbsolute(resourcePath)) {
    const projectPath = globalConfig.projectPath
    absolutePath = path.join(projectPath, './src', resourcePath)
  } else {
    absolutePath = path.resolve(filePath, '../', resourcePath)
  }
  return fs.existsSync(absolutePath)
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
