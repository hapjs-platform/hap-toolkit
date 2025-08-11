/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import { PassThrough } from 'stream'
import util from 'util'
import KoaRouter from 'koa-router'
import koaSend from 'koa-send'
import JSZip from 'jszip'
import { browerOptions } from '../config'
import { KnownError, getLaunchPage, logger, eventBus } from '@hap-toolkit/shared-utils'

import { renderPage, trimSlash, removeAnsiColor } from './shared'

const { PACKAGER_BUILD_DONE, PACKAGER_WATCH_START, PACKAGER_BUILD_PROGRESS } = eventBus

// 不存在也返回200文件
const allowFiles = ['sitemap.json', 'app-chunks.json', 'page-chunks.json']

function genWebJsUrl(version) {
  version = version ? '-' + version : ''
  return `https://statres.quickapp.cn/quickapp/ide/web${version}.js`
}

function jsonParse(data) {
  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Json Parse Error :', err)
  }
}

export default async function createRouter(previewTarget) {
  const debug = util.debuglog('server.render')
  const router = new KoaRouter()
  let isFile = false
  debug('preview target', previewTarget)
  // build 目录可能尚未创建
  const existed = fs.existsSync(previewTarget)
  if (existed) {
    isFile = fs.lstatSync(previewTarget).isFile()
  }
  const read = util.promisify(fs.readFile)
  // 渲染模板
  const TPL_PAGE_PATH = path.resolve(__dirname, './views/page.html')
  const TPL_404_PATH = path.resolve(__dirname, './views/404.html')

  const mru = new Map()
  const CACHE_TIME = 2000

  /**
   * 获取 manifest 信息
   * 设置了缓存
   *
   * @returns {Promise<Manifest>}
   */
  let getManifest
  let scriptExists
  let zipBuffer
  if (isFile) {
    const fileBuffer = await read(previewTarget)
    zipBuffer = await JSZip.loadAsync(fileBuffer)
    getManifest = async function getManifest() {
      const file = zipBuffer.file('manifest.json')
      if (!file) {
        throw new KnownError(`从 ${previewTarget} 读取 manifest.json 失败！`)
      }
      return file.async('string').then(jsonParse)
    }
    scriptExists = function (script) {
      return zipBuffer.file(script) !== null
    }
  } else {
    const manifestFile = path.resolve(previewTarget, 'manifest.json')
    getManifest = async function getManifest() {
      let cached = mru.get(manifestFile)
      let manifest
      if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
        manifest = cached.payload
      } else {
        if (!fs.existsSync(previewTarget)) {
          throw new KnownError('找不到 build 目录')
        }
        if (fs.existsSync(manifestFile)) {
          manifest = jsonParse(await read(manifestFile))
          mru.set(manifestFile, {
            timestamp: Date.now(),
            payload: manifest
          })
        } else {
          throw new KnownError('找不到 build 目录下的 manifest.json')
        }
      }
      return manifest
    }
    scriptExists = function (script) {
      return fs.existsSync(path.resolve(previewTarget, script))
    }
  }

  /**
   * 获取配置的路由信息
   */
  async function getRoutes(manifest) {
    let routes = {}
    if (manifest && manifest.router && (manifest.router.pages || manifest.router.widgets)) {
      const pages = manifest.router.pages || {}
      const widgets = manifest.router.widgets || {}
      const pageNames = Object.keys(pages)
      const widgetNames = Object.keys(widgets)
      const routeNames = pageNames.concat(widgetNames)

      routeNames.forEach((routeName) => {
        const key = trimSlash(routeName)
        const route = pages[routeName] || widgets[routeName]
        const comp = trimSlash(route.component)
        // comp 无后缀名？
        routes[key] = `${routeName}/${comp}.js`
      })
    } else {
      const err = new KnownError('未配置页面路由信息')
      err.__KNOWN = true
    }
    return routes
  }

  // 使用 event-source 提供即使的刷新
  router.get('/__stream', async function eventSource(ctx) {
    const stream = new PassThrough()

    // 发送watch编译事件
    function watch() {
      if (!ctx.req.destroyed) {
        stream.write('event: watch\n')
        stream.write(`data: ''\n\n`)
      }
    }

    // 发送watch编译事件
    function progress(data) {
      if (!ctx.req.destroyed) {
        stream.write('event: progress\n')
        stream.write(`data: ${JSON.stringify(data)}\n\n`)
      }
    }

    // 发送刷新信号
    function reload() {
      if (!ctx.req.destroyed) {
        const compileError = logger.get()
        const page = getLaunchPage()
        const data = {
          error: escape(removeAnsiColor(compileError)),
          page
        }
        stream.write('event: reload\n')
        stream.write(`data: ${JSON.stringify(data)}\n\n`)
      }
    }

    // 移除监听
    function end() {
      ctx.res.end()
      stream.end()
      if (eventBus.off) {
        eventBus.off(PACKAGER_WATCH_START, watch)
        eventBus.off(PACKAGER_BUILD_PROGRESS, progress)
        eventBus.off(PACKAGER_BUILD_DONE, reload)
      }
    }
    eventBus.on(PACKAGER_WATCH_START, watch)
    eventBus.on(PACKAGER_BUILD_PROGRESS, progress)
    eventBus.on(PACKAGER_BUILD_DONE, reload)

    ctx.req.on('close', end)
    ctx.req.on('finish', end)
    ctx.req.on('error', end)
    ctx.type = 'text/event-stream'
    // 设置该接口不超时，否则在预览的调试界面容易出现超时报错
    ctx.res.connection.setTimeout(0)

    stream.write('event: start\n')
    stream.write('data: waing for signal\n\n')
    ctx.body = stream
  })

  // 首页，跳转到入口页面
  router.get('/', async function __home__(ctx, next) {
    const manifest = await getManifest()
    if (manifest && manifest.router && manifest.router.entry) {
      debug('preview home', 'entry', manifest.router.entry)
      const page = getLaunchPage()
      const pathname = page || manifest.router.entry
      ctx.redirect(`/preview/${pathname}`)
    } else {
      // 纯卡片项目的时候需要去获取当前编译模式里面存的id，不然刷新会默认首页报404
      const page = getLaunchPage()
      ctx.redirect(`/preview/${page}`)
    }
  })

  // 如果匹配到页面，将返回渲染后的 html
  // 否则返回 static
  // 没有 static 则返回 preview 的 404 页面
  router.get('/*', async function __resolver__(ctx, next) {
    const manifest = await getManifest()
    const routes = await getRoutes(manifest)
    const routeNames = Object.keys(routes)
    let requestRoute = trimSlash(ctx.path)

    debug('requestRoute', requestRoute, ctx.appRoutes)
    // 已配置路由
    if (routeNames.indexOf(requestRoute) > -1) {
      const widgets = manifest.router.widgets || {}
      const type = requestRoute in widgets ? 'card' : 'app'
      const script = routes[requestRoute]
      const currentLanguage = JSON.parse(
        process.env.VSCODE_NLS_CONFIG || '{"locale":"zh-CN"}'
      ).locale
      const mediaQueryParams = browerOptions.options.mediaQueryParams || {}
      const html = await renderPage(TPL_PAGE_PATH, {
        title: manifest.name,
        routeName: requestRoute,
        routes: JSON.stringify(routes),
        type,
        script,
        scriptNotFound: !scriptExists(script),
        devtoolUrl: browerOptions.options.devtoolUrl || '',
        webJsUrl: genWebJsUrl(browerOptions.options.version || ctx.conf.options.webVersion), // 更改预览版本号修改为同媒介查询一样的传参方式，同时兼容之前的方式
        language: currentLanguage,
        mediaQueryParams: JSON.stringify(mediaQueryParams) // 传给页面的媒介查询参数
      })
      ctx.type = 'text/html'
      ctx.body = html
    } else {
      // fallback to static(previewTarget)
      await next()
      // no static? then 404
      if (ctx.status === 404) {
        if (requestRoute.endsWith('.js')) {
          ctx.type = 'text/javascript'
          ctx.body = `/* 404 */console.log(new Error('找不到 ${requestRoute}'))`
        } else {
          const html = await renderPage(TPL_404_PATH, {
            message: `找不到 /preview/${requestRoute}`
          })
          ctx.type = 'text/html'
          ctx.body = html
        }
        // 需要重置
        ctx.status = 404
      }
    }
  })

  // zip/rpk 文件
  if (isFile) {
    router.get('/*', async function __static_files__(ctx, next) {
      let filePath = trimSlash(ctx.path)
      const file = zipBuffer.file(filePath)

      if (allowFiles.includes(filePath)) {
        ctx.status = 200
        file && (ctx.body = await file.nodeStream())
        return
      }

      if (file) {
        ctx.body = await file.nodeStream()
      } else {
        // to 404
        ctx.status = 404
        await next()
      }
    })
  } else {
    // 快应用静态资源
    router.get('/*', async function __static_file__(ctx, next) {
      let filePath = trimSlash(ctx.path)
      // sitemap皆返回200
      if (allowFiles.includes(filePath)) {
        const allowFile = path.join(previewTarget, filePath)
        if (fs.existsSync(allowFile)) {
          try {
            const sitemapJson = require(allowFile)
            ctx.type = 'json'
            ctx.body = sitemapJson
          } catch (_) {}
        }
        ctx.status = 200
        return
      }

      try {
        await koaSend(ctx, filePath, { root: previewTarget })
      } catch (err) {
        if (err.status === 404) {
          await next()
        } else {
          // 500
          console.error('Build Static File Error', err)
          throw err
        }
      }
    })
  }
  return router
}
