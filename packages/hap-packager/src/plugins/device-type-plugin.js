/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from '@jayfate/path'
import { colorconsole } from '@hap-toolkit/shared-utils'
import { mergeDeep } from '../common/utils'

// merge different device configs and manifest.json into full device configs
class DeviceTypePlugin {
  constructor(options = {}) {
    this.options = options || {}
  }

  apply(compiler) {
    const { options } = this
    const { srcPath, buildPath } = options
    const manifestJsonPath = path.join(srcPath, 'manifest.json')
    compiler.hooks.emit.tap('device type plugin', () => {
      try {
        if (fs.existsSync(manifestJsonPath)) {
          const manifestJsonString = fs.readFileSync(manifestJsonPath, 'utf-8')
          const manifestJson = JSON.parse(manifestJsonString.toString())
          const deviceTypeListArray = manifestJson.deviceTypeList || []
          if (deviceTypeListArray.length > 0) {
            deviceTypeListArray.map((deviceType) => {
              const deviceJsonPath = path.join(srcPath, `config-${deviceType}.json`)
              if (fs.existsSync(deviceJsonPath)) {
                const deviceJsonString = fs.readFileSync(deviceJsonPath, 'utf-8')
                if (deviceJsonString.length > 0) {
                  const deviceJson = JSON.parse(deviceJsonString)
                  const mergedDeviceJson = mergeDeep({}, manifestJson, deviceJson)
                  const mergeDeviceJsonString = JSON.stringify(mergedDeviceJson, null, 2)
                  const buildFilePath = path.join(buildPath, `manifest-${deviceType}.json`)
                  fs.writeFileSync(buildFilePath, mergeDeviceJsonString)
                }
              } else {
                colorconsole.warn(
                  `"config-${deviceType}.json"在src目录下不存在, 请检查你的项目代码与manifest.json的deviceTypeList数组是否正确`
                )
              }
            })
          }
        }
      } catch (error) {
        colorconsole.error(`编译设备config.json出现错误，错误信息: ${error.message}`)
      }
    })
  }
}

module.exports = DeviceTypePlugin
