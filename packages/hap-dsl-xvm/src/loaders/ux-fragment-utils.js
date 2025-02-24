/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { sync as resolveSync } from 'resolve'
import path from 'path'
import { globalConfig, compileOptionsObject } from '@hap-toolkit/shared-utils'
import { getBabelConfigJsPath } from '@hap-toolkit/packager'
import { ENTRY_TYPE, templater } from '@hap-toolkit/compiler'

import {
  stringifyLoaders,
  makeRequireString,
  getNameByPath,
  print,
  FRAG_TYPE,
  isUXRender
} from './common/utils'

const { validator } = templater
// 项目目录
const cwd = path.resolve(globalConfig.projectPath)

const defaultLoaders = {
  // common
  sass: resolveSync('sass-loader'),
  scss: resolveSync('sass-loader'),
  less: resolveSync('less-loader'),
  component: resolveSync('./ux-loader.js'),
  data: resolveSync('./data-loader.js'),
  action: resolveSync('./action-loader.js'),
  props: resolveSync('./props-loader.js'),
  fragment: resolveSync('./fragment-loader.js'),
  template: resolveSync('./template-loader.js'),
  style: resolveSync('./style-loader.js'),
  script: resolveSync('./script-loader.js'),
  module: resolveSync('@hap-toolkit/packager/lib/loaders/module-loader.js'),
  babel: resolveSync('babel-loader'),
  // app
  mainfest: resolveSync('@hap-toolkit/packager/lib/loaders/manifest-loader.js'),
  // page
  access: resolveSync('./access-loader.js'),
  'extract-css': resolveSync('./extract-css-loader.js')
}

/**
 * 生成loader请求代码
 * @param type
 * @param config
 * @param uxType
 * @returns {*}
 */
