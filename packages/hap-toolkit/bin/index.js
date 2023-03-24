#!/usr/bin/env node

/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const program = require('commander')
const chalk = require('chalk')
const semver = require('semver')
const { colorconsole } = require('@hap-toolkit/shared-utils')
const { compileOptionsMeta } = require('@hap-toolkit/shared-utils/compilation-config')

// 最低支持的node版本
const NODE_MINIMUM_VERSION = '10.13.0'

function checkVersion() {
  const currentVersion = process.versions.node

  // 若当前版本小于支持版本
  if (semver.lt(currentVersion, NODE_MINIMUM_VERSION)) {
    colorconsole.warn(
      `检测到当前 NodeJS 版本过低，请升级到 NodeJS 版本 ${NODE_MINIMUM_VERSION} 以上`
    )
  }
}

checkVersion()

program.version(require('../package').version, '-v, --version').usage('<command> [options]')

program
  .command('init <app-name>')
  .option(
    '-d --deviceType <deviceTypeList>',
    'init project by specific device separated with comma "," eg: tv,car'
  )
  .description('create a new project.')
  .action((name, options) => {
    const generate = require('../lib/commands/init')
    generate(name, options)
  })

program
  .command('build')
  .description('build the project')
  .option('--enable-e2e', 'inject test-suite for current project')
  .option('--stats', 'analyse time and size of webpack output files')
  .option('--devtool <value>', 'source map config')
  .option('--disable-subpackages', 'disable subpackages')
  .option('--disable-stream-pack', 'disable stream pack')
  .option('--disable-sign', 'disable signature')
  .option('--disable-script-v8-v65', 'disable compile script match with v8 version 6.5')
  .option('--optimize-desc-meta', 'optimize desc meta')
  .option('--optimize-css-attr', 'optimize css attr')
  .option('--optimize-template-attr', 'optimize template attr')
  .option('--optimize-style-page-level', 'optimize style in page')
  .option('--optimize-style-app-level', 'optimize style in app ')
  .option('--enable-lazy-component', 'lazy load component')
  .option('--optimize-unused-resource', 'remove unused resource')
  .option('--include-dsl-from-lib', 'bundle dsl to rpk')
  .option('--match-sourcemap', 'match sourcemap')
  .option('--enable-extract-css', 'extract css to json')
  .option(
    '--split-chunks-mode <value>',
    'extract js module to single files',
    validateSplitChunksMode
  )
  .option('--remove-ux-style', 'remove style object in js')
  .option('--enable-istanbul', 'enable coverage for ux/js files')
  .option('--enable-performance-check', 'inject performance log in code')
  .option(
    '--enable-diagnosis [value]',
    'proxy console object, send log to server, write into project/logs'
  )
  .option(
    '--build-name-format <build-name-format>',
    'custom output rpk file name',
    validateBuildNameFormat
  )
  .action((options) => {
    // 必备参数：当开发者不传递该参数时，要解析为默认
    const signModeTmp = options.disableSign && compileOptionsMeta.signModeEnum.NULL
    options.signMode = validateSignMode(signModeTmp, compileOptionsMeta.signModeEnum.BUILD)

    const { compile } = require('../lib/commands/compile')
    compile('native', 'dev', false, options)
  })

program
  .command('debug', { noHelp: true })
  .description('debug the project')
  .option('--open-browser', 'open QR code page in default browser')
  .action((options) => {
    const { launchServer } = require('@hap-toolkit/server')
    const { openBrowser } = options
    launchServer({
      modules: ['debugger'],
      port: 8081,
      openBrowser
    })
  })

program
  .command('server')
  .description('open server for project')
  .option('--port <port>', 'specified port')
  .option('--watch', 'recompile project while file changes')
  .option('--clear-records', 'clear device records')
  .option('--disable-adb', 'disable adb debug')
  .option('--chrome-path <chrome-path>', 'support for a user specified chrome path')
  .option('--open-browser', 'open QR code page in default browser')
  .option('--include-dsl-from-lib', 'bundle dsl to rpk')
  .option('--enable-performance-check', 'inject performance log in code')
  .option(
    '--build-name-format <build-name-format>',
    'custom output rpk file name',
    validateBuildNameFormat
  )
  .action((options) => {
    const { launchServer } = require('@hap-toolkit/server')
    const { compile } = require('../lib/commands/compile')
    const { port, watch, clearRecords, chromePath, disableAdb, openBrowser } = options
    launchServer({
      port,
      watch,
      clearRecords,
      chromePath,
      disableADB: disableAdb,
      openBrowser
    })
    if (options.watch) {
      compile('native', 'dev', true, options)
    }
  })

