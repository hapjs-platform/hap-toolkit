/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from '@jayfate/path'
import util from 'util'
import { renderString } from '@hap-toolkit/shared-utils'

// ansi 颜色值匹配正则
// eslint-disable-next-line
const ANSI_COLOR = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

const read = util.promisify(fs.readFile)

export async function renderPage(tpl, data) {
  const html = await read(tpl, 'utf8')
  return renderString(html, data)
}

// 去除头尾的/ (/preview//page/ => preview/page) 作为 routes 的标识
export function trimSlash(requestPath) {
  return path
    .normalize(requestPath)
    .replace(/\\/g, '/')
    .replace(/(^\/+|\/+$)/g, '')
}

/**
 * 移除字符串里的 ansi 颜色值字符
 *
 * @param {String} str - 字符串
 * @returns {String} str - 新字符串
 */
export function removeAnsiColor(str) {
  if (str && typeof str === 'string') {
    return str.replace(ANSI_COLOR, '')
  }
  return str
}
