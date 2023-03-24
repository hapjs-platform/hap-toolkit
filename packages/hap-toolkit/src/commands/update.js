/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs-extra'
import glob from 'glob'
import chalk from 'chalk'
import semver from 'semver'
import inquirer from 'inquirer'

import { getProjectDslName, mkdirsSync, relateCwd } from '@hap-toolkit/shared-utils'

import { formatDate } from './utils'

const curDir = process.cwd()
const packageInfo = require('../../package.json')

// DSL路径预先定义
const dslModuleXvmDir = path.dirname(require.resolve('@hap-toolkit/dsl-xvm/package.json'))
// const dslModuleVueDir = path.dirname(require.resolve('@hap-toolkit/dsl-vue/package.json'))
const dslModuleHash = {
  xvm: dslModuleXvmDir
  // vue: dslModuleVueDir
}

// 名称
let dslName
let dslModuleDir

// 检测工程版本
function checkVersion() {
  const result = {
    cur: '',
    toolkit: '',
    res: 0
  }
  let pkg
  const curpkgPath = path.join(curDir, 'package.json')
  if (fs.existsSync(curpkgPath)) {
    pkg = JSON.parse(fs.readFileSync(curpkgPath).toString())
    result.cur = (pkg.subversion && pkg.subversion.toolkit) || ''
  }
  if (result.cur === '') {
    result.res = 1
  }

  result.toolkit = packageInfo.version
  if (result.toolkit === '') {
    console.log(`### App Toolkit ### 当前toolkit的文件错误, 无法升级, 请重新安装后再升级`)
    result.res = -1
    return result
  }

  // 版本比较
  if (result.res !== 1) {
    result.res = semver.gt(result.toolkit, result.cur) ? 1 : 0
  }
  return result
}

/**
 * 更新属性
 * @param target
 * @param update
 */
function mergeProps(target, update) {
  if (!target) {
    return
  }
  for (const key in update) {
    if (!target[key] && !/babel-|^webpack$|^koa/.test(key)) {
      target[key] = update[key]
    }
  }
}

const dependencies = [
  'babel-cli',
  'babel-core',
  'babel-eslint',
  'babel-loader',
  'babel-plugin-syntax-jsx',
  'cross-env',
  'css-what',
  'koa',
  'koa-body',
  'koa-router',
  'koa-send',
  'koa-static',
  'socket.io',
  'style-loader',
  'webpack'
]
/**
 * 询问用户是否移除不再需要的依赖
 *
 * hap-toolkit>=0.1.0 将依赖整合到自身
 * koa koa-body webpack 等将不再是用户的直接依赖
 *
 * @param {Package} pkg - 项目信息对象
 * @param {Object} options
 * @param {Boolean} [options.force] - 是否强制更新，将移除所有开发依赖
 * @param {Boolean} [options.updateDeps] - 是否直接更新依赖
 * @param {Package} pkg - 模块信息
 * @returns {Promise<Package>}
 */

function cleanupDependencies(pkg, options) {
  if (options.force) {
    pkg.devDependencies = {}
    return Promise.resolve(pkg)
  }
  if (!pkg.devDependencies) {
    return Promise.resolve(pkg)
  }
  const deps = dependencies.filter((dep) => pkg.devDependencies[dep])
  if (!deps.length) {
    return Promise.resolve(pkg)
  }
  let promise = Promise.resolve(dependencies)
  if (!options.updateDeps) {
    promise = new Promise((resolve) => {
      const questions = [
        {
          type: 'confirm',
          name: 'toDelete',
          message: '检测到已包含在 hap-toolkit 中的模块依赖，现在将其移除',
          default: true
        },
        {
          type: 'checkbox',
          name: 'selectedDeps',
          message: '将移除以下选中的模块',
          choices: deps.map((dep) => ({ checked: true, name: dep })),
          pageSize: deps.length, // show all
          when: function (answers) {
            return answers.toDelete
          }
        }
      ]
      inquirer.prompt(questions).then((answers) => {
        resolve(answers.toDelete ? answers.selectedDeps : [])
      })
    })
  }
  return promise.then((selectedDeps) => {
    selectedDeps.forEach((dep) => {
      pkg.devDependencies[dep] = undefined
    })
    return pkg
  })
}

/**
 * 升级包配置文件
 *
 * @param {Object} options
 * @param {Boolean} [options.force] - 是否强制更新
 * @param {Boolean} [options.updateDeps] - 是否直接更新依赖
 * @returns {Promise<Package>}
 */
function upgradePackage(options) {
  console.log(chalk.green(`升级 package.json`))
  const curpkgPath = path.join(curDir, 'package.json')
  const curpkg = require(curpkgPath)
  const tplPkgInfo = require(path.resolve(dslModuleDir, 'templates/app/demo/package.json'))

  if (options.force) {
    tplPkgInfo.devDependencies = {}
  }
  // 更新版本号
  tplPkgInfo.devDependencies['hap-toolkit'] = packageInfo.version
  if (tplPkgInfo.subversion) {
    tplPkgInfo.subversion.toolkit = packageInfo.version
  }

  return cleanupDependencies(curpkg, options).then((cleanedPkg) => {
    for (const key in tplPkgInfo) {
      const item = tplPkgInfo[key]
      if (typeof item === 'string' && curpkg[key]) {
        tplPkgInfo[key] = cleanedPkg[key]
      } else {
        mergeProps(item, cleanedPkg[key])
      }
    }
    // 更新 json 文件
    fs.writeFileSync(curpkgPath, JSON.stringify(tplPkgInfo, null, 2))
  })
}

