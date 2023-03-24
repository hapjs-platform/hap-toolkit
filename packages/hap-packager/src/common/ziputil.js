/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import JSZip from 'jszip'

import { COMPRESS_OPTS, DIGEST_ZIP_DIR } from './constant'

/**
 * 根据文件列表创建ZIP流
 * @param fileList {array}
 * @param fileList[].path {string} 文件路径
 * @param fileList[].content {Buffer|string} 文件内容
 * @param comment
 */
async function createZipBufferFromFileList(fileList, comment = null) {
  const zipInst = new JSZip()

  fileList.forEach((fileItem) => {
    if (!fileItem.path || !fileItem.content) {
      throw new Error(`### App Loader ### 创建ZIP流时的文件路径或内容不能为空：${fileItem}`)
    }
    zipInst.file(fileItem.path, fileItem.content)
  })

  const zipBuffer = await zipInst.generateAsync({
    ...COMPRESS_OPTS,
    comment
  })

  return zipBuffer
}

/**
 * 根据ZIP流获取文件实例
 * @param zipBuffer { ArrayBuffer }
 */
async function createFileListFromZipBuffer(zipBuffer) {
  const zipInst = await JSZip.loadAsync(zipBuffer, COMPRESS_OPTS)

  async function iterator(filePath) {
    const content = await zipInst.files[filePath].async('nodebuffer')
    return {
      path: filePath,
      content: content
    }
  }

  const fileList = await Promise.all(Object.keys(zipInst.files).map(iterator))

  return {
    fileList: fileList,
    comment: zipInst.comment,
    getFileBuffer(path) {
      let buffer = fileList.find((item) => item.path === path)
      if (buffer) {
        buffer = buffer.content
      }
      return buffer
    }
  }
}

/**
 * 删除ZIP中的META文件
 * @param zipBuffer
 * @returns {*}
 */
async function removeMetaForRpkOrRpksFile(zipBuffer) {
  // 解压得到文件列表
  const zipInst = await JSZip.loadAsync(zipBuffer, COMPRESS_OPTS)
  // 删除META
  zipInst.remove(DIGEST_ZIP_DIR)
  // 重新生成
  const retZipBuffer = await zipInst.generateAsync(COMPRESS_OPTS)

  return retZipBuffer
}

/**
 * 获取ZIP内容的文件对象
 * @param zipBuffer
 */
async function getFilesOfZipBuffer(zipBuffer) {
  const zipInst = await JSZip.loadAsync(zipBuffer, COMPRESS_OPTS)
  return zipInst.files
}

export {
  createZipBufferFromFileList,
  createFileListFromZipBuffer,
  removeMetaForRpkOrRpksFile,
  getFilesOfZipBuffer
}
