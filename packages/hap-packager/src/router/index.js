/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'

import routes from './routes'

function applyRouter(app) {
  app.use(routes.logger)
  // 代码覆盖率工具的请求会较大
  app.use(
    bodyParser({
      jsonLimit: '50mb'
    })
  )

  const router = new KoaRouter()
  router.get('/', routes.index)
  router.get('/bundle', routes.bundle)
  router.get('/notify', routes.notify)

  router.post('/coverage', routes.saveDataCoverage)
  router.post('/data/log/save', routes.saveDataLogs)
  return router
}

module.exports = {
  applyRouter
}