function makeLoaderString(type, config, newJSCard, uxType) {
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

  if (type === FRAG_TYPE.DATA) {
    loaders = [
      {
        name: defaultLoaders.data
      },
      {
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.DATA
        }
      }
    ]
    return stringifyLoaders(loaders)
  }

  if (type === FRAG_TYPE.ACTIONS) {
    loaders = [
      {
        name: defaultLoaders.action
      },
      {
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.DATA
        }
      }
    ]
    return stringifyLoaders(loaders)
  }

  if (type === FRAG_TYPE.PROPS) {
    loaders = [
      {
        name: defaultLoaders.props
      },
      {
        name: defaultLoaders.fragment,
        query: {
          index: 0,
          type: FRAG_TYPE.DATA
        }
      }
    ]
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

    if (compileOptionsObject.enableExtractCss && !newJSCard) {
      loaders.unshift({
        name: defaultLoaders['extract-css']
      })
    }

    let lang = config.lang
    if (lang && lang !== 'css') {
      loaders.push({
        name: defaultLoaders[lang]
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
          name: defaultLoaders.babel,
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
          name: resolveSync('@hap-toolkit/packager/lib/loaders/diagnosis-loader.js'),
          query: {
            pureScript: true,
            hookName: 'onCreate',
            hostName: compileOptionsObject.enableDiagnosis
          }
        })
    } else {
      loaders.push({
        name: defaultLoaders.babel,
        query: {
          cwd,
          cacheDirectory: true,
          plugins: [resolveSync('./babel-plugin-jsx.js')],
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
        name: resolveSync('@hap-toolkit/packager/lib/loaders/inject-suite-loader.js'),
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
 * @param {number} newJSCard 新打包格式JS卡
 * @param {number} lite 轻卡
 * @returns {string}
 */
function processImportFrag($loader, imports, importNames, newJSCard, lite) {
  let retStr = ''
  if (imports.length) {
    const newJSCardParam = newJSCard ? `&newJSCard=${newJSCard}` : ''
    const liteParam = lite ? `&lite=${lite}` : ''
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
        makeLoaderString(FRAG_TYPE.IMPORT, null, newJSCard),
        `${importSrc}?uxType=${ENTRY_TYPE.COMP}&name=${importName}${newJSCardParam}${liteParam}`
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
 * @param {number} newJSCard 新打包格式JS卡
 * @param {number} lite 轻卡
 */
function processTemplateFrag($loader, templates, uxType, importNames, newJSCard, lite) {
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

    const newJSCardParam = newJSCard ? `&newJSCard=${newJSCard}` : ''
    const liteParam = lite ? `&lite=${lite}` : ''
    const pathParam = newJSCard ? `&uxPath=${src}` : ''
    // 解析成类似url中key[]=xxx 的形式，便于loader-utils解析
    importNames = importNames.map((item) => 'importNames[]=' + item)
    retStr = makeRequireString(
      $loader,
      makeLoaderString(
        FRAG_TYPE.TEMPLATE,
        {
          alone: !!fragAttrsSrc
        },
        newJSCard
      ),
      `${src}?uxType=${uxType}&${importNames.join(',')}${newJSCardParam}${liteParam}${pathParam}`
    )
  }
  return retStr
}

/**
 * 处理style片段
 * @param $loader
 * @param styles
 * @param uxType
 * @param {number} newJSCard 1:卡片
 * @param {number} lite 1:轻卡
 */
function processStyleFrag($loader, styles, uxType, newJSCard, lite) {
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
    const newJSCardParam = newJSCard ? `&newJSCard=${newJSCard}` : ''
    const liteParam = lite ? `&lite=${lite}` : ''
    const pathParam = newJSCard ? `&uxPath=${src}` : ''
    code = makeRequireString(
      $loader,
      makeLoaderString(
        FRAG_TYPE.STYLE,
        {
          alone: !!fragAttrsSrc,
          lang: fragAttrsLang
        },
        newJSCard
      ),
      `${src}?uxType=${uxType}${newJSCardParam}${liteParam}${pathParam}`
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
function processScriptFrag($loader, scripts, uxType, newJSCard) {
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
        newJSCard,
        uxType
      ),
      `${src}?uxType=${uxType}`
    )
  }
  return code
}

/**
 * 处理轻卡<data>片段中data
 * @param $loader
 * @param scripts
 * @param uxType
 * @returns {string}
 */
function processDataFrag($loader, datas, uxType) {
  let code = 'null'
  if (datas.length) {
    // 有且仅有一个<data>节点
    const data = datas[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = data.attrs.src
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }
    code = makeRequireString(
      $loader,
      makeLoaderString(FRAG_TYPE.DATA, {}, true, uxType),
      `${src}?index=0&lite=1`
    )
  }
  return code
}

/**
 * 处理轻卡<data>片段中action
 * @param $loader
 * @param scripts
 * @param uxType
 * @returns {string}
 */
function processActionFrag($loader, datas, uxType) {
  let code = 'null'
  if (datas.length) {
    // 有且仅有一个<data>节点
    const data = datas[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = data.attrs.src
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }
    code = makeRequireString(
      $loader,
      makeLoaderString(FRAG_TYPE.ACTIONS, {}, true, uxType),
      `${src}?index=0&lite=1`
    )
  }
  return code
}

/**
 * 处理轻卡自定义组件<data>片段中props
 * @param $loader
 * @param scripts
 * @param uxType
 * @returns {string}
 */
function processPropsFrag($loader, datas, uxType) {
  let code = 'null'
  if (datas.length) {
    // 有且仅有一个<data>节点
    const data = datas[0]
    // 文件绝对路径
    let src = $loader.resourcePath
    const fragAttrsSrc = data.attrs.src
    if (fragAttrsSrc) {
      src = fragAttrsSrc
    }
    code = makeRequireString(
      $loader,
      makeLoaderString(FRAG_TYPE.PROPS, {}, true, uxType),
      `${src}?index=0&lite=1`
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
        } else {
          importItem.isValid = true
          importItem.srcPath = result
        }
        return resolve(importItem)
      })
    })
  }
}

export {
  processImportFrag,
  processTemplateFrag,
  processStyleFrag,
  processScriptFrag,
  processDataFrag,
  processActionFrag,
  processPropsFrag,
  parseImportList
}
