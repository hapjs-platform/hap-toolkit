/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createZipBufferFromFileList,
  createFileListFromZipBuffer,
  getFilesOfZipBuffer
} from '../common/ziputil'

import { signZipBufferForPackage } from './index'

export { setRemoteCryptoSignFunction } from './algorithm/signer'

const RpkValidateKey = 'manifest.json'

/**
 * 针对rpk文件的签名
 * @param { ArrayBuffer } fileBuffer 输入文件buffer
 * @param { ArrayBuffer } privateKey 私钥文件
 * @param { ArrayBuffer } certificate 公钥文件
 */
async function signForRpk(fileBuffer, privateKey, certificate) {
  const zipFiles = await getFilesOfZipBuffer(fileBuffer)
  // 验证：必须拥有manifest文件
  if (!zipFiles[RpkValidateKey]) {
    throw new Error(`签名失败：请确认参数为rpk文件！因为其中不存在：${RpkValidateKey}！`)
  }

  const result = await signZipBufferForPackage(fileBuffer, privateKey, certificate)
  return result
}

/**
 * 针对rpks文件的签名
 * @param { ArrayBuffer } fileBuffer 输入文件buffer
 * @param { ArrayBuffer } privateKey 私钥文件
 * @param { ArrayBuffer } certificate 公钥文件
 */
async function signForRpks(fileBuffer, privateKey, certificate) {
  const zipFiles = await getFilesOfZipBuffer(fileBuffer)
  const containsRpkSuffixFile =
    Object.keys(zipFiles).filter((path) => path.endsWith('.rpk')).length > 0
  // 验证：必须拥有rpk后缀文件
  if (!containsRpkSuffixFile) {
    throw new Error(`签名失败：请确认参数为rpks文件！因为其中不存在：rpk后缀文件！`)
  }

  const zipInstWrap = await createFileListFromZipBuffer(fileBuffer)
  let fileList = zipInstWrap.fileList.map(async (file) => {
    const signedBuffer = await signZipBufferForPackage(file.content, privateKey, certificate)
    return {
      path: file.path,
      content: signedBuffer
    }
  })
  fileList = await Promise.all(fileList)
  let rpksBuffer = await createZipBufferFromFileList(fileList, zipInstWrap.comment)
  rpksBuffer = await signZipBufferForPackage(rpksBuffer, privateKey, certificate)
  return rpksBuffer
}

export { signForRpk, signForRpks }
