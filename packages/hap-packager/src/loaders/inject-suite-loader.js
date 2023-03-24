/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs')
const parser = require('@babel/parser')
const generate = require('@babel/generator').default
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const loaderUtils = require('loader-utils')
const { colorconsole } = require('@hap-toolkit/shared-utils')
const { parseFragmentsWithCache } = require('@hap-toolkit/compiler')

function generateFn(hasTestcase = false) {
  let fn = `function () {
    this.$options = this._options || this.$options
    if (this.$options._descriptor) {
      this.$options._descriptor['back'] = { access: 'public' }
    }

    // 测试执行：开始时间，结束事件
    global.CASE_TEST_START = global.CASE_TEST_START || 1000
    global.CASE_TEST_TIMEOUT = global.CASE_TEST_TIMEOUT || 2000

    global.mocha = new Mocha({ reporter: 'json', timeout: global.CASE_TEST_TIMEOUT })
    mocha.ui('bdd')
    mocha.suite.emit('pre-require', global, null, mocha)
    setTimeout(() => {
      // 记录测试用例
      typeof fnTestCase === 'function' && fnTestCase(this)
      const mochaRunner = mocha.run(() => {
        if (mochaRunner) {
          // 标题
          mochaRunner.testResults.stats.title = mocha.suite.suites && mocha.suite.suites[0] && mocha.suite.suites[0].title
          console.info('testResults: ', JSON.stringify(mochaRunner.testResults))
          pushData('pageTestList', mochaRunner.testResults)

          // 显示结果
          const stats = mochaRunner.testResults.stats
          this.$page.setTitleBar({ text: '通过/全部: ' + stats.passes + '/' + stats.tests })
        }

        // 是否返回
        if (this.back !== 'false') {
          console.info('拥有关联测试用例，测试完毕，返回到之前的页面')
          history.back()
        }
      })
    }, global.CASE_TEST_START)
  }`
  if (!hasTestcase) {
    fn = `function () {
      this.$options = this._options || this.$options
      // 允许back被外部覆盖
      if (this.$options._descriptor) {
        this.$options._descriptor['back'] = { access: 'public' }
      }

      // 测试执行：开始时间，结束事件
      global.CASE_TEST_START = global.CASE_TEST_START || 1000
      global.CASE_TEST_TIMEOUT = global.CASE_TEST_TIMEOUT || 2000

      setTimeout(() => {
        // 是否返回
        if (this.back !== 'false') {
          console.info('没有关联测试用例，直接返回到之前的页面')
          history.back()
        }
      }, global.CASE_TEST_START)
    }`
  }

  return parser.parseExpression(fn).body
}

module.exports = function (source) {
  const query = loaderUtils.parseQuery(this.resourceQuery || '?')

  const options = loaderUtils.getOptions(this)

  const hookName = (options && options.hookName) || 'onCreate'

  const script = parseFragmentsWithCache(source).script[0] || {
    content: ''
  }

  const fileCasePath = this.resourcePath
    .replace(/([\\/])(src)([\\/])/, (...args) => args[1] + 'test' + args[3])
    .replace(/\.\w{2,5}$/, '.js')

  const astBase = parser.parse(script.content, {
    sourceType: 'module',
    plugins: ['jsx', 'dynamicImport'] // xvm中可以编译jsx语法；增加动态引入js的语法。这里注意。
  })

  if (query.uxType === 'app') {
    const appImport = types.importDeclaration(
      [],
      types.stringLiteral('@hap-toolkit/packager/lib/runtime/app.js')
    )
    astBase.program.body.unshift(appImport)
  } else if (query.uxType === 'page') {
    const flag = fs.existsSync(fileCasePath)
    const fileCaseRelativePath = fileCasePath.match(/[\\/]test[\\/](.*)/)[1]

    if (flag) {
      const vmImport = types.importDeclaration(
        [types.importDefaultSpecifier(types.identifier('fnTestCase'))],
        types.stringLiteral(fileCasePath)
      )
      astBase.program.body.unshift(vmImport)
      if (query.type === 'script') {
        colorconsole.info(`[INFO] 脚本注入测试用例：${fileCaseRelativePath}`)
      }
    }

    traverse(astBase, {
      ExportDefaultDeclaration(path) {
        // 其他文件不填加测试
        if (query.uxType !== 'page') return
        // 生成测试函数
        const bcf = generateFn(flag)

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
            types.functionExpression(types.identifier(hookName), [], bcf)
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
          exportProps[bcIndex].body.body = exportProps[bcIndex].body.body.concat(bcf.body)
          return
        }

        // 如果不存在${hookName}方法，则进行添加
        const hookIdentifier = types.identifier(hookName)
        const hookMethod = bcf
        const hookProperty = types.objectMethod('method', hookIdentifier, [], hookMethod)
        path.node.declaration.properties.push(hookProperty)
      }
    })
  } else {
    return source
  }

  // 替换原始的script文件内容为新内容
  source = source.replace(/<script.*?>([\s\S]+)<\/script>/, function () {
    return `<script>\n${generate(astBase).code}\n</script>`
  })

  return source
}
