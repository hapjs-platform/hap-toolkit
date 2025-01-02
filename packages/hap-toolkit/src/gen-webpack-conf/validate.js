/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'
import AjvErrors from 'ajv-errors'
import manifestSchema from './manifest-schema'
import { colorconsole, KnownError, compileOptionsMeta } from '@hap-toolkit/shared-utils'
import { getSkeletonConfig } from '@hap-toolkit/packager'

// 主包保留名
const MAIN_PKG_NAME = compileOptionsMeta.MAIN_PKG_NAME
// 能使用rpks能力的调试器最低版本
const RPKS_SUPPORT_VERSION_FROM = 1040

/**
 * 验证项目配置正确
 */
export function validateProject(manifestFile, sourceRoot) {
  if (!fs.existsSync(manifestFile)) {
    colorconsole.throw(
      `请确认项目%projectDir%/${sourceRoot}/下存在manifest.json文件：${manifestFile}`
    )
    throw new KnownError(`找不到 ${sourceRoot}/manifest.json`)
  }
}

const docSrc = 'https://doc.quickapp.cn/framework/manifest.html'
/**
 * 校验 app/page/component.json
 *
 * @param {AppInfo} jsonInfo - json 文件内容
 * @param {AppInfo} filePath - json 文件地址
 * @return {Array<Error>}  error 数组
 */
export function validateJson(jsonInfo, filePath) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true })
  AjvErrors(ajv)
  ajv.addKeyword('requireError', {
    validate: function (schema, router) {
      // 纯快应用工程：router 字段下 entry/pages 必填
      // 快应用、卡片混合工程：无需校验 entry/pages 必填性
      // 纯卡片工程：无需校验 entry/pages 必填性
      if (!router.widgets && (!router.entry || !router.pages)) {
        const message = `快应用项目 manifest.json 中，router 字段下 ${JSON.stringify(
          schema
        )} 字段为必填`
        colorconsole.error(message)
      }
      return true
    }
  })
  ajv.validate(manifestSchema, jsonInfo)
  if (!ajv.errors) {
    return []
  }

  const errors = ajv.errors.map((error) => {
    const message =
      `校验 ${filePath} 错误 \n` +
      error.dataPath.split('/').filter(Boolean).join('.') +
      error.message +
      `\n参考: ${docSrc}`
    return new Error(message)
  })

  return errors
}

/**
 * 验证项目的应用全局配置
 * @param {String} src - 项目src
 * @param {Object} manifest - manifest 对象
 * @param {Object} options - compileOptionsObject
 */
export function validateManifest(src, manifest, options) {
  const errors = validateJson(manifest, 'manifest.json')
  errors.forEach((error) => {
    colorconsole.error(error.message)
  })
  const { subpackages } = manifest
  // 验证分包规则
  if (!options.disableSubpackages && subpackages && subpackages.length > 0) {
    validateManifestSubpackages(src, subpackages)
  }
}

/**
 * 检查subpackages字段配置。
 * 除subpackages字段指定的文件是打进非主包外，剩余文件都打进主包
 * 主包与是独立包的非主包，都需要manifest文件
 * @param {object[]} subpackages 分包列表: [{ name, resource, standalone, icon }]
 * @param {string} subpackages[].name 分包名字，必填，不能重复，且不能是"base"（这是主包保留名），只能是 数字字母_ 组成
 * @param {string} subpackages[].resource 分包资源路径，必须为src下文件目录，不能重复，分包间不能有包含关系，只能是 数字字母_ 开头，数字字母_-/ 组成
 * @param {boolean} subpackages[].standalone 是否独立包标识，是独立包则需要manifest文件，缺省为false；
 * @param {boolean} subpackages[].icon 分包icon，是独立包则需要icon，缺省则为应用的icon；
 */