program
  .command('watch')
  .description('recompile project while file changes')
  .option('--enable-e2e', 'inject test-suite for current project')
  .option('--devtool <value>', 'source map config')
  .option('--disable-subpackages', 'disable subpackages')
  .option('--disable-stream-pack', 'disable stream pack')
  .option('--disable-script-v8-v65', 'disable compile script match with v8 version 6.5')
  .option('--include-dsl-from-lib', 'bundle dsl to rpk')
  .option('--match-sourcemap', 'match sourcemap')
  .option('--enable-extract-css', 'extract css to json')
  .option(
    '--split-chunks-mode <value>',
    'extract js module to single files',
    validateSplitChunksMode
  )
  .option('--remove-ux-style', 'remove style object in js')
  .option('--enable-istanbul', 'enable coverage for ux/js files')
  .option('--enable-performance-check', 'inject performance log in code')
  .option(
    '--enable-diagnosis [value]',
    'proxy console object, send log to server, write into project/logs'
  )
  .option(
    '--build-name-format <build-name-format>',
    'custom output rpk file name',
    validateBuildNameFormat
  )
  .action((options) => {
    const { compile } = require('../lib/commands/compile')
    compile('native', 'dev', true, options)
  })

program
  .command('release')
  .description('release the project')
  .option('--enable-e2e', 'inject test-suite for current project')
  .option('--stats', 'analyse time and size of webpack output files')
  .option('--devtool <value>', 'source map config')
  .option('--disable-subpackages', 'disable subpackages')
  .option('--disable-stream-pack', 'disable stream pack')
  .option('--disable-sign', 'disable signature')
  .option('--disable-script-v8-v65', 'disable compile script match with v8 version 6.5')
  .option('--optimize-desc-meta', 'optimize desc meta')
  .option('--optimize-css-attr', 'optimize css attr')
  .option('--optimize-template-attr', 'optimize template attr')
  .option('--optimize-style-page-level', 'optimize style in page')
  .option('--optimize-style-app-level', 'optimize style in app ')
  .option('--enable-lazy-component', 'lazy load component')
  .option('--optimize-unused-resource', 'remove unused resource')
  .option('--include-dsl-from-lib', 'bundle dsl to rpk')
  .option('--match-sourcemap', 'match sourcemap')
  .option('--enable-extract-css', 'extract css to json')
  .option(
    '--split-chunks-mode <value>',
    'extract js module to single files',
    validateSplitChunksMode
  )
  .option('--remove-ux-style', 'remove style object in js')
  .option('--enable-istanbul', 'enable coverage for ux/js files')
  .option('--enable-performance-check', 'inject performance log in code')
  .option(
    '--enable-diagnosis [value]',
    'proxy console object, send log to server, write into project/logs'
  )
  .option(
    '--build-name-format <build-name-format>',
    'custom output rpk file name',
    validateBuildNameFormat
  )
  .action((options) => {
    // 必备参数：当开发者不传递该参数时，要解析为默认
    const signModeTmp = options.disableSign && compileOptionsMeta.signModeEnum.NULL
    options.signMode = validateSignMode(signModeTmp, compileOptionsMeta.signModeEnum.RELEASE)

    const { compile } = require('../lib/commands/compile')
    compile('native', 'prod', false, options)
  })

program
  .command('preview <target>')
  .description('preview app in your browser')
  .option('--port <port>', 'specified port', 8989)
  .action((target, options) => {
    const preview = require('../lib/commands/preview')
    preview(target, options)
  })

program
  .command('postinstall', { noHelp: true })
  .description('Transpiling async/await for nodejs<7.6.x, deprecated.')
  .action(() => {
    colorconsole.warn('Deprecated command!')
  })

// TODO
// Since we properly have all dependencies included,
// and if we make {babel, eslint}-configuration built-in,
// we won't need this `update` command anymore.
program
  .command('update')
  .description('update tools for project')
  .option('--force', 'force update tools for project')
  .option('--update-deps', 'update dependencies directly', { noHelp: true })
  .action((options) => {
    const update = require('../lib/commands/update')
    colorconsole.warn('hap-toolkit>=0.1.0 不再需要运行此命令\n')
    update(options)
  })

program
  .command('report', { noHelp: true })
  .description('collect system information and create report.log')
  .action(() => {
    const report = require('../lib/commands/report')
    report()
  })

program
  .command('view <rpk-path>')
  .description('run server to view rpk')
  .option('--port <port>', 'specified port', 8000)
  .option('--open-browser', 'open QR code page in default browser')
  .action((rpkPath, options) => {
    const { launchServer } = require('@hap-toolkit/server')
    const { port, openBrowser } = options
    launchServer({
      port,
      openBrowser,
      rpkPath
    })
  })

program
  .command('resign')
  .description('resign the rpk/rpks packages')
  .option('--sign <dir>', 'folder where your signature stored', 'sign/release')
  .option('--file <dir>', 'rpk that need to be re-signed')
  .option('--origin <dir>', 'folder where unsigned rpk(s) stored', 'dist')
  .option('--dest <dir>', 'folder where re-signed rpk(s) stored', 'dest')
  .action((options) => {
    const { resign } = require('../lib/commands/resign')
    resign(options)
  })

