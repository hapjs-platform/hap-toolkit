/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import loaderUtils from 'loader-utils'
import { parseFragmentsWithCache } from '@hap-toolkit/compiler'
import validator from '@hap-toolkit/compiler/lib/template/validator'
import { compileOptionsObject } from '@hap-toolkit/shared-utils/compilation-config'

import {
  processImportFrag,
  processTemplateFrag,
  processStyleFrag,
  processScriptFrag,
  parseImportList
} from './ux-fragment-utils'
import { getNameByPath, print, ENTRY_TYPE, isUXRender } from './common/utils'

const globalConfig = require('@hap-toolkit/shared-utils/config')

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
  const outputs = []

  const { enablePerformanceCheck } = compileOptionsObject
  // 外部导入的组件列表
  const importNames = []

  if (enablePerformanceCheck) {
    outputs.push(`console.record('### App Performance ### 执行自定义组件模块[PERF:RPK:defineCustomCompModule(${name})]开始：' + new Date().toJSON())
    console.time('PERF:RPK:defineCustomCompModule(${name})')
    console.time('PERF:RPK:defineCustomCompImport(${name})')`)
  }

  // 处理导入的组件
  outputs.push(processImportFrag($loader, frags.import, importNames))

  if (enablePerformanceCheck) {
    outputs.push(`console.timeEnd('PERF:RPK:defineCustomCompImport(${name})')`)
  }

  // 处理样式
  outputs.push(`var $app_style$ = ${processStyleFrag($loader, frags.style, uxType)}`)

  if (enablePerformanceCheck) {
    outputs.push(`console.time('PERF:RPK:defineCustomCompScript(${name})')`)
  }

  // 处理脚本
  outputs.push(`var $app_script$ = ${processScriptFrag($loader, frags.script, uxType)}`)

  if (enablePerformanceCheck) {
    outputs.push(`console.timeEnd('PERF:RPK:defineCustomCompScript(${name})')
    onsole.record('### App Performance ### 定义自定义组件函数[PERF:RPK:appDefineCustomCompFn(${name})]开始：' + new Date().toJSON())
    console.time('PERF:RPK:appDefineCustomCompFn(${name})')`)
  }
  outputs.push(
    `$app_define$('@app-component/${name}', [], function($app_require$, $app_exports$, $app_module$) {`
  )
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
  if (frags.script.length > 0) {
    outputs.push(moduleExports)
  }
  // require('template-loader!./page.ux?uxType=page')
  outputs.push(
    `     $app_module$.exports.template = ${processTemplateFrag(
      $loader,
      frags.template,
      uxType,
      importNames
    )}`
  )
  if (frags.style.length > 0) {
    outputs.push(`     $app_module$.exports.style = $app_style$`)
  }
  outputs.push('})')

  if (enablePerformanceCheck) {
    outputs.push(`
    console.record('### App Performance ### 定义自定义组件函数[PERF:RPK:appDefineCustomCompFn(${name})]结束：' + new Date().toJSON())
    console.timeEnd('PERF:RPK:appDefineCustomCompFn(${name})')`)
  }

  if (isUXRender(uxType)) {
    if (enablePerformanceCheck) {
      outputs.push(`console.record('### App Performance ### 启动页面自定义组件[PERF:RPK:appBootstrapCustomCompFn(${name})]开始：' + new Date().toJSON())
      console.time('PERF:RPK:appBootstrapCustomCompFn(${name})')`)
    }

    // 页面入口文件
    outputs.push(
      `$app_bootstrap$('@app-component/${name}',{ packagerVersion: QUICKAPP_TOOLKIT_VERSION })`
    )

    if (enablePerformanceCheck) {
      outputs.push(`console.record('### App Performance ### 启动页面自定义组件[PERF:RPK:appBootstrapCustomCompFn(${name})]结束：' + new Date().toJSON())
      console.timeEnd('PERF:RPK:appBootstrapCustomCompFn(${name})')`)
    }
  }

  if (uxType === ENTRY_TYPE.COMP && compileOptionsObject.enableLazyComponent) {
    if (enablePerformanceCheck) {
      outputs.push(`console.record('### App Performance ### 定义自定义组件封装[PERF:RPK:appDefineWrapCustomCompFn(${name})]开始：' + new Date().toJSON())
      console.time('PERF:RPK:appDefineWrapCustomCompFn(${name})')`)
    }

    outputs.unshift(`$app_define_wrap$('@app-component/${name}', function () {`)
    outputs.push('})')

    if (enablePerformanceCheck) {
      outputs.push(`
      console.record('### App Performance ### 定义自定义组件封装[PERF:RPK:appDefineWrapCustomCompFn(${name})]结束：' + new Date().toJSON())
      console.timeEnd('PERF:RPK:appDefineWrapCustomCompFn(${name})')`)
    }
  }

  if (enablePerformanceCheck) {
    outputs.push(`console.record('### App Performance ### 执行自定义组件模块[PERF:RPK:defineCustomCompModule(${name})]结束：' + new Date().toJSON())
    console.timeEnd('PERF:RPK:defineCustomCompModule(${name})')`)
  }
  return outputs.join('\n')
}

/**
 * ux文件解析总入口
 * @param source
 */
function loader(source) {
  const callback = this.async()

  const resourcePath = this.resourcePath // 当前文件绝对路径

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

module.exports = loader