function validateManifestSubpackages(src, subpackages) {
  // 分包名的校验规则
  const nameReg = /^\w+$/
  // 资源名的校验规则
  const resourceReg = /^\w[\w-/]*$/
  // 用以检测分包名是否重复
  const nameList = []
  // 用以检测分包资源路径是否重复
  const resList = []
  // i18n文件目录地址，不能作为分包
  const i18nPath = path.join(src, 'i18n')
  // lottie文件目录地址，不能作为分包
  const lottiePath = path.join(src, 'lottie')
  // 骨架屏文件目录地址，不能作为分包
  const skeletonPath = path.join(src, 'skeleton')
  let name = ''
  let resource = ''

  // 资源路径的具体文件路径
  let resPath = ''
  let index = 0

  /**
   * 检查当前资源路径与已校验过的资源路径是否有包含关系。
   *
   * @param {string} resource - 当前要校验的资源
   * @param {number} index - 当前要校验资源的序号
   * @return {boolean} true/false - 存在/不存在
   */
  function checkPathInclusion(resource, currentIndex) {
    for (let i = 0, l = resList.length; i < l; i++) {
      const _res = resList[i]
      if (resource.startsWith(_res) || _res.startsWith(resource)) {
        colorconsole.throw(
          `第${currentIndex}分包的资源'${resource}'与第${
            i + 1
          }分包的资源'${_res}'有包含关系，请修改`
        )
        return true
      }
    }
    return false
  }

  subpackages.forEach((subpkg, i) => {
    name = subpkg.name
    resource = subpkg.resource
    resPath = resource && path.join(src, resource)
    index = i + 1

    if (!name) {
      colorconsole.throw(`第${index}分包的名字不能为空，请添加`)
    } else if (!nameReg.test(name)) {
      colorconsole.throw(`第${index}分包的名字'${name}'不合法，只能是数字字母下划线组成，请修改`)
    } else if (name === MAIN_PKG_NAME) {
      colorconsole.throw(`第${index}分包的名字'${name}'是主包保留名，请修改`)
    } else if (nameList.indexOf(name) > -1) {
      colorconsole.throw(`第${index}分包的名字'${name}'已存在，请修改`)
    } else {
      nameList.push(name)
    }

    if (!resource) {
      colorconsole.throw(`第${index}分包的资源名不能为空，请添加`)
    } else if (!resourceReg.test(resource)) {
      colorconsole.throw(
        `第${index}分包的资源名'${resource}'不合法，只能是 数字字母_ 开头，数字字母_-/ 组成，请修改`
      )
    } else if (resList.indexOf(resource) > -1) {
      colorconsole.throw(`第${index}分包的资源'${resource}'已被使用，请修改`)
    } else if (!fs.existsSync(resPath)) {
      colorconsole.throw(`第${index}分包的资源'${resource}'，文件目录'${resPath}'不存在，请修改`)
    } else if (resPath === i18nPath) {
      colorconsole.throw(
        `第${index}分包的资源'${resource}'，文件目录'${resPath}'，i18n文件目录不能作为分包，请修改`
      )
    } else if (resPath === lottiePath) {
      colorconsole.throw(
        `第${index}分包的资源'${resource}'，文件目录'${resPath}'，lottie文件目录不能作为分包，请修改`
      )
    } else if (resPath === skeletonPath) {
      colorconsole.throw(
        `第${index}分包的资源'${resource}'，文件目录'${resPath}'，骨架屏文件目录不能作为分包，请修改`
      )
    } else if (!checkPathInclusion(resource, index)) {
      resList.push(resource)
    }

    if (subpkg.standalone && subpkg.icon && !fs.existsSync(path.join(src, subpkg.icon))) {
      colorconsole.throw(`第${index}分包配置的icon不存在，请修改`)
    }

    if (subpkg.standalone && subpkg.banner && !fs.existsSync(path.join(src, subpkg.banner))) {
      colorconsole.throw(`第${index}分包配置的banner不存在，请修改`)
    }
  })
  colorconsole.warn(
    `项目已配置分包，若想使用分包功能，请确保平台版本 >= ${RPKS_SUPPORT_VERSION_FROM}`
  )
}

