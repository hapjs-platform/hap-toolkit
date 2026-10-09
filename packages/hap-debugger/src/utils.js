/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import chromeLauncher from 'chrome-simple-launcher'
import * as Sentry from '@sentry/node'

const DSN = `https://4cdd368e441d464b87ac1a83d4d7ae12@sentry.quickapp.cn/2`
const isTestEnv = !!process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'test'
if (!isTestEnv) {
  Sentry.init({ dsn: DSN })
}

/**
 * 开启一个chrome进程
 */
export function startChrome(url, options) {
  return chromeLauncher.launch(url, {
    chromePath: options.chromePath,
    traceId: process.env['TRACE_ID']
  })
}

/**
 * 事件别名，避免字符串过长影响主干代码阅读
 */
export const eventAlias = {
  h_re_std: 'HAP_DEBUG_REVEIVE_POSTSTD',
  h_forward_err: 'HAP_DEBUG_ADBFORWARD_ERR',
  h_ins_url: 'HAP_DEBUG_INSPECTOR_URL',
  h_ide: 'HAP_DEBUG_IDE'
}

/**
 * Sentry上报
 * @param {string} message 事件ID
 * @param  {...any} tags 标签对
 */
export function trackDebug(message, ...tags) {
  Sentry.withScope(function (scope) {
    scope.clear()
    Sentry.setTags(
      Object.assign(tags[0] || {}, { TRACE_ID: process.env['TRACE_ID'], USER: process.env['USER'] })
    )
    Sentry.captureMessage(message)
  })
}

/**
 * 判断toolkit在哪个编辑器编译工程
 * @returns {string} 'vscode' | 'quickapp-ide' | 'cursor' | 'jetbrains' | 'terminal' | 'iterm' | 'other'
 */
export function getIDE(options = {}) {
  const env = process.env
  if (options.originType === 'quickapp-ide' || env.TERM_PROGRAM === 'quick-app-ide') {
    return 'quickapp-ide'
  }
  // 使用环境变量判断是在cursor里面打开的
  if (
    (env.VSCODE_GIT_ASKPASS_NODE && env.VSCODE_GIT_ASKPASS_NODE.toLowerCase().includes('cursor')) ||
    Object.keys(env).some((k) => k.startsWith('CURSOR_') && k !== '__CURSOR_SANDBOX_ENV_RESTORE')
  ) {
    return 'cursor'
  }
  // VS Code / 多数 VS Code 系编辑器
  if (env.TERM_PROGRAM === 'vscode') {
    return 'vscode'
  }
  // JetBrains（WebStorm / IDEA 等）
  if (env.TERMINAL_EMULATOR === 'JetBrains-JediTerm' || env.JETBRAINS_IDE) {
    return 'jetbrains'
  }
  // 部分终端会带这个
  if (env.TERM_PROGRAM === 'Apple_Terminal') return 'terminal'
  if (env.TERM_PROGRAM === 'iTerm.app') return 'iterm'
  return 'other'
}
export function trackIDE(options) {
  // 单元测试环境不上报，避免 Sentry 网络请求拖慢/干扰测试
  if (isTestEnv) {
    return
  }
  const ide = getIDE(options)
  trackDebug(eventAlias.h_ide, { IDE: ide })
}
