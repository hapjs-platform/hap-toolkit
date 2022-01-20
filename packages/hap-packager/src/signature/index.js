/*
 * Copyright (c) 2021, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import path from 'path'

import { calcDataDigest } from '../common/utils'

import { DIGEST_ZIP_PATH, DIGEST_HASH_JSON } from '../common/constant'

import { createZipBufferFromFileList, createFileListFromZipBuffer } from '../common/ziputil'

import { doSign } from './algorithm/index'

export const builtinSignFolder = path.join(__dirname, 'pem')

/**
 * 过滤掉文件夹和META文件
 * @param {String} item
 */
function fileFilter(item) {
  const path = item.path
  return !path.endsWith('/') && path !== DIGEST_ZIP_PATH
}

/**
 * 对主包、子包对应生成的ZIP流，分别加签名，也就是：rpk与srpk; rpks不做签名；
 * @param zipBuffer
 * @param privatekey
 * @param certificate
 * @returns {*}
 */
async function signZipBufferForPackage(zipBuffer, privatekey, certificate) {
  // Step1. 解压得到文件列表
  const zipInstWrap = await createFileListFromZipBuffer(zipBuffer)

  // 摘要map
  const fileDigestHash = []
  const fileList = []

  // Step2. 如果包含META-INF/CERT，则对其解压，增加签名
  const metaBuffer = zipInstWrap.getFileBuffer(DIGEST_ZIP_PATH)
  if (metaBuffer) {
    const metaHash = {
      name: DIGEST_HASH_JSON,
      hash: calcDataDigest(metaBuffer)
    }

    const signedMetaBuffer = await doSign(metaBuffer, [metaHash], privatekey, certificate)

    fileList.push({
      path: DIGEST_ZIP_PATH,
      content: signedMetaBuffer
    })

    fileDigestHash.push({
      name: DIGEST_ZIP_PATH,
      hash: calcDataDigest(signedMetaBuffer)
    })
  }

  // Step3. 整个zip做签名
  const files = zipInstWrap.fileList

  files.filter(fileFilter).map(item => {
    fileList.push(item)
    fileDigestHash.push({
      name: item.path,
      hash: calcDataDigest(item.content)
    })
  })

  // 因为META变化，重新创建ZIP流
  const newZipBuffer = await createZipBufferFromFileList(fileList, zipInstWrap.comment)

  // 对新ZIP流重新签名
  const signedZipBuffer = await doSign(newZipBuffer, fileDigestHash, privatekey, certificate)

  return signedZipBuffer
}

export { signZipBufferForPackage }
