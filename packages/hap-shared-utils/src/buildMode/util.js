/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import globalConfig from '../config'

export const CONFIG_FILE = '.quickapp.preview.json'

/**
 * 读取一份 json 内容
 *
 * @param {String} jsonpath - json 路径
 * @returns {Object} json
 */
export function readJson(jsonpath) {
  try {
    return JSON.parse(fs.readFileSync(jsonpath).toString())
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new SyntaxError(`解析 ${jsonpath} 失败, 格式错误`)
    } else if (err.message.startsWith('ENOENT:')) {
      err.message = `读取 ${jsonpath} 失败, 找不到该文件`
      throw err
    } else {
      console.error('读取 %s 失败', jsonpath)
      throw err
    }
  }
}

/**
 * 检测项目下 .quickapp.preview.json 文件（当前用于记录编译模式），无则新建
 *
 * @param {String} root - 项目路径
 */
export function initProjectConfig(root) {
  const proConfPath = path.join(root, CONFIG_FILE)
  if (!fs.existsSync(proConfPath)) {
    fs.writeFileSync(proConfPath, JSON.stringify({}, null, 2))
  }
}

/**
 * 获取当前编译模式的启动页面（带参数）
 *
 * @returns {String} page - 启动页面
 */
export function getLaunchPage() {
  let page = ''
  const proConfPath = path.join(globalConfig.projectPath, CONFIG_FILE)
  if (fs.existsSync(proConfPath)) {
    try {
      const { modeOptions } = readJson(proConfPath)
      if (modeOptions && typeof modeOptions.current === 'number' && modeOptions.list) {
        const mode = modeOptions.list.find((item) => {
          return item.id === modeOptions.current
        })
        if (mode) {
          page = `${mode.pathName}?${mode.query}`
        }
      }
    } catch (err) {
      console.log(err.code === 'ENOENT' ? err.message : err)
      // ignore
    }
  }
  return page
}
