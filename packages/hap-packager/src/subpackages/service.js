/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from '@jayfate/path'

import { compileOptionsMeta } from '@hap-toolkit/shared-utils/compilation-config'
import { calcDataDigest } from '../common/utils'
import { createFullPackage, createSubPackages } from './package'
import { BUILD_INFO_FILE } from '../common/constant'

const MAIN_PKG_NAME = compileOptionsMeta.MAIN_PKG_NAME
const SPLIT_CHUNKS_PAGE_NAME = compileOptionsMeta.splitChunksNameEnum.PAGE

/**
 * 创建完整包和分包列表
 * @param appPackageName
 * @param subpackageOptions
 * @param appIcon
 * @param comment
 * @param banner (optional)
 * @returns {{fullPackage: Package, subPackages: *}}
 */
function createPackagesDefinition(
  appPackageName,
  subpackageOptions,
  appIcon,
  comment,
  banner = ''
) {
  const fullPackage = createFullPackage(appPackageName)
  let subPackages
  if (subpackageOptions && subpackageOptions.length > 0) {
    subPackages = createSubPackages(appPackageName, subpackageOptions, appIcon, banner)
  }

  // 注释
  fullPackage.comment = comment
  ;(subPackages || []).forEach((subPackageItem) => {
    subPackageItem.comment = comment
  })

  return {
    fullPackage,
    subPackages
  }
}

// 生成埋点统计文件资源
function getBuildInfoResource(buildInfo) {
  buildInfo = JSON.parse(buildInfo)
  const content = Object.keys(buildInfo)
    .map((key) => {
      return key + '=' + buildInfo[key]
    })
    .join('\n')
  const buildPath = BUILD_INFO_FILE
  const buf = Buffer.from(content)
  const digest = calcDataDigest(buf)
  return [buildPath, buf, digest]
}

/**
 * 将各资源分派给各个要打出来的包，包括digest, hashList, 以及实际的文件内容fileContentBuffer
 * @param {String[]} files 文件列表
 * @param {String} base 文件相对的目录
 * @param {Package} fullPackage 整包
 * @param {Package[]} subPackages 分包列表
 * @param {String} buildInfo 打包信息
 */
function allocateResourceToPackages(files, base, fullPackage, subPackages, buildInfo) {
  const belongTofullPkgReg = new RegExp(`^${SPLIT_CHUNKS_PAGE_NAME}$`)
  const belongTofSubPkgReg = new RegExp(`\\/${SPLIT_CHUNKS_PAGE_NAME}$`)
  const basePageChunksJson = path.join(MAIN_PKG_NAME, SPLIT_CHUNKS_PAGE_NAME)

  files.forEach((fileBuildPath) => {
    const fileAbsPath = path.join(base, fileBuildPath)
    const fileContentBuffer = fs.readFileSync(fileAbsPath)
    const fileContentDigest = calcDataDigest(fileContentBuffer)
    // 资源基本信息
    const resourceInfo = [fileBuildPath, fileContentBuffer, fileContentDigest]

    // 整包需要所有文件，不包括分包的独立page-chunks.json文件
    if (!belongTofSubPkgReg.test(fileBuildPath)) {
      fullPackage.addResource(...resourceInfo)
    }

    // 最顶级的page-chunks.json只属于整包
    if (!subPackages || belongTofullPkgReg.test(fileBuildPath)) {
      return
    }
    // 标志此资源是否属于主包，需要放入主包
    let belongToBasePkg = true

    // 将base包的page-chunks.json文件放在包根路径，其余在分包目录下
    if (fileBuildPath === basePageChunksJson) {
      resourceInfo[0] = SPLIT_CHUNKS_PAGE_NAME
    }

    // 遍历除主包整包外的分包，判断此文件是否属于某个分包的
    for (let i = 1; i < subPackages.length; i++) {
      const pkg = subPackages[i]
      // 如果此分包是个独立包，则需要加入manifest || sitemap.json || i18n || icon || banner || lottie 文件，每个包都需要
      if (
        pkg.standalone &&
        (fileBuildPath === 'manifest.json' ||
          fileBuildPath === 'sitemap.json' ||
          fileBuildPath.startsWith('i18n') ||
          fileBuildPath.startsWith('lottie') ||
          (pkg.icon && pkg.icon.indexOf(fileBuildPath) > 0) ||
          (pkg.banner && pkg.banner.indexOf(fileBuildPath) > 0))
      ) {
        pkg.addResource(...resourceInfo)
      }

      if (pkg.subMatch.test(fileBuildPath)) {
        belongToBasePkg = false
        pkg.addResource(...resourceInfo)
        // 此资源已属于这个分包，无需循环下一轮
        break
      }
    }
    if (belongToBasePkg) {
      const basePkg = subPackages[0]
      basePkg.addResource(...resourceInfo)
    }
  })
  // 把埋点文件添加进整包和主包
  if (buildInfo) {
    const trackResource = getBuildInfoResource(buildInfo)
    fullPackage.addResource(...trackResource)
    subPackages && subPackages[0].addResource(...trackResource)
  }
  // 判断每个包的资源是否为空，如果为空抛出异常，停止打包
  if (subPackages) {
    subPackages.forEach((item) => {
      const resource = item.resourceList
      if (!resource.length) {
        throw new Error(`分包失败：分包${item.fileName}内不包含任何资源，请重新检查manifest`)
      }
    })
  }
}

export { createPackagesDefinition, allocateResourceToPackages }
