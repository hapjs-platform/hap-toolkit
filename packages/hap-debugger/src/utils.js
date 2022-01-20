/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import chromeLauncher from 'chrome-simple-launcher'

/**
 * 开启一个chrome进程
 */
export function startChrome(url, options) {
  return chromeLauncher.launch(url, {
    chromePath: options.chromePath
  })
}
