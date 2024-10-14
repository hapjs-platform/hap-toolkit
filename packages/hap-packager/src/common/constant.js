/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// 文件摘要包（zip 文件）
const DIGEST_ZIP_PATH = 'META-INF/CERT'

// 摘要文件夹
const DIGEST_ZIP_DIR = 'META-INF'

// 打包信息文件
const BUILD_INFO_FILE = DIGEST_ZIP_DIR + '/build.txt'
// 文件列表摘要的名称
const DIGEST_HASH_JSON = 'hash.json'
// 分包的大小上限 1MB
const SINGLE_PKG_SIZE = 1024 * 1024
// 整包的大小上限 4MB
const FULL_PKG_SIZE = SINGLE_PKG_SIZE * 4

// 压缩参数，设置输出 buffer，以便对 buffer 进行操作
const COMPRESS_OPTS = {
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: {
    level: 9
  }
}

const LOADER_PATH_UX = {
  path: '/ux-loader.js',
  type: 'ux'
}

/**
 * loader path
 */
const LOADER_INFO_LIST = [
  LOADER_PATH_UX,
  {
    path: '/template-loader.js',
    type: 'template'
  },
  {
    path: '/style-loader.js',
    type: 'styles'
  },
  {
    path: '/script-loader.js',
    type: 'script'
  },
  {
    path: '/data-loader.js',
    type: 'data'
  },
  {
    path: '/action-loader.js',
    type: 'actions'
  },
  {
    path: '/props-loader.js',
    type: 'props'
  }
]

export {
  DIGEST_ZIP_PATH,
  DIGEST_ZIP_DIR,
  DIGEST_HASH_JSON,
  SINGLE_PKG_SIZE,
  FULL_PKG_SIZE,
  COMPRESS_OPTS,
  BUILD_INFO_FILE,
  LOADER_PATH_UX,
  LOADER_INFO_LIST
}
