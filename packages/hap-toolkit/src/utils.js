/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { colorconsole } = require('@hap-toolkit/shared-utils')
const { ENTRY_TYPE } = require('@hap-toolkit/packager/lib/common/utils')
const { resolveFile } = require('@hap-toolkit/packager/lib/common/info')
const { compileOptionsObject } = require('@hap-toolkit/shared-utils/compilation-config')

/**
 * 提取其中的应用，页面，worker的脚本文件
 * @return {Array}
 * 以 basedir 为基本目录，获取 manifest 的配置的入口页面
 *
 * @param {ManifestObject} manifest - manifest
 * @param {String} basedir - 扫描目录
 * @param {String} cwd - 工作目录
 * @returns {Array<Object>}
 */
exports.resolveEntries = function resolveEntries(manifest, basedir, cwd) {
  if (!manifest.router) {
    throw Error('manifest.json 中未配置路由！')
  }
  const entries = {}
  // 快应用APP的页面路由
  const pagesConf = manifest.router.pages || {}
  // 快应用卡片的路由
  const widgetsConf = manifest.router.widgets || {}
  const confsList = []
  const { target } = compileOptionsObject
  // 默认的时候（target不存在或者为all），维持原来的处理
  if (!target || target === 'all') {
    // all的时候两种都需要打包
    confsList.push({
      confs: pagesConf,
      type: ENTRY_TYPE.PAGE
    })
    confsList.push({
      confs: widgetsConf,
      type: ENTRY_TYPE.CARD
    })
  } else {
    // 只打包card
    if (target === 'card') {
      confsList.push({
        confs: widgetsConf,
        type: ENTRY_TYPE.CARD
      })
      // 只打包app
    } else if (target === 'app') {
      confsList.unshift({
        confs: pagesConf,
        type: ENTRY_TYPE.PAGE
      })
    }
  }
  const appFile = resolveFile(path.join(basedir, 'app'))
  if (!appFile) {
    colorconsole.error('app 文件不存在')
    process.exit(1)
  }
  entries['app'] = './' + path.relative(cwd, appFile) + `?uxType=${ENTRY_TYPE.APP}`
  confsList.forEach(({ confs, type }) => {
    Object.keys(confs).forEach((routePath) => {
      const conf = confs[routePath]
      const entryKey = path.join(routePath, conf.component)
      const filepath = resolveFile(path.join(basedir, entryKey))

      if (!filepath) {
        colorconsole.throw(`编译失败：请确认manifest.json中配置的文件路径存在：${entryKey}`)
      }
      if (/^\//.test(routePath)) {
        colorconsole.throw(
          `编译失败：请确认manifest.json中router.pages配置的 '${routePath}' 为目录名`
        )
      }
      let sourceFile = path.relative(cwd, filepath)
      sourceFile = './' + sourceFile + `?uxType=${type}`
      sourceFile = sourceFile.replace(/\\/g, '/')
      entries[entryKey] = sourceFile
    })
  })
  const workers = manifest.workers
  if (workers && workers.entries && workers.entries instanceof Array) {
    workers.entries
      .filter((worker) => worker.file)
      .forEach((worker) => {
        entries[worker.file.replace(/\.js$/, '')] = './src/' + worker.file
      })
  }
  return entries
}
