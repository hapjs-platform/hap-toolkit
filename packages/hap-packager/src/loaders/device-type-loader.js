/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs'
import { getOptions } from 'loader-utils'

// add dependencies of device configs so they can be hot reloaded at webpack watch mode
export default function (source) {
  const options = getOptions(this)
  const { srcPath } = options
  let manifestJson = JSON.parse(source.toString())
  const deviceTypeListArray = manifestJson.deviceTypeList || []
  if (deviceTypeListArray.length > 0) {
    deviceTypeListArray.map((deviceType) => {
      const deviceJsonPath = path.join(srcPath, `config-${deviceType}.json`)
      if (fs.existsSync(deviceJsonPath)) {
        this.addDependency(deviceJsonPath)
      }
    })
  }
  return source
}
