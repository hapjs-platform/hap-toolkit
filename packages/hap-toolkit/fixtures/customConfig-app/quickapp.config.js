/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

module.exports = {
  sourceRoot: './src1', // 源码根目录
  signRoot: './sign2', // 证书签名路径
  releasePath: './dist4', // 快应用包目录
  outputPath: './build3', // 输出目录
  server: { port: 12306 }
}

class PostHookTestPlugin {
  apply(compiler) {}
}

module.exports.postHook = function (webpackConf, compileOptionsObject) {
  webpackConf && webpackConf.plugins.push(new PostHookTestPlugin())
}
