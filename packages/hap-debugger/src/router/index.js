/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import KoaRouter from 'koa-router'
import koaBody from 'koa-body'
import serve from 'koa-static'
import mount from 'koa-mount'

import devtoolsFrontend from '@hap-toolkit/chrome-devtools-frontend'
import { globalConfig } from '@hap-toolkit/shared-utils'

import routes from './routes'
import { createSocketServer } from './wsserver'
import { createADBDebugger } from '../adb'

function applyRouter(app) {
  const router = new KoaRouter()
  app.context.router = router

  app.use(serve(path.resolve(__dirname, '../client')))
  const inspectorRoute = mount('/inspector', serve(devtoolsFrontend.devtoolsPath))
  app.use(inspectorRoute)

  router.get('/', routes.index)
  router.post('/', koaBody(), routes.adapterForBackwardComp)
  router.post('/postwsid', koaBody(), routes.register)
  router.get('/searchsn', koaBody(), routes.searchSn)
  router.post('/poststdbg', koaBody(), routes.startDebug)
  router.post('/saveskeletonfile', koaBody(), routes.saveSkeletonFile)
  router.get('/qrcode', routes.qrCode)

  return router
}

async function beforeStart(server, app) {
  await createSocketServer(server, app)
  const conf = app.context.conf
  const { disableADB } = conf.options
  if (!disableADB) {
    app.context.adbDebugger = createADBDebugger({
      pathClientLog: globalConfig.clientRecordPath,
      localReversePort: conf.defaults.serverPort
    })
    if (process.env.JEST_WORKER_ID) {
      // 测试阶段自动结束 adbDebugger，避免一直轮询
      setTimeout(() => {
        app.context.adbDebugger._stop()
      }, 30 * 1000)
    }
  }
}

export { applyRouter, beforeStart }