/**
 * 拷贝模板目录
 * @param dest 目标路径
 * @param src 源文件路径
 */
function copyFiles(dest, src) {
  // 遍历收集文件列表
  const pattern = path.join(src, '**/{*,.*}')
  const files = glob.sync(pattern)
  files.forEach((file) => {
    const relative = path.relative(src, file)
    const finalPath = path.join(dest, relative)
    // 覆盖原有文件
    console.log(chalk.green(`file ${relateCwd(finalPath)} copied.`))
    fs.copySync(file, finalPath)
  })
}

/**
 * 升级sign目录
 */
function upgradeSign() {
  console.log(chalk.green(`升级 签名文件`))
  const destPath = path.join(curDir, 'sign/debug')
  // 删除旧tools目录
  fs.removeSync(destPath)
  // 重新拷贝
  mkdirsSync(destPath)
  copyFiles(destPath, path.join(dslModuleDir, 'templates/app/demo/sign/debug'))
}

/**
 * 升级eslint
 */
function upgradeEslint() {
  // 复制eslint
  const fileNameEslint = '.eslintrc.json'
  const fileSrcEslint = path.join(dslModuleDir, 'templates/app/demo', fileNameEslint)
  const fileDstEslint = path.join(curDir, fileNameEslint)
  fs.copySync(fileSrcEslint, fileDstEslint)
}

/**
 * 更新babel.config.js文件
 */
function upgradeBabelConfig() {
  const babelConfig = 'babel.config.js'
  const babelrc = '.babelrc'
  const srcBabelConfig = path.join(dslModuleDir, 'templates/app/demo', babelConfig)
  const distBabelrc = path.join(curDir, babelrc)
  const distBabelConfig = path.join(curDir, babelConfig)
  const timeStamp = formatDate('yyyyMMdd_hhmmss', new Date())

  console.log(chalk.green(`项目升级到 babel7 ，默认配置使用 babel.config.js`))

  if (fs.existsSync(distBabelrc)) {
    const saveBabelrc = path.join(curDir, babelrc + '.old.' + timeStamp)
    fs.copySync(distBabelrc, saveBabelrc)
    fs.removeSync(distBabelrc)
    console.log(
      chalk.yellow(`### App Toolkit ### ${babelrc} 的备份文件保存为: ${relateCwd(saveBabelrc)}`)
    )
  }

  if (fs.existsSync(distBabelConfig)) {
    const saveFile = path.join(
      curDir,
      path.basename(babelConfig, '.js') + '.old.' + timeStamp + '.js'
    )
    fs.copySync(distBabelConfig, saveFile)
    console.log(
      chalk.yellow(
        `### App Toolkit ### 更新的 ${babelConfig} 的备份文件保存为: ${relateCwd(saveFile)}`
      )
    )
  }

  if (fs.existsSync(srcBabelConfig)) {
    fs.copySync(srcBabelConfig, distBabelConfig)
    console.log(chalk.yellow(`### App Toolkit ### 更新的 ${babelConfig} 成功！`))
  }
}

/**
 * 更新package.json文件
 */
function savePackage() {
  const file = 'package.json'
  const filePath = path.join(curDir, file)
  const timeStamp = formatDate('yyyyMMdd_hhmmss', new Date())
  const saveFile = path.join(curDir, path.basename(file, '.json') + '.old.' + timeStamp + '.json')
  fs.copySync(filePath, saveFile)
  console.log(
    chalk.yellow(`### App Toolkit ### 更新的${file}的备份文件保存为: ${relateCwd(saveFile)}`)
  )
}

/**
 * 升级工程
 */
function updateProject(options) {
  const ver = checkVersion()
  if (!options.force) {
    if (ver.res < 0 || ver.res === 0) {
      ver.res === 0 && console.log(`### App Toolkit ### 版本已经是最新版本`)
      return
    }
    // 执行升级
    console.log(chalk.green(`升级工程( ${ver.cur} ----> ${ver.toolkit} )`))
  } else {
    console.log(
      chalk.yellow(`强制升级工程( ${ver.cur} ----> ${ver.toolkit} )(可能会出现兼容性问题)`)
    )
    savePackage()
  }

  // 设置DSL信息
  dslName = getProjectDslName(curDir)
  if (dslName === 'vue') {
    console.error(`hap-toolkit >= 1.9.0版本暂不支持 dsl = vue!`)
  }
  dslModuleDir = dslModuleHash[dslName]

  upgradePackage(options).then(() => {
    // 升级签名
    upgradeSign()
    // 升级eslint
    upgradeEslint()
    // 升级babel.config.js
    upgradeBabelConfig()

    console.log(chalk.green(`升级完毕, 请运行npm install更新依赖包`))
  })
}

module.exports = updateProject
