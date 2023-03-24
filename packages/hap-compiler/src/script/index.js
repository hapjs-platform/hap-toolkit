/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * 解析源码
 * @param source
 */
function parse(source) {
  return source
}

/**
 * 替换脚本中对模块的引用
 *
 * NOTE: 正则表达式 ([\w$_][\w$-.]) 部分对模块的名称给予了大于快应用实际的范围
 * @param {String} source - 代码
 * @return {String}
 */
function replaceModuleImport(source) {
  // require('@mod') => $app_require$('@app-module/mod')
  let result = source.replace(/require\s*\(\s*(['"])@([\w$_][\w$-.]*?)\1\)/gm, (_, quote, mod) => {
    return `$app_require$(${quote}@app-module/${mod}${quote})`
  })
  /*
   * import mod from '@mod' => var mod = require('@app-module/mod')
   * import {prop} from '@mod' ?? => var {prop} = require('@app-module/mod')
   * TODO source 已被转换成 require，下面的代码其实不再需要
   */
  result = result.replace(
    /import\s+([\w${}]+?)\s+from\s+(['"])@([\w$_][\w$-.]*?)\2/gm,
    (_, ref, quote, mod) => {
      return `var ${ref} = $app_require$(${quote}@app-module/${mod}${quote})`
    }
  )
  return result
}

export default {
  parse,
  replaceModuleImport
}
