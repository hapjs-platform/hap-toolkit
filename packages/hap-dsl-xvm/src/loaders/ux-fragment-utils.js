/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import globalConfig from '@hap-toolkit/shared-utils/config'
import { compileOptionsObject } from '@hap-toolkit/shared-utils/compilation-config'
import validator from '@hap-toolkit/compiler/lib/template/validator'
import { getBabelConfigJsPath } from '@hap-toolkit/packager/lib'

import {
  stringifyLoaders,
  makeRequireString,
  getNameByPath,
  print,
  ENTRY_TYPE,
  FRAG_TYPE,
  isUXRender
} from './common/utils'

// 项目目录
const cwd = path.resolve(globalConfig.projectPath)

const defaultLoaders = {
  // common
  component: require.resolve('./ux-loader.js'),
  fragment: require.resolve('./fragment-loader.js'),
  template: require.resolve('./template-loader.js'),
  style: require.resolve('./style-loader.js'),
  script: require.resolve('./script-loader.js'),
  module: require.resolve('@hap-toolkit/packager/lib/loaders/module-loader.js'),
  babel: require.resolve('babel-loader'),
  // app
  mainfest: require.resolve('./manifest-loader.js'),
  // page
  access: require.resolve('./access-loader.js'),
  'extract-css': require.resolve('./extract-css-loader.js')
}

/**
 * 生成loader请求代码
 * @param type
 * @param config
 * @param uxType
 * @returns {*}
 */
function makeLoaderString(type, config, uxType) {
  config = config || {}
  let loaders

  if (type === FRAG_TYPE.IMPORT) {
    loaders = [
      {
        name: defaultLoaders.component,
        query: {
          cwd,
          type: FRAG_TYPE.IMPORT
        }
      }
    ]
    return stringifyLoaders(loaders)
  }

  if (type === FRAG_TYPE.TEMPLATE) {
    loaders = [
      {
        name: defaultLoaders.template
      }
    ]
    if (!config.alone) {
      // 如果<template>不是单独文件，则需要提取
      loaders.push({
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.TEMPLATE
        }
      })
    }
    return stringifyLoaders(loaders)
  }

  if (type === FRAG_TYPE.STYLE) {
    loaders = [
      {
        name: defaultLoaders.style,
        query: {
          index: 0,
          type: FRAG_TYPE.STYLE
        }
      }
    ]

    compileOptionsObject.enableExtractCss &&
      loaders.unshift({
        name: defaultLoaders['extract-css']
      })

    let lang = config.lang
    if (lang && lang !== 'css') {
      // scss 需要的是 sass-loader
      lang = lang === 'scss' ? 'sass' : lang
      loaders.push({
        name: `${lang}-loader`
      })
    }

    if (!config.alone) {
      // 如果<style>不是单独文件，则需要提取
      loaders.push({
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.STYLE
        }
      })
    }
    return stringifyLoaders(loaders)
  }

  if (type === FRAG_TYPE.SCRIPT) {
    const configFile = getBabelConfigJsPath(cwd, !!globalConfig.useTreeShaking)
    loaders = []

    if (compileOptionsObject.enableIstanbul) {
      loaders.push({
        name: 'istanbul-instrumenter-loader',
        query: {}
      })
    }

    loaders.push(
      {
        name: defaultLoaders.script
      },
      {
        name: defaultLoaders.module
      }
    )
    if (uxType === ENTRY_TYPE.APP) {
      loaders.push(
        {
          name: defaultLoaders.mainfest,
          query: {
            path: path.dirname(config.path)
          }
        },
        {
          name: require.resolve('babel-loader'),
          query: {
            cwd,
            cacheDirectory: true,
            comments: false,
            configFile
          }
        }
      )
      compileOptionsObject.enableDiagnosis &&
        loaders.push({
          name: require.resolve('@hap-toolkit/packager/lib/loaders/diagnosis-loader.js'),
          query: {
            pureScript: true,
            hookName: 'onCreate',
            hostName: compileOptionsObject.enableDiagnosis
          }
        })
    } else {
      loaders.push({
        name: require.resolve('babel-loader'),
        query: {
          cwd,
          cacheDirectory: true,
          plugins: [path.resolve(require.resolve('./babel-plugin-jsx.js'))],
          comments: false,
          configFile
        }
      })
      if (isUXRender(uxType)) {
        loaders.push({
          name: defaultLoaders.access
        })
      }
    }

    if (!config.alone) {
      // 如果<script>不是单独文件，则需要提取
      loaders.push({
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.SCRIPT
        }
      })
    }

    compileOptionsObject.enableE2e &&
      loaders.push({
        name: require.resolve('@hap-toolkit/packager/lib/loaders/inject-suite-loader.js'),
        query: {
          hookName: 'onCreate'
        }
      })

    return stringifyLoaders(loaders)
  }
}

