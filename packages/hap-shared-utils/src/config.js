/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import { homedir } from 'os'

// 用户home目录
const home = homedir()
const clientRecordPath = path.join(home, 'hap-toolkit-client-records.json')
export default {
  projectPath: process.cwd(),
  clientRecordPath,
  sourceRoot: './src', // 源码根目录
  signRoot: './sign', // 证书签名路径
  releasePath: './dist', // 快应用包目录
  outputPath: './build', // 输出目录,
  dataCoverage: './.nyc_output', // 项目运行的代码覆盖率数据
  command: 'build',
  server: { port: 8000 },
  // 代码风格规则
  isSmartMode: false,
  // 记录 watch 模式下哪些 .ux 文件对应的 .js 文件改变了
  changedJS: {},
  signOnLineConfig: {
    signOnLine: ''
  }
}
