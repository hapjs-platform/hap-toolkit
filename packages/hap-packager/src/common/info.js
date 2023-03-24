/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from '@jayfate/path'
import { readJson } from '@hap-toolkit/shared-utils'

export const name = {
  // 支持的后缀名列表
  extList: ['.mix', '.ux', '.ts'],
  // 富文本支持的类型
  richtextType: ['mix', 'ux']
}

/**
 * 根据不带后缀名的脚本路径查找
 * @param scriptFilePath
 * @return {string}
 */
export function resolveFile(scriptFilePath) {
  for (let i = 0; i < name.extList.length; i++) {
    const pathWithSuffix = `${scriptFilePath}${name.extList[i]}`
    if (fs.existsSync(pathWithSuffix)) {
      return pathWithSuffix
    }
  }
}

/**
 * 获取抽取公共JS时的所有入口文件，包括：app/page，不包括chunk；
 * @param entry {object} webpack中定义的entry设置
 * @return {array}
 */
export function getEntryFiles(entry) {
  const entryFiles = Object.keys(entry || {}).map((file) => {
    return file + '.js'
  })
  return entryFiles
}

/**
 * 获取骨架屏配置信息
 * @param {String} src - 项目src路径
 * @return {Object} json | null
 */
export function getSkeletonConfig(src) {
  let config = null
  const skConfigFile = path.join(src, 'skeleton/config.json')
  if (fs.existsSync(skConfigFile)) {
    config = readJson(skConfigFile)
  }
  return config
}
