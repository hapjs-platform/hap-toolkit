/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { colorconsole } from '@hap-toolkit/shared-utils'
import { ENTRY_TYPE } from '@hap-toolkit/compiler'

/**
 * 初始化框架信息
 */
function frameworkInit() {
  // 框架全局信息
  // noinspection JSAnnotator
  global.framework = {
    module: {
      // 基本名
      base: 'system',
      // 扩展名
      ext: 'service'
    },
    // 保留的features，保持与runtime_config.xml同步
    reservedFeatures: [],
    // 不加入manifest中的feature
    reservedFeatureExclude: [],
    supportInCard: [],
    // 项目信息
    project: {
      manifestFilePath: null,
      // 记录feature列表，更新到manifest.json
      featureList: [],
      module: {
        usedBaseAll: false,
        usedExtAll: false
      }
    }
  }

  // 添加native模块
  const systemFeatures = [
    'alarm',
    'audio',
    'barcode',
    'bluetooth',
    'brightness',
    'calendar',
    'cipher',
    'clipboard',
    'contact',
    'device',
    'fetch',
    'file',
    'geolocation',
    'image',
    'keyguard',
    'media',
    'network',
    'notification',
    'package',
    'prompt',
    'record',
    'request',
    'resident',
    'sensor',
    'share',
    'shortcut',
    'sms',
    'storage',
    'vibrator',
    'volume',
    'websocketfactory',
    'webview',
    'battery',
    'wifi',
    'mediaquery',
    'zip',
    'telecom',
    'decode',
    'screenshot',
    'nfc',
    'uploadtask',
    'downloadtask',
    'requesttask'
  ]
  const serviceFeatures = [
    'account',
    'alipay',
    'ad',
    'wxaccount',
    'qqaccount',
    'wbaccount',
    'exchange',
    'health',
    'pay',
    'push',
    'qqaccount',
    'share',
    'stats',
    'wbaccount',
    'wxaccount',
    'wxpay',
    'biometriverify',
    'texttoaudio'
  ]
  systemFeatures.forEach((feature) => {
    // system
    global.framework.reservedFeatures.push(`${global.framework.module.base}.${feature}`)
  })
  serviceFeatures.forEach((feature) => {
    // service
    global.framework.reservedFeatures.push(`${global.framework.module.ext}.${feature}`)
  })

  const featureExclude = ['app', 'model', 'router', 'configuration']
  featureExclude.forEach((feature) => {
    global.framework.reservedFeatureExclude.push(`${global.framework.module.base}.${feature}`)
  })

  // 卡片中支持的feature
  const supportInCard = [
    'share',
    'prompt',
    'vibrator',
    'fetch',
    'storage',
    'clipboard',
    'geolocation',
    'network',
    'device',
    'battery',
    'calendar',
    'package',
    'app',
    'router'
  ]
  supportInCard.forEach((feature) => {
    global.framework.supportInCard.push(`${global.framework.module.base}.${feature}`)
  })
}

/**
 * 查找内容中对模块的引入
 * @desc 目前不会修改文件内容
 */
function searchModuleImport(fileCont, options = {}) {
  // 要提醒的变更日志
  const logFeatureList = []

  // 记录引用的内部模块
  const modInternalNamePatternFull = new RegExp(
    `['"]@(${global.framework.module.base}|${global.framework.module.ext}).*?['"]`,
    'g'
  )
  const modInternalNamePatterHalf = new RegExp(
    `['"]@((${global.framework.module.base}|${global.framework.module.ext}).*?)['"]`
  )
  // 引入的native模块列表
  const modInternalNameList = fileCont.match(modInternalNamePatternFull) || []
  modInternalNameList.forEach((modName) => {
    const match = (modName.match(modInternalNamePatterHalf) || [])[1]
    if (match === `@${global.framework.module.base}`) {
      global.framework.project.module.usedBaseAll = true
    } else if (match === `@${global.framework.module.ext}`) {
      global.framework.project.module.usedExtAll = true
    } else if (global.framework.reservedFeatures.indexOf(match) !== -1) {
      // 确定存在，然后才加入
      global.framework.project.featureList.indexOf(match) === -1 &&
        global.framework.project.featureList.push(match)
    } else if (
      options.uxType === ENTRY_TYPE.CARD &&
      global.framework.supportInCard.indexOf(match) === -1
    ) {
      // 不支持的native模块
      logFeatureList.push({
        reason: `WARN: 您引入了卡片中未识别的 native 模块：${match}`
      })
    } else if (global.framework.reservedFeatureExclude.indexOf(match) !== -1) {
      // 不包括的feature，不做警告
    } else {
      // 不识别，错误的书写
      logFeatureList.push({
        reason: `WARN: 您引入了未识别的 native 模块：${match}`
      })
    }
  })

  return {
    fileCont,
    logFeatureList
  }
}

