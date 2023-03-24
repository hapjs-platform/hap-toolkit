/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import chromeLauncher from 'chrome-simple-launcher'
import * as Sentry from '@sentry/node'

const DSN = `https://4cdd368e441d464b87ac1a83d4d7ae12@sentry.quickapp.cn/2`
Sentry.init({ dsn: DSN })

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
  h_ins_url: 'HAP_DEBUG_INSPECTOR_URL'
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