program
  .command('installdbg')
  .description('install "org.hapjs.debugger"')
  .option('-I, --ip <value>', 'connect remote devices, eg: 127.0.0.1')
  .option('-P, --platform <value>', 'quickapp debugger platform, default: phone')
  .option('-V, --apkVersion <value>', 'debugger version, default: v1080')
  .option('-F, --force-install', 'overwrite install original debugger')
  .action(async (options) => {
    const { installdbg } = require('../lib/commands/debug')
    try {
      const successMessage = await installdbg(options)
      colorconsole.info(successMessage)
    } catch (error) {
      colorconsole.error(error.message)
    }
  })

program
  .command('installmkp')
  .description('install "org.hapjs.mockup"')
  .option('-I, --ip <value>', 'connect remote devices, eg: 127.0.0.1')
  .option('-P, --platform <value>', 'quickapp engine platform, default: phone')
  .option('-V, --apkVersion <value>', 'quickapp engine version, default: v1080')
  .option('-F, --force-install', 'overwrite install quickapp engine')
  .action(async (options) => {
    const { installmkp } = require('../lib/commands/debug')
    try {
      const successMessage = await installmkp(options)
      colorconsole.info(successMessage)
    } catch (error) {
      colorconsole.error(error.message)
    }
  })

// 运行rpk在所有已连接的设备
program
  .command('runapp')
  .description('run app on multiple devices')
  .option('-D, --debugMode', 'open chrome devtools')
  .option('-C, --cardMode', 'open cardMode')
  .action(async (options) => {
    const { runapp } = require('../lib/commands/debug')
    try {
      await runapp(options)
    } catch (error) {
      colorconsole.error(error.message)
    }
  })

program
  .command('installrun')
  .description('install quickapp background and run')
  .option('-I --ip <value>', 'connect remote devices, eg: 127.0.0.1')
  .option('-P --platform <value>', 'quickapp platform, default: phone')
  .option('-V --apkVersion <value>', 'quickapp version, default: v1080')
  .option('-F, --force-install', 'overwrite install debugger and engine')
  .option('-D, --debugMode', 'open chrome devtools')
  .option('-C, --cardMode', 'open cardMode')
  .action(async (options) => {
    const { installAndRun } = require('../lib/commands/debug')
    try {
      await installAndRun(options)
    } catch (error) {
      colorconsole.error(error.message)
    }
  })

// 获取设备上支持运行快应用的引擎包名（数组形式），主要供IDE使用
program
  .command('getPlatforms')
  .option('-I --ip <value>', 'device ip,eg 127.0.0.1')
  .option('-P --port <value>', 'device port,eg 39517')
  .option('-S --sn <value>', 'device sn,eg 2a75794a')
  .description('get available platform(s) on selected device')
  .action(async (options) => {
    const { getAvailablePlatform } = require('../lib/commands/debug')
    getAvailablePlatform(options)
  })

// 获取所有连接上的设备列表（数组形式），主要供IDE使用
program
  .command('getConnectedDevices')
  .description('get all connected devices')
  .action(async (options) => {
    const { getAllConnectedDevices } = require('../lib/commands/debug')
    try {
      const connectedDevices = await getAllConnectedDevices(options)
      colorconsole.info(`已连接的设备有：${connectedDevices.join(', ')}`)
    } catch (error) {
      colorconsole.error(error.message)
    }
  })

program.on('--help', () => {
  console.log()
  console.log(`Run ${chalk.cyan(`hap <command> --help`)} for detailed usage of given command.`)
  console.log()
})

// 更改 NodeJS 10.1.0 上的 "fs.promise is Experiment" 日志输出位置
require('fs-extra')
setTimeout(() => {
  program.parse(process.argv)

  if (!process.argv.slice(2).length) {
    program.outputHelp()
  }
}, 0)

function validateSignMode(value, defaultValue) {
  // 无值则为空串
  if ([null, undefined].includes(value)) {
    value = defaultValue
  }

  // 转成枚举常量比较
  value = value.toUpperCase()

  let ret = value

  if (!compileOptionsMeta.signModeEnum[value]) {
    ret = defaultValue
    colorconsole.warn(`当前signMode参数不支持: ${value} ，改为默认值：${ret}`)
  }
  return ret
}

/**
 * 校验SplitChunkMode参数的有效值
 * @param value {string}
 * @return {string}
 */
function validateSplitChunksMode(value) {
  // 转成枚举常量比较
  value = value.toUpperCase()

  let ret = value

  if (!compileOptionsMeta.splitChunksModeEnum[value]) {
    ret = compileOptionsMeta.splitChunksModeEnum.REDUNDANCY
    colorconsole.warn(`当前splitChunksMode参数不支持: ${value} ，改为默认值：${ret}`)
  }
  return ret
}

/**
 * 校验buildNameFormat参数的有效值
 * @param value {string}
 * @return {string}
 */
function validateBuildNameFormat(value) {
  // 转成枚举常量比较
  value = value.toUpperCase()

  let ret = value

  if (!compileOptionsMeta.buildNameFormat[value]) {
    ret = compileOptionsMeta.buildNameFormat.DEFAULT
    colorconsole.warn(`当前buildNameFormat参数不支持: ${value} ，改为默认值：${ret}`)
  }
  return ret
}
