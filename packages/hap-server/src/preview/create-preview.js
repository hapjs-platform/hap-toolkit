/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import Koa from 'koa'
import mount from 'koa-mount'
import koaStatic from 'koa-static'

import createRouter from './create-router'
import { renderPage } from './shared'

/**
 * 创建一个 preview koa application
 *
 * @param {String} target - 目标目录或rpk/zip文件
 * @returns {undefined}
 */
export default async function createPreview(target) {
  const app = new Koa()
  const previewStaticRoot = path.resolve(__dirname, './static')
  const TPL_404_PATH = path.resolve(__dirname, './views/404.html')

  app.use(mount('/preview-static', koaStatic(previewStaticRoot)))
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      console.error('CreatePreview Error :', err)
      ctx.status = 404
      ctx.type = 'text/html'
      ctx.body = await renderPage(TPL_404_PATH, {
        message: ''
      })
    }
  })
  const router = await createRouter(target)
  app.use(mount('/preview', router.routes(), router.allowedMethods()))
  return app
}
