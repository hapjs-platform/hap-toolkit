/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import mount from 'koa-mount'
import globalConfig from '@hap-toolkit/shared-utils/config'
import createPrview from './create-preview'

async function beforeStart(server, app) {
  // build 目录提供静态资源
  const buildDir = path.resolve(globalConfig.projectPath, globalConfig.outputPath)
  const previewApp = await createPrview(buildDir)
  app.use(mount('/', previewApp))
}

module.exports = {
  beforeStart
}
