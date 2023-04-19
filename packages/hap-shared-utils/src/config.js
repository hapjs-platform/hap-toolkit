/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
// 用户home目录
const home = require('os').homedir()
const clientRecordPath = path.join(home, 'hap-toolkit-client-records.json')
module.exports = {
  projectPath: process.cwd(),
  clientRecordPath,
  sourceRoot: './src', // 源码根目录
  signRoot: './sign', // 证书签名路径
  releasePath: './dist', // 快应用包目录
  outputPath: './build', // 输出目录,
  dataCoverage: './.nyc_output', // 项目运行的代码覆盖率数据
  server: { port: 8000 }
}
