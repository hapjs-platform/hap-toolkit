/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { colorconsole } from '@hap-toolkit/shared-utils'

import { SINGLE_PKG_SIZE, FULL_PKG_SIZE } from '../common/constant'

import { createZipBufferFromFileList, removeMetaForRpkOrRpksFile } from '../common/ziputil'

import { signZipBufferForPackage, createAndSignBuffer } from '../signature/index'

import {
  createPackagesDefinition,
  allocateResourceToPackages,
  createZipBufferForPackage
} from '../subpackages/index'

function validateRpkOrSrpkFile(subPackageBufferList, subPackages) {
  // 全部子包的体积
  let subPkgSizeSum = 0

  subPackageBufferList.forEach((subPackageBufferItem, i) => {
    const subPackageItem = subPackages[i]
    const rpkBuildFileName = `${subPackageItem.fileName}`

    // 检查分包大小
    const size = subPackageBufferItem.length
    subPkgSizeSum += size
    colorconsole.log(`### App Loader ### '${rpkBuildFileName}' 大小为 ${Math.ceil(size / 1024)} KB`)
    if (size > SINGLE_PKG_SIZE) {
      colorconsole.warn(
        `### App Loader ### 每个分包大小不能大于 ${
          SINGLE_PKG_SIZE / 1024
        } KB, '${rpkBuildFileName}' 已超出`
      )
    }
  })
  // 检查分包总和大小
  if (subPkgSizeSum > FULL_PKG_SIZE) {
    colorconsole.warn(
      `### App Loader ### 所有分包总和大小不能大于 ${FULL_PKG_SIZE / 1024} KB, 已超出`
    )
  }
}

/**
 * debugger模式下快速构建
 */
async function buildDebugModeProjectAndOutput(
  fullPackage,
  subPackages = [],
  signConfig,
  disableStreamPack
) {
  const { privatekey, certificate } = signConfig
  const hasSubPackages = subPackages.length

  let fullPackageBuffer

  // Step1. 生成整包rpk
  if (!hasSubPackages) {
    fullPackageBuffer = await createAndSignBuffer(fullPackage, privatekey, certificate)
  }

  // Step2. 生成子包srpk
  let subPackageBuffers = await Promise.all(
    (subPackages || []).map((subPackageItem) =>
      createAndSignBuffer(subPackageItem, privatekey, certificate)
    )
  )

  // Step3. 默认携带META，如果禁用流失打包，需要删除META
  if (disableStreamPack) {
    if (!hasSubPackages) {
      fullPackageBuffer = await removeMetaForRpkOrRpksFile(fullPackageBuffer)
    }
    subPackageBuffers = await Promise.all(subPackageBuffers.map(removeMetaForRpkOrRpksFile))
  }

  // Step5. 校验体积等
  validateRpkOrSrpkFile(subPackageBuffers, subPackages)

  // Step6. 生成rpks：不需要META和签名
  let rpksBuffer = null

  if (subPackageBuffers.length) {
    const rpksFileList = []

    // 添加各个子包
    subPackageBuffers.forEach((buffer, index) => {
      const fileBuildPath = subPackages[index].fileName
      rpksFileList.push({
        path: fileBuildPath,
        content: buffer
      })
    })
    rpksBuffer = await createZipBufferFromFileList(rpksFileList, fullPackage.comment)
  }

  return {
    rpkBuffer: fullPackageBuffer,
    rpksBuffer
  }
}

/**
 * 编译项目产出文件
 * @param {Package} fullPackage
 * @param {Package[]} subPackages
 * @param {object} signConfig 无签名时为false
 * @param {ArrayBuffer} signConfig.privatekey 私钥文件内容
 * @param {ArrayBuffer} signConfig.certificate 公钥文件内容
 * @param {Boolean} disableStreamPack 禁止流式加载
 * @param {Boolean} watchMode 是否watch启动
 */
async function buildProjectAndOutput(
  fullPackage,
  subPackages,
  signConfig,
  disableStreamPack,
  watchMode
) {
  // 如果是watch模式，走快速编译的模式
  if (watchMode) {
    return buildDebugModeProjectAndOutput.apply(null, arguments)
  }

  // Step1. 生成整包rpk
  let fullPackageBuffer = await createZipBufferForPackage(fullPackage)

  // Step2. 生成子包srpk
  let subPackageBuffers = await Promise.all(
    (subPackages || []).map((subPackageItem) => createZipBufferForPackage(subPackageItem))
  )

  // Step3. 默认携带META，如果禁用流失打包，需要删除META
  if (disableStreamPack) {
    fullPackageBuffer = await removeMetaForRpkOrRpksFile(fullPackageBuffer)
    subPackageBuffers = await Promise.all(subPackageBuffers.map(removeMetaForRpkOrRpksFile))
  }

  // Step4. 是否需要增加签名逻辑
  if (signConfig) {
    const { privatekey, certificate } = signConfig
    fullPackageBuffer = await signZipBufferForPackage(fullPackageBuffer, privatekey, certificate)
    subPackageBuffers = await Promise.all(
      subPackageBuffers.map((item) => signZipBufferForPackage(item, privatekey, certificate))
    )
  }

  // Step5. 校验体积等
  validateRpkOrSrpkFile(subPackageBuffers, subPackages)

  // Step6. 生成rpks：不需要META和签名
  let rpksBuffer = null

  if (subPackageBuffers.length) {
    const rpksFileList = []

    // 添加整包
    rpksFileList.push({
      path: fullPackage.fileName,
      content: fullPackageBuffer
    })

    // 添加各个子包
    subPackageBuffers.forEach((buffer, index) => {
      const fileBuildPath = subPackages[index].fileName
      rpksFileList.push({
        path: fileBuildPath,
        content: buffer
      })
    })

    rpksBuffer = await createZipBufferFromFileList(rpksFileList, fullPackage.comment)
    if (signConfig) {
      const { privatekey, certificate } = signConfig
      rpksBuffer = await signZipBufferForPackage(rpksBuffer, privatekey, certificate)
    }
  }

  // 7. 返回
  return {
    rpkBuffer: fullPackageBuffer,
    rpksBuffer
  }
}

export {
  createPackagesDefinition,
  allocateResourceToPackages,
  createZipBufferForPackage,
  buildProjectAndOutput,
  buildDebugModeProjectAndOutput
}
