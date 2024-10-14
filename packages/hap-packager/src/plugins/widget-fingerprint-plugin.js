/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs-extra'
import path from 'path'
import { calcDataDigest, getLastLoaderPath } from '../common/utils'
import { LOADER_INFO_LIST, LOADER_PATH_UX } from '../common/constant'

const MANIFEST_PATH = 'manifest.json'

const EXCLUDE_FILE_EXTS = ['.ux', '.vue', '.jsx', '.tsx', '.js', '.ts', '.css', '.less', '.scss', '.sass', ''] // .gitignore .DS_Store

/**
 * Generate a fingerprint string for a widget, based on the source code and config of the widget. 
 * The fingerprint can be used to detect whether any changes on the widget.
 */
class WidgetFingerprintPlugin {
  constructor(options = {}) {
    this.options = options || {}
  }

  apply(compiler) {
    compiler.hooks.done.tap('WidgetFingerprintPlugin', ({ compilation }) => {
      const options = this.options
      const pathSrc = options.pathSrc
      let manifestPath
      if (fs.pathExistsSync(path.join(pathSrc, 'manifest-phone.json'))) { // compatible with device type, phone
        manifestPath = path.join(pathSrc, 'manifest-phone.json')
      } else {
        manifestPath = path.join(pathSrc, MANIFEST_PATH)
      }
      let manifestContent
      if (fs.pathExistsSync(manifestPath)) {
        manifestContent = fs.readFileSync(manifestPath, 'utf8')
        const manifest = JSON.parse(manifestContent)
        const { package: name, versionCode, versionName, router } = manifest
        options.name = name
        options.versionName = versionName
        options.versionCode = versionCode
        options.widgets = router.widgets || {}
      }
      const widgets = options.widgets || {}
      const widgetNameKeyMap = {}
      const widgetEntries = Object.keys(widgets).map(key => {
        const widget = widgets[key]
        const name = path.join(key, widget.component)
        widgetNameKeyMap[name] = key
        return name
      })
      for (const chunk of compilation.chunks) {
        const chunkName = chunk.name
        if (widgetEntries.indexOf(chunkName) >= 0) { // widget chunk
          const widgetKey = widgetNameKeyMap[chunkName]
          const widgetDigestMap = {}
          const arr = []
          for (const module of chunk.modulesIterable) {
            const { _source, rawRequest, request } = module
            arr.push(rawRequest)
            if (!request) {
              continue
            }
            const reqPath = request.replace(/\\/g, '/')
            const lastLoaderPath = getLastLoaderPath(reqPath)
            if (lastLoaderPath === LOADER_PATH_UX.path) {
              // skip ux-loader.js 
              continue
            }
            const { absPath } = this.parseABSPath(reqPath, pathSrc)
            const { _valueAsString, _valueAsBuffer } = _source || {}
            const sourceValueStr = _valueAsString || _valueAsBuffer?.toString() || ''
            let digestStr = ''
            if (sourceValueStr !== '') {
              const digest = calcDataDigest(Buffer.from(sourceValueStr, 'utf-8'))
              digestStr = digest.toString('hex')
            }
            // module digest
            widgetDigestMap[absPath] = digestStr
          }
          // assets digests
          const assetsDigestMap = this.calculateAssetsDigest(path.join(pathSrc, widgetKey), pathSrc)
          Object.assign(widgetDigestMap, assetsDigestMap)

          // widget manifest digest
          const manifestDigest = this.getManifestDigest(widgetKey, manifestContent)
          widgetDigestMap[MANIFEST_PATH] = manifestDigest

          const orderK = Object.keys(widgetDigestMap).sort()
          let contentStr = '' // ordered path & digest string
          orderK.forEach(filePath => {
            contentStr += `${filePath}:${widgetDigestMap[filePath]};`
          })
          // generate widget digest, save it in compilation
          const widgetDigest = calcDataDigest(Buffer.from(contentStr, 'utf-8')).toString('hex')
          const { _widgetDigestMap = {} } = compilation
          _widgetDigestMap[`widget:${widgetKey}`] = widgetDigest
          if (!compilation._widgetDigestMap) {
            compilation._widgetDigestMap = _widgetDigestMap
          }
        }
      }
    })
  }

  /**
   * parse absolute path based by project src
   * @param {*} reqPath 
   * @param {*} srcPath 
   */
  parseABSPath(reqPath, srcPath) {
    if(!reqPath) {
      return null
    }
    const reqArr = reqPath.split('!')
    const pathStr = reqArr[reqArr.length - 1]
    if(pathStr) {
      let type = ''
      const lastLoaderPath = getLastLoaderPath(reqPath)
      if (lastLoaderPath) {
        const loaderItem = LOADER_INFO_LIST.find(item => item.path === lastLoaderPath)
        type = loaderItem && loaderItem.type || ''
      }
      const pathArr = pathStr.split('?')
      const p = pathArr[0]
      if(p.indexOf(srcPath) === 0) {
        const res = p.substring(srcPath.length)
        const absPath = `${res}${type && '?'}${type}`
        return { absPath, type } // add type param for ux sections
      }
    }
    return { absPath: reqPath, type: '' }
  }

  /**
   * 返回与当前卡片相关的 manifest 配置摘要
   * @param string widgetKey 
   * @param string manifestContent 
   */
  getManifestDigest(widgetKey, manifestContent) {
    if (!widgetKey || !manifestContent) {
      return new Date().getTime()
    }
    const manifestJsonNew = JSON.parse(manifestContent)
    manifestJsonNew.versionName = ''
    manifestJsonNew.versionCode = ''
    manifestJsonNew.router.entry = ''
    if (manifestJsonNew.router.pages) {
      manifestJsonNew.router.pages = ''
    }
    manifestJsonNew.router.widgets = {
      [widgetKey]: manifestJsonNew.router.widgets[widgetKey]
    }
    const manifestJsonNewStr = JSON.stringify(manifestJsonNew)
    const digest = calcDataDigest(Buffer.from(manifestJsonNewStr, 'utf-8')).toString('hex')
    return digest
  }

  /**
   * calculate digest of the assets files
   * @param {string} dir 
   * @param {string[]} allFiles 
   * @returns {Object} relative file path and its digest
   */
  calculateAssetsDigest(dir, basePath, assetsDigestMap = {}) {
    const files = fs.readdirSync(dir)
    for (let i = 0; i < files.length; i++) {
      let name = path.join(dir, files[i])
      if (fs.statSync(name).isDirectory()) {
        this.calculateAssetsDigest(name, basePath, assetsDigestMap)
      } else {
        const ext = path.extname(name)
        if (EXCLUDE_FILE_EXTS.includes(ext)) {
          continue
        }
        const digest = calcDataDigest(fs.readFileSync(name)).toString('hex')
        const relativePath = path.relative(basePath, name)
        assetsDigestMap[relativePath] = digest
      }
    }
    return assetsDigestMap
  }
}

export { WidgetFingerprintPlugin }
