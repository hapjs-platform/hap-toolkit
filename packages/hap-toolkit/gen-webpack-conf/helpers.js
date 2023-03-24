/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs-extra')
const path = require('@jayfate/path')
const builtinList = require('module').builtinModules
const globalConfig = require('@hap-toolkit/shared-utils/config')

const { readJson, colorconsole } = require('@hap-toolkit/shared-utils')

// 兼容配置文件
const configFileList = ['quickapp.config.js', 'hap.config.js']

/**
 * 获取配置文件路径
 * @param {String} cwd
 */
exports.getConfigPath = function getConfigPath(cwd) {
  let configPath = ''
  let index = 0
  do {
    configPath = path.resolve(cwd, configFileList[index])
    if (fs.existsSync(configPath)) break
    configPath = ''
  } while (++index < configFileList.length)
  return configPath
}

/**
 * 清理 BUILD_DIR DIST_DIR
 */
exports.cleanup = function cleanup(BUILD_DIR, DIST_DIR) {
  fs.emptyDirSync(BUILD_DIR)

  // 清空 dist 目录下的文件(仅文件)
  if (fs.existsSync(DIST_DIR)) {
    const zipfiles = fs.readdirSync(DIST_DIR)
    zipfiles.forEach(function (file) {
      const curPath = DIST_DIR + '/' + file
      if (fs.statSync(curPath).isFile()) {
        fs.unlinkSync(curPath)
      }
    })
  }
}

/**
 * 使用 node 原生模块给予警告
 */
exports.checkBuiltinModules = function checkBuiltinModules({ request }, callback) {
  const packageJson = require(path.join(globalConfig.projectPath, 'package.json'))
  // 提取 package.json 中的依赖
  let projectDependencies = []
  if (packageJson.devDependencies) {
    projectDependencies = Object.keys(packageJson.devDependencies)
  }
  if (packageJson.dependencies) {
    projectDependencies = projectDependencies.concat(Object.keys(packageJson.dependencies))
  }

  // 枚举 node 原生模块
  const enumList = [
    'assert',
    'console',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'constants',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'module',
    'net',
    'os',
    'path',
    'process',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'sys',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'vm',
    'zlib'
  ]
  const externalsList = Array.isArray(builtinList) ? builtinList : enumList
  // 确定是node原生模块，并且没有在package.json 中引用这个模块
  if (externalsList.indexOf(request) > -1 && projectDependencies.indexOf(request) === -1) {
    colorconsole.warn(
      `您当前使用了 ${request} 似乎是 node 原生模块, 快应用不是 node 环境不支持 node 原生模块`
    )
  }
  callback()
}

/**
 * 设置v8版本
 * @param {boolean} disableScriptV8V65
 */
exports.setAdaptForV8Version = function setAdaptForV8Version(disableScriptV8V65, manifest, cwd) {
  const packageJsonFile = path.resolve(cwd, 'package.json')
  const packageJson = readJson(packageJsonFile)
  const minPlatformVersion = parseInt(manifest.minPlatformVersion)
  if (fs.existsSync(packageJsonFile)) {
    if (!disableScriptV8V65 && minPlatformVersion >= 1040) {
      const hasDefinedChrome65 =
        packageJson.browserslist && packageJson.browserslist.includes('chrome 65')
      colorconsole.log(
        `当前minPlatformVersion >= 1040，平台采用v8版本为6.5+（对应chrome版本为65版+），工具将不再对V8 6.5版本支持的ES6代码进行转换`
      )
      if (hasDefinedChrome65) return
      // v8 6.5相当于chrome 65版本
      packageJson.browserslist = ['chrome 65']
      fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2))
    } else if (packageJson.browserslist) {
      delete packageJson.browserslist
      fs.writeFileSync(packageJsonFile, JSON.stringify(packageJson, null, 2))
    }
  }
}

/**
 * 简单检查是否有安装 Babel 相关依赖
 * @param {String} cwd - 项目路径
 */
exports.checkBabelModulesExists = function valiedateSitemap(cwd) {
  const babelconfigjs = path.join(cwd, 'babel.config.js')
  const babelModules = path.join(cwd, 'node_modules/@babel')
  if (fs.existsSync(babelconfigjs) && !fs.existsSync(babelModules)) {
    colorconsole.warn(`您使用了自定义 babel.config.js，请确认是否有安装相关依赖`)
  }
}