/**
 * 检测manifest里面的widget，包括：
 * 检测不支持的feature
 * 增加 widget 中 path 缺失时的默认值
 */
function checkFeatureInCard(obj = {}) {
  Object.keys(obj).forEach((key) => {
    obj[key].features &&
      obj[key].features.every((item) => {
        if (global.framework.supportInCard.indexOf(item.name) === -1) {
          // 不支持的native模块
          colorconsole.error(
            `WARN: manifest.json文件中引入了卡片${key}未识别的features：${item.name}`
          )
        }
      })
  })

  populateWidgetFields(obj)
}

/**
 * 填充 widget path、type 缺失时的默认值
 */
function populateWidgetFields(widgetsObj) {
  Object.keys(widgetsObj).forEach((key) => {
    if (!widgetsObj[key].path) {
      widgetsObj[key].path = `/${key}`
      colorconsole.warn(
        `WARN: manifest.json 文件中 widgets 字段 ${key} 缺少 path 属性，默认设置为卡片名 /${key}`
      )
    }
    if (!widgetsObj[key].type) {
      widgetsObj[key].type = `js`
      colorconsole.warn(
        `WARN: manifest.json 文件中 widgets 字段 ${key} 缺少 type 属性，默认设置为 js`
      )
    }
    if (widgetsObj[key].type === 'js' && widgetsObj[key].minCardPlatformVersion) {
      // 写了 minCardPlatformVersion 字段
      // 赋值给 minPlatformVersion（兼容旧引擎），引导引擎升级
      widgetsObj[key].minPlatformVersion = widgetsObj[key].minCardPlatformVersion
    }
  })
}

/**
 * 更新 manifest
 * @param {Manifest} manifest - manifest 对象
 * @param {Boolean} debug - 是否开启调试
 * @return {Manifest} - 更新后的 Manifest 对象
 */
function updateManifest(manifest, debug) {
  // 更新 config.debug
  manifest.config = manifest.config || {}
  manifest.config.debug = debug

  // 设置默认
  if (!manifest.minPlatformVersion || typeof manifest.minPlatformVersion !== 'number') {
    manifest.minPlatformVersion = 1070
  }

  // 更新features
  manifest.features = manifest.features || []

  checkFeatureInCard(manifest.router.widgets || {})

  // 在项目所有引用的模块列表中删除manifest已声明的模块
  const projectFeatureList = [].concat(global.framework.project.featureList)
  manifest.features.forEach((feature) => {
    const feaIndex = projectFeatureList.indexOf(feature.name)
    feaIndex !== -1 && projectFeatureList.splice(feaIndex, 1)
  })
  // 在保留模块列表中存在的模块则应该加入
  const shouldIncludeProjectFeatureList = []
  projectFeatureList.forEach((feaName) => {
    global.framework.reservedFeatures.indexOf(feaName) !== -1 &&
      shouldIncludeProjectFeatureList.push(feaName)
  })
  if (shouldIncludeProjectFeatureList.length > 0) {
    const mapList = shouldIncludeProjectFeatureList.map(function (feaName) {
      return { name: feaName }
    })
    manifest.features = manifest.features.concat(mapList)
    const features = shouldIncludeProjectFeatureList.join(', ')
    colorconsole.warn(`请在 manifest.json 文件里声明项目代码中用到的接口: ${features}\n`)
  }

  return manifest
}
// 注册全局的framework
frameworkInit()

export { searchModuleImport, updateManifest }
