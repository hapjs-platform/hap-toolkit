/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs-extra'
import path from 'path'
import { calcDataDigest, getLastLoaderPath } from '../common/utils'
import {
  LOADER_INFO_LIST,
  LOADER_PATH_UX,
  LOADER_PATH_APP,
  LOADER_PATH_DEVICETYPE
} from '../common/constant'

const MANIFEST_PATH = 'manifest.json'

const EXCLUDE_FILE_EXTS = [
  '.ux',
  '.vue',
  '.jsx',
  '.tsx',
  '.js',
  '.ts',
  '.css',
  '.less',
  '.scss',
  '.sass',
  ''
] // .gitignore .DS_Store

const EXCLUDE_FILES = ['manifest.json', 'sitemap.json']

const APP = 'app'

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
      if (fs.pathExistsSync(path.join(pathSrc, 'manifest-phone.json'))) {
        // compatible with device type, phone
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
      const widgetKeys = Object.keys(widgets) || {}
      const widgetEntries = widgetKeys.map((key) => {
        const widget = widgets[key]
        const name = path.join(key, widget.component)
        widgetNameKeyMap[name] = key
        return name
      })
      const allAssetsDigestMap = this.calculateAllAssetsDigest(pathSrc, pathSrc, {}, widgetKeys)
      const appDigestMap = {}
      for (const chunk of compilation.chunks) {
        const chunkName = chunk.name
        if (widgetEntries.indexOf(chunkName) >= 0) {
          // widget chunk
          const widgetDigestMap = {}
          this.getModuleDigestFromChunk(compilation, chunk, widgetDigestMap, pathSrc)
          const widgetKey = widgetNameKeyMap[chunkName]
          this.updateDigest(
            compilation,
            widgetKey,
            widgetDigestMap,
            allAssetsDigestMap,
            manifestContent
          )
        } else {
          // appDigestMap
          this.getModuleDigestFromChunk(compilation, chunk, appDigestMap, pathSrc)
        }
      }
      this.updateDigest(compilation, APP, appDigestMap, allAssetsDigestMap, manifestContent)
    })
  }

  /**
   * combine assets and manifest digests, save result on compilation
   * @param {*} compilation
   * @param {*} key app or widgets key
   * @param {*} digestMap all digest for app & widgets
   * @param {*} allAssetsDigestMap all assets digets
   * @param {*} manifestContent manifest conentent
   */
  updateDigest(compilation, key, digestMap, allAssetsDigestMap, manifestContent) {
    // assets digest
    const assetsDigestMap = allAssetsDigestMap[key] || {}
    Object.assign(digestMap, assetsDigestMap)
    // manifest digest
    digestMap[MANIFEST_PATH] = this.getManifestDigest(key, manifestContent)

    const orderK = Object.keys(digestMap).sort()
    let contentStr = '' // ordered path & digest string
    orderK.forEach((filePath) => {
      contentStr += `${filePath}:${digestMap[filePath]};`
    })
    // generate widget digest, save it in compilation
    const digest = calcDataDigest(Buffer.from(contentStr, 'utf-8')).toString('hex')

    const { _widgetDigestMap = {} } = compilation
    if (key === APP) {
      _widgetDigestMap[`app:${key}`] = digest
    } else {
      _widgetDigestMap[`widget:${key}`] = digest
    }
    if (!compilation._widgetDigestMap) {
      compilation._widgetDigestMap = _widgetDigestMap
    }
  }

  /**
   * get all module digests in chunk
   * @param {*} compilation
   * @param {*} chunk
   * @param {*} moduleDigestMap
   * @param {*} pathSrc
   */
  getModuleDigestFromChunk(compilation, chunk, moduleDigestMap, pathSrc) {
    for (const module of compilation.chunkGraph.getChunkModules(chunk)) {
      const { _source, request } = module
      if (!request) {
        continue
      }
      const reqPath = request.replace(/\\/g, '/')
      const lastLoaderPath = getLastLoaderPath(reqPath)
      if (
        lastLoaderPath === LOADER_PATH_UX.path ||
        lastLoaderPath === LOADER_PATH_APP.path ||
        lastLoaderPath === LOADER_PATH_DEVICETYPE.path
      ) {
        // skip
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
      moduleDigestMap[absPath] = digestStr
    }
  }

  /**
   * parse absolute path based by project src
   * @param {*} reqPath
   * @param {*} srcPath
   */
  parseABSPath(reqPath, srcPath) {
    if (!reqPath) {
      return null
    }
    const reqArr = reqPath.split('!')
    const pathStr = reqArr[reqArr.length - 1]
    if (pathStr) {
      let type = ''
      const lastLoaderPath = getLastLoaderPath(reqPath)
      if (lastLoaderPath) {
        const loaderItem = LOADER_INFO_LIST.find((item) => item.path === lastLoaderPath)
        type = (loaderItem && loaderItem.type) || ''
      }
      const pathArr = pathStr.split('?')
      const p = pathArr[0]
      if (p.indexOf(srcPath) === 0) {
        const res = p.substring(srcPath.length)
        const absPath = `${res}${type && '?'}${type}`
        return { absPath, type } // add type param for ux sections
      }
    }
    return { absPath: reqPath, type: '' }
  }

  /**
   * 返回与当前app或widget相关的 manifest 配置摘要
   * @param string key
   * @param string manifestContent
   */
  getManifestDigest(key, manifestContent) {
    if (!key || !manifestContent) {
      return new Date().getTime()
    }
    const manifestJsonNew = JSON.parse(manifestContent)
    manifestJsonNew.versionName = ''
    manifestJsonNew.versionCode = ''
    manifestJsonNew['template/official'] = ''
    if (key === APP) {
      if (manifestJsonNew.router.widgets) {
        manifestJsonNew.router.widgets = ''
      }
    } else {
      manifestJsonNew.router.entry = ''
      if (manifestJsonNew.router.pages) {
        manifestJsonNew.router.pages = ''
      }
      manifestJsonNew.router.widgets = {
        [key]: manifestJsonNew.router.widgets[key]
      }
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
  calculateAllAssetsDigest(dir, basePath, assetsDigestMap, widgetKeys) {
    const files = fs.readdirSync(dir)
    for (let i = 0; i < files.length; i++) {
      let fileName = path.join(dir, files[i])
      if (fs.statSync(fileName).isDirectory()) {
        // directory
        this.calculateAllAssetsDigest(fileName, basePath, assetsDigestMap, widgetKeys)
      } else {
        // file
        const ext = path.extname(fileName)
        if (EXCLUDE_FILE_EXTS.includes(ext)) {
          continue
        }
        const relativePath = path.relative(basePath, fileName)
        if (EXCLUDE_FILES.includes(relativePath)) {
          continue
        }
        const digest = calcDataDigest(fs.readFileSync(fileName)).toString('hex')
        const widgetKey = widgetKeys.find((item) => relativePath.startsWith(item + '/'))
        if (widgetKey) {
          // widget
          if (!assetsDigestMap[widgetKey]) {
            assetsDigestMap[widgetKey] = {}
          }
          assetsDigestMap[widgetKey][relativePath] = digest
        } else {
          // app
          if (!assetsDigestMap[APP]) {
            assetsDigestMap[APP] = {}
          }
          assetsDigestMap[APP][relativePath] = digest
        }
      }
    }
    return assetsDigestMap
  }
}

export { WidgetFingerprintPlugin }
