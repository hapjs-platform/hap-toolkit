/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 分包所有的类定义
 * @param options
 * @constructor
 */
class Package {
  constructor(options) {
    // 包前缀
    this.filePrefix = null
    // 子包名称；整包没有
    this.fileSubname = null
    // 后缀名
    this.fileSuffix = null
    // icon
    this.icon = ''
    // banner（可选）
    this.banner = ''
    // 注释
    this.comment = null
    // 是否为独立包
    this.standalone = false
    // 资源路径匹配
    this.subMatch = null
    // 打包文件列表
    this._resourceList = []

    this._widget = false

    Object.assign(this, options)

    const path = [this.fileSubname, this.fileSuffix].filter((i) => i !== null).join('.')
    this.fileName = `${this.filePrefix}${this._widget ? '_' : '.'}${path}`
  }

  addResource(fileBuildPath, fileContentBuffer, fileContentDigest) {
    if (this._resourceList[fileBuildPath]) {
      throw new Error(`### App Loader ### ${fileBuildPath} 文件重复添加`)
    }
    this._resourceList[fileBuildPath] = true
    // 先把文件buff存起来，后续无需再读取
    this._resourceList.push({
      fileBuildPath,
      fileContentBuffer,
      fileContentDigest
    })
  }

  get resourceList() {
    return this._resourceList
  }
}

export default Package

/**
 * 创建完整包定义，整包可以理解为独立的子包
 * @param appPackageName
 * @returns {Package}
 */
function createFullPackage(appPackageName) {
  return new Package({
    filePrefix: appPackageName,
    fileSuffix: 'rpk',
    standalone: true
  })
}

// 主包保留名
const MAIN_PACKAGE_SUBNAME = 'base'

/**
 * 创建分包列表
 * @param appPackageName {string}
 * @param subpackages {Array} manifest的subpackages字段的内容
 * @param appIcon {string}
 * @param banner {string} (optional)
 * @returns {Package[]}  - 返回创建的分包列表
 */
function createSubPackages(appPackageName, subpackages, appIcon, banner = '') {
  // 分包列表
  let subPackages
  subPackages = []
  // 第一位为主包, 除了分包所属资源，剩余资源都是主包的
  const basePkg = new Package({
    filePrefix: appPackageName,
    fileSubname: MAIN_PACKAGE_SUBNAME,
    fileSuffix: 'srpk',
    standalone: true
  })
  subPackages.push(basePkg)

  subpackages.forEach((subpkg) => {
    const partPkg = new Package({
      filePrefix: appPackageName,
      fileSubname: subpkg.name,
      _widget: subpkg._widget,
      fileSuffix: subpkg._widget ? 'rpk' : 'srpk',
      subMatch: new RegExp(`^${subpkg.resource}/.*`, 'i'),
      standalone: subpkg.standalone || false,
      icon: subpkg.standalone ? subpkg.icon || appIcon : '',
      banner: subpkg.standalone ? subpkg.banner || banner : ''
    })
    subPackages.push(partPkg)
  })
  return subPackages
}

export { createFullPackage, createSubPackages }
