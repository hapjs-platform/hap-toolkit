/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

function init(conf) {
  // 内置模块
  const builtinModules = [
    {
      name: 'debugger',
      path: require.resolve('@hap-toolkit/debugger/lib/router')
    },
    {
      name: 'packager',
      path: require.resolve('@hap-toolkit/packager/lib/router')
    },
    {
      name: 'preview',
      path: require.resolve('../preview/index.js')
    }
  ]
  // 开发者指定的模块
  const modules = conf.options.moduleList

  const filtered = builtinModules.filter((module) => {
    return modules.length ? modules.indexOf(module.name) >= 0 : true
  })

  filtered.forEach((module) => {
    const moduleItem = {
      // 模块名称
      name: module.name,
      // 模块路径
      path: module.path,
      // 导出对象
      hash: require(module.path)
    }
    moduler.moduleList.push(moduleItem)
    moduler.moduleHash[moduleItem.name] = moduleItem
  })
}

function contains(name) {
  return !!moduler.moduleHash[name]
}

const moduler = {
  moduleList: [],
  moduleHash: {},
  init,
  contains
}
export default moduler
