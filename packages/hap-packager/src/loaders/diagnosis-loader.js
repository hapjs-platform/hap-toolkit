/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { parse } from '@babel/parser'
import generate from '@babel/generator'
import * as types from '@babel/types'
import loaderUtils from 'loader-utils'
import { parseFragmentsWithCache } from '@hap-toolkit/compiler'
import traverse from '@babel/traverse'
import { ENTRY_TYPE } from '../common/utils'

export default function (source) {
  const options = loaderUtils.getOptions(this) || {}
  const query = loaderUtils.parseQuery(this.resourceQuery || '?')
  const hostName =
    typeof options.hostName === 'string' ? JSON.stringify(options.hostName) : 'QUICKAPP_SERVER_HOST'
  const hookName = options.hookName || 'onCreate'

  if (query.uxType !== ENTRY_TYPE.APP) {
    return source
  }

  const script = parseFragmentsWithCache(source).script[0] || {
    content: ''
  }

  const parseContent = options.pureScript ? source : script.content

  const astBase = parse(parseContent, {
    sourceType: 'module',
    plugins: ['jsx'] // xvm中可以编译jsx语法，这里注意
  })

  const appImport = types.importDeclaration(
    [types.importDefaultSpecifier(types.identifier('_diagnosis'))],
    types.stringLiteral('@hap-toolkit/packager/lib/runtime/diagnosis.js')
  )
  const body = astBase.program.body

  const strikeFn = types.blockStatement([
    types.expressionStatement(
      types.callExpression(types.identifier('_diagnosis'), [types.identifier(hostName)])
    )
  ])

  body.unshift(appImport)

  traverse(astBase, {
    ExportDefaultDeclaration(path) {
      // 生成测试函数
      let exportProps
      const dec = path.node.declaration
      const exType = dec.type

      if (exType === 'ObjectExpression') {
        exportProps = dec.properties
      } else {
        // 使用一个特殊的字符串来代表需要输出的变量名，用于中间接收
        const replaceVar = path.scope.generateUidIdentifier('replace')
        path.node.declaration = replaceVar

        // 生成语句 const _$replace$_ = ${dec} 原始值的接收
        const variableDeclaration = types.variableDeclaration('const', [
          types.variableDeclarator(replaceVar, dec)
        ])
        // 生成语句 _$replace$_.onCreate = function onCreate() {}
        const assignment = types.assignmentExpression(
          '=',
          types.memberExpression(replaceVar, types.identifier(hookName)),
          types.functionExpression(types.identifier(hookName), [], strikeFn)
        )

        // 将生成的语句插入到代码合适位置
        path.insertBefore(variableDeclaration)
        path.insertBefore(assignment)
        return
      }

      // Page文件如果存在${hookName}，修改${hookName}
      let existFlag = false /* ${hookName}存在标志 */
      let bcIndex /* 记录最后一个${hookName}的位置 */

      exportProps.forEach((prop, index) => {
        if (prop.key.name === hookName && prop.method === true) {
          bcIndex = index
          existFlag = true
        }
      })

      if (existFlag) {
        exportProps[bcIndex].body.body = strikeFn.body.concat(exportProps[bcIndex].body.body)
        return
      }

      // 如果不存在${hookName}方法，则进行添加
      const hookIdentifier = types.identifier(hookName)
      const hookMethod = strikeFn
      const hookProperty = types.objectMethod('method', hookIdentifier, [], hookMethod)
      path.node.declaration.properties.push(hookProperty)
    }
  })

  // 是否只有script内容而不存在<script>标签
  if (options.pureScript) {
    source = generate(astBase).code
  } else {
    // 替换原始的script文件内容为新内容
    source = source.replace(/<script.*?>([\s\S]+)<\/script>/, function () {
      return `<script>\n${generate(astBase).code}\n</script>`
    })
  }

  return source
}
