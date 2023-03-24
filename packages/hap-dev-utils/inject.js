/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @file
 * 注入进程的模块
 */

/**
 * 简单的内存分析工具
 * 定时记录内存占用
 * TODO: 将数据评论到 MR 中
 */
function profile() {
  if (!/\bhap$/.test(process.argv[1])) {
    console.warn('非 hap 进程，不进行 profile', process.argv.join(' '))
    return
  }

  const heapRecords = [getHeapUsed()]
  setInterval(() => {
    heapRecords.push(getHeapUsed())
  }, 500).unref()

  process.on('exit', () => {
    console.log('='.repeat(80))
    console.log('profile result:')
    console.log('cwd:', process.cwd())
    console.log('args:', process.argv.join(' '))
    const total = heapRecords.slice(1).reduce((acc, v) => acc + v, 0)
    console.log(
      'average heap used:',
      toMb(total / (heapRecords.length - 1)),
      "(initial record isn't counted)"
    )
    console.log('heap used records:', heapRecords.map(toMb).join(', '))
    console.log('heap used max:', toMb(Math.max.apply(null, heapRecords)))
    console.log('='.repeat(80))
  })
}

function toMb(size) {
  return (size / 1024 / 1024).toFixed(2) + 'MB'
}

function getHeapUsed() {
  return process.memoryUsage().heapUsed
}

profile()