/**
 * 处理import片段
 * @param $loader
 * @param imports - 外部导入的组件列表
 * @param importNames - 外部导入的组件名列表
 * @returns {string}
 */
function processImportFrag($loader, imports, importNames) {
  let retStr = ''
  if (imports.length) {
    for (let i = 0; i < imports.length; i++) {
      const imp = imports[i]
      let importSrc = imp.attrs.src
      let importName = imp.attrs.name
      if (!importSrc) {
        $loader.emitWarning(new Error('导入组件需要设置属性 `src` '))
        return ''
      }

      if (!imp.isValid) {
        $loader.emitError(new Error(`导入组件resolve 出错 ${imp.err}`))
        return ''
      }

      // 合法并赋值最终路径
      importSrc = imp.srcPath

      // 如果没有指定name，则从src中提取
      if (!importName) {
        importName = getNameByPath(importSrc)
      }
      // 全部转化为小写
      importName = importName.toLowerCase()
      if (validator.isReservedTag(importName)) {
        $loader.emitWarning(new Error('导入组件的属性 `name` 不能使用保留字: ' + importName))
      }

      importNames.push(importName)

      print({
        name: importName,
        src: importSrc
      })

      let reqStr = makeRequireString(
        $loader,
        makeLoaderString(FRAG_TYPE.IMPORT),
        `${importSrc}?uxType=${ENTRY_TYPE.COMP}&name=${importName}`
      )

      if (compileOptionsObject.stats) {
        // 分析require组件所需时间
        reqStr = `console.time(\`PERF: require @app-component/${importName}\`)\n${reqStr}`
        reqStr += `console.timeEnd(\`PERF: require @app-component/${importName}\`)\n\n`
      }
      retStr += reqStr
    }
  }
  return retStr
}

/**
 * 处理模板片段
 * @param $loader
 * @param templates
 * @param uxType
 * @param importNames
 */
function processTemplateFrag($loader, templates, uxType, importNames) {
  let retStr = '{}'
  if (!templates.length) {
    $loader.emitError(new Error('需要模板 <template> 片段'))
  } else {
    // 有且仅有一个模板片段
    const template = templates[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = template.attrs.src
    // 如果是外部导入
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }

    // 解析成类似url中key[]=xxx 的形式，便于loader-utils解析
    importNames = importNames.map((item) => 'importNames[]=' + item)
    retStr = makeRequireString(
      $loader,
      makeLoaderString(FRAG_TYPE.TEMPLATE, {
        alone: !!fragAttrsSrc
      }),
      `${src}?uxType=${uxType}&${importNames.join(',')}`
    )
  }
  return retStr
}

/**
 * 处理style片段
 * @param $loader
 * @param styles
 * @param uxType
 */
function processStyleFrag($loader, styles, uxType) {
  let code = '{}'
  if (styles.length) {
    // 有且仅有一个<style>片段
    const style = styles[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = style.attrs.src
    const fragAttrsLang = style.attrs.lang
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }

    print({
      style: src
    })

    code = makeRequireString(
      $loader,
      makeLoaderString(FRAG_TYPE.STYLE, {
        alone: !!fragAttrsSrc,
        lang: fragAttrsLang
      }),
      `${src}?uxType=${uxType}`
    )
  }
  return code
}

/**
 * 处理script片段
 * @param $loader
 * @param scripts
 * @param uxType
 * @returns {string}
 */
function processScriptFrag($loader, scripts, uxType) {
  let code = 'null'
  if (scripts.length) {
    // 有且仅有一个<script>节点
    const script = scripts[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = script.attrs.src
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }
    code = makeRequireString(
      $loader,
      makeLoaderString(
        FRAG_TYPE.SCRIPT,
        {
          alone: !!fragAttrsSrc,
          path: $loader.resourcePath
        },
        uxType
      ),
      `${src}?uxType=${uxType}`
    )
  }
  return code
}

/**
 * 统一解析全部后处理
 * @param $loader
 * @param importList
 * @return {Promise}
 */
function parseImportList($loader, importList) {
  return Promise.all(
    importList.map((importItem) => {
      return resolveImportItemSrc($loader, importItem)
    })
  )
}

/**
 * 利用webpack自身能力解析路径；支持resolve.alias
 * @param $loader
 * @param importItem
 * @return {*}
 */
function resolveImportItemSrc($loader, importItem) {
  if (!importItem.attrs.src) {
    importItem.isValid = false
    return Promise.resolve(importItem)
  } else {
    return new Promise((resolve) => {
      $loader.resolve($loader.context, importItem.attrs.src, function (err, result) {
        if (err) {
          importItem.isValid = false
          importItem.err = err
          return resolve(importItem)
        } else {
          importItem.isValid = true
          importItem.srcPath = result
          return resolve(importItem)
        }
      })
    })
  }
}

export {
  processImportFrag,
  processTemplateFrag,
  processStyleFrag,
  processScriptFrag,
  parseImportList
}
