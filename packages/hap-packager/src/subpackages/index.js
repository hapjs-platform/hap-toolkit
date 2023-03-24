/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIGEST_HASH_JSON, DIGEST_ZIP_PATH } from '../common/constant'

import { createZipBufferFromFileList } from '../common/ziputil'

export { createPackagesDefinition, allocateResourceToPackages } from './service'

/**
 * 整包、子包都调用，生成ZIP流，默认拥有META-INF/CERT文件
 * @param packageInst
 */
async function createZipBufferForPackage(packageInst) {
  const resourceList = packageInst.resourceList

  // Step1. 创建META的ZIP流
  const fileDigestHash = {}
  resourceList.forEach((resourceFile) => {
    const key = resourceFile.fileBuildPath
    fileDigestHash[key] = resourceFile.fileContentDigest.toString('hex')
  })

  const metaFileList = [
    {
      path: DIGEST_HASH_JSON,
      content: JSON.stringify({
        algorithm: 'SHA-256',
        digests: fileDigestHash
      })
    }
  ]
  const metaZipBuffer = await createZipBufferFromFileList(metaFileList)

  // Step2. 创建Package对应的ZIP流
  const packageFileList = []

  packageFileList.push({
    path: DIGEST_ZIP_PATH,
    content: metaZipBuffer
  })

  resourceList.forEach((resourceFile) => {
    packageFileList.push({
      path: resourceFile.fileBuildPath,
      content: resourceFile.fileContentBuffer
    })
  })

  const packageZipBuffer = await createZipBufferFromFileList(packageFileList, packageInst.comment)

  return packageZipBuffer
}

export { createZipBufferForPackage }
