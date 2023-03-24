/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const collectCoverage = process.argv.indexOf('--coverage') > -1
module.exports = {
  notify: true,
  collectCoverage,
  // 禁用 jest 注入 jsdom
  // (test/webpack.base.config.js#HandlerPlugin 会加入 window 的检查代码)
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: [
    'packages/*/*.js',
    'packages/*/lib/**/*.js',
    'packages/hap-toolkit/{lib,bin}/**/*.js',
    'packages/hap-toolkit/*/lib/**/*.js',
    'packages/hap-toolkit/gen-webpack-conf.js',
    '!packages/hap-toolkit/*.js',
    '!packages/hap-debugger/webpack.config.js',
    '!packages/hap-debugger/lib/client/**',
    '!packages/hap-server/lib/preview/static/**',
    '!packages/hap-packager/src/runtime/*'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/packages/hap-toolkit/packager/test/fixtures/',
    '__tests__/helpers',
    '__tests__/fixtures'
  ]
}