/**
 * sitemap校验。
 * @param {String} src - 项目src路径
 * @param {Object} manifest - manifest内容
 */
export function validateSitemap(src, manifest) {
  const sitemap = path.join(src, 'sitemap.json')
  if (fs.existsSync(sitemap)) {
    const rules = require(sitemap).rules
    const pages = Object.keys(manifest.router.pages || {})
    rules.forEach((i, idx) => {
      const page = i.page
      if (page !== '*' && !pages.includes(page)) {
        colorconsole.throw(`sitemap rules第${idx + 1}项配置错误，该page不存在：${page}`)
      }
      return page
    })
  }
}

/**
 * 骨架屏文件校验。
 * @param {String} src - 项目src路径packages/hap-toolkit/gen-webpack-conf/validate.js
 * @param {Object} manifest - manifest内容
 */
export function validateSkeleton(src, manifest) {
  const configJson = getSkeletonConfig(src)
  const manifestPages = manifest.router.pages || {}

  if (configJson) {
    const pageDir = path.join(src, 'skeleton/page')
    const singleMap = configJson.singleMap || {}
    const anchorMaps = configJson.anchorMaps || []

    Object.keys(singleMap).forEach((page) => {
      if (!manifestPages[page]) {
        colorconsole.throw(`骨架屏singleMap配置页面 ${page} 在manifest上无定义，请检查`)
      }
      const file = path.join(pageDir, configJson.singleMap[page])
      if (!fs.existsSync(file)) {
        colorconsole.throw(`骨架屏singleMap配置页面 ${page} 的sk文件 ${file} 不存在，请检查`)
      }
    })

    if (!Array.isArray(anchorMaps)) {
      colorconsole.throw(`骨架屏anchorMaps字段值需为数组，请检查`)
    }
    anchorMaps.forEach((mapJson, index) => {
      const { page, skeletonMap } = mapJson
      if (!page) {
        colorconsole.throw(`骨架屏anchorMaps第 ${index + 1} 配置page值不能为空，请检查`)
      }
      if (!manifestPages[page]) {
        colorconsole.throw(
          `骨架屏anchorMaps第 ${index + 1} 配置page值 ${page} 在manifest上无定义，请检查`
        )
      }
      Object.keys(skeletonMap || {}).forEach((anchor) => {
        const file = path.join(pageDir, skeletonMap[anchor])
        if (!fs.existsSync(file)) {
          colorconsole.throw(
            `骨架屏anchorMaps第 ${index + 1} 配置锚点 ${anchor} 的sk文件 ${file} 不存在，请检查`
          )
        }
      })
    })
  }
}

/**
 * 卡片size校验，长宽都需要在['1','2','4','8','FULL','AUTO']范围内，卡片的size格式为['1x1','FULL','AUTO'],数组里面可多个
 * 需要解析长宽并验证都在范围内
 * @param {String} src - 项目src
 * @param {Object} manifest - manifest内容
 */
export function validateCardSize(src, manifest) {
  // 获取卡片配置的路由
  const widgetsConfig = manifest.router.widgets
  if (widgetsConfig) {
    const validateSizeRange = ['1', '2', '4', '8', 'FULL', 'AUTO']
    const keys = Object.keys(widgetsConfig)
    keys.forEach((widgetKey, index) => {
      // 将size字段的x处理拆分
      if (widgetsConfig[widgetKey]['size']) {
        const sizeArr = widgetsConfig[widgetKey]['size'].join(',').replace(/x/g, ',').split(',')
        sizeArr.forEach((size) => {
          if (!validateSizeRange.includes(size)) {
            colorconsole.throw(
              `manifest.json配置的卡片 ${widgetKey} 的size不合规范,长宽都要在['1','2','4','8','FULL','AUTO']范围内`
            )
          }
        })
      }
    })
  }
}
