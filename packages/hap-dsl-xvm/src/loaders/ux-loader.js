/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from 'path'
import loaderUtils from 'loader-utils'
import { parseFragmentsWithCache, ENTRY_TYPE, templater } from '@hap-toolkit/compiler'
import { globalConfig, compileOptionsObject } from '@hap-toolkit/shared-utils'

import {
  processImportFrag,
  processTemplateFrag,
  processStyleFrag,
  processScriptFrag,
  parseImportList
} from './ux-fragment-utils'
import { getNameByPath, print, isUXRender } from './common/utils'

const { validator } = templater

/**
 * 收集结果
 * @param $loader
 * @param frags
 * @param name
 * @param uxType
 * @return {String}
 */
function assemble($loader, frags, name, uxType) {
  const isUseTreeShaking = !!globalConfig.useTreeShaking
  // 外部导入的组件列表
  const importNames = []
  // 处理导入的组件
  const importFrag = processImportFrag($loader, frags.import, importNames)

  let moduleExports = `     $app_script$($app_module$, $app_exports$, $app_require$)
        if ($app_exports$.__esModule && $app_exports$.default) {
          $app_module$.exports = $app_exports$.default
        }`
  if (isUseTreeShaking) {
    moduleExports = `
        if($app_script$.default) {
          $app_module$.exports = $app_script$.default
        }`
  }
  if (frags.script.length <= 0) {
    moduleExports = ''
  }

  // prettier-ignore
  let content = 
  `${importFrag}\n` +
  `var $app_style$ = ${processStyleFrag($loader, frags.style, uxType)}\n` +
  `var $app_script$ = ${processScriptFrag($loader, frags.script, uxType)}\n` +
  `$app_define$('@app-component/${name}', [], function($app_require$, $app_exports$, $app_module$) {\n` +
  `${moduleExports}\n` +
  `    $app_module$.exports.template = ${processTemplateFrag($loader, frags.template, uxType, importNames)}\n` +
  `${frags.style.length > 0 ? '    $app_module$.exports.style = $app_style$;': ''}\n` +
  `});\n` +
  `${isUXRender(uxType) ? `$app_bootstrap$('@app-component/${name}',{ packagerVersion: QUICKAPP_TOOLKIT_VERSION })` : ''};`

  if (uxType === ENTRY_TYPE.COMP && compileOptionsObject.enableLazyComponent) {
    content += `$app_define_wrap$('@app-component/${name}', function () {
    })`
  }
  content = content.replace(/\n[ \n]*\n/gm, '\n')
  return content
}

/**
 * ux文件解析总入口
 * @param source
 */
export default function uxLoader(source) {
  const callback = this.async()

  // /root/sample/src/component/basic/image/index.ux
  const resourcePath = this.resourcePath // 当前文件绝对路径
  const key = path.relative(globalConfig.SRC_DIR, resourcePath.replace(/\.ux$/, '.js'))
  globalConfig.changedJS[key] = true

  const { ext } = path.parse(resourcePath)

  if (['.mix', '.ux'].indexOf(ext) === -1) {
    callback(new Error(`未知文件格式：${ext}`))
    return
  }
  const resourceQuery = loaderUtils.parseQuery(this.resourceQuery || '?') // 在文件url中传入的参数'path?xxx'
  // 文件类型
  const uxType = resourceQuery.uxType

  // 使用原有文件名（不包含扩展名）
  const name = resourceQuery.name || getNameByPath(resourcePath)

  if (validator.isReservedTag(name)) {
    this.emitWarning(new Error('脚本文件名不能使用保留字:' + name))
  }

  print({
    resourceQuery: this.resourceQuery,
    resourcePath: resourcePath,
    name: name
  })

  // 解析模板，提取各个类型的节点和依赖组件列表
  const frags = parseFragmentsWithCache(source, resourcePath)
  print(frags)

  parseImportList(this, frags.import)
    .then(() => {
      return assemble(this, frags, name, uxType)
    })
    .then((result) => {
      callback(null, result)
    })
    .catch((err) => {
      callback(err, '')
    })
}
