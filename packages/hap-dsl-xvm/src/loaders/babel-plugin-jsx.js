/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import jsxSyntaxPlugin from '@babel/plugin-syntax-jsx'

module.exports = function (babel) {
  const t = babel.types
  return {
    inherits: jsxSyntaxPlugin,
    visitor: {
      JSXNamespacedName(path) {
        throw path.buildCodeFrameError('不支持带命名空间的标签/属性')
      },
      JSXElement: {
        exit(path, file) {
          // 将jsx标签转换为createElement函数调用
          const callExpr = buildElementCall(path.get('openingElement'), file)
          // 将孩子属性作为函数的第3个参数
          const tagExpr = convertJSXIdentifier(path.get('openingElement').node.name)
          // 取出标签名
          let tagName
          if (t.isIdentifier(tagExpr)) {
            tagName = tagExpr.name
          }
          const children = path.node.children.map((item) => {
            // 将所有jsxText替换为<text>或<span>
            if (t.isStringLiteral(item)) {
              return buildTextElementCall(tagName === 'text' ? 'span' : 'text', item.value, file)
            }
            return item
          })
          callExpr.arguments.push(t.arrayExpression(children))
          // 将jsx代码替换为$createElement函数调用
          path.replaceWith(t.inherits(callExpr, path.node))
        }
      },
      Program(path) {
        // 只检查函数中的jsx代码
        path.traverse({
          'ObjectMethod|FunctionExpression|ClassMethod'(path) {
            // 检查函数中是否包含jsx代码
            const jsxChecker = {
              hasJsx: false
            }
            path.traverse(
              {
                JSXElement() {
                  this.hasJsx = true
                }
              },
              jsxChecker
            )
            if (!jsxChecker.hasJsx) {
              return
            }
            // 在函数体前面添加 const __s = this.$stringify
            path
              .get('body')
              .unshiftContainer(
                'body',
                t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier('__s'),
                    t.memberExpression(t.thisExpression(), t.identifier('$stringify'))
                  )
                ])
              )
            // 在函数体前面添加 const __extend = this.$extend
            path
              .get('body')
              .unshiftContainer(
                'body',
                t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier('__extend'),
                    t.memberExpression(t.thisExpression(), t.identifier('$extend'))
                  )
                ])
              )
            // 在函数体前面添加 const __elem = this.$createElement
            path
              .get('body')
              .unshiftContainer(
                'body',
                t.variableDeclaration('const', [
                  t.variableDeclarator(
                    t.identifier('__elem'),
                    t.memberExpression(t.thisExpression(), t.identifier('$createElement'))
                  )
                ])
              )
          }
        })
      }
    }
  }

  /**
   * 生成createElement函数调用
   * @param path
   * @param file
   * @returns {*}
   */
  function buildElementCall(path, file) {
    path.parent.children = t.react.buildChildren(path.parent)
    const tagExpr = convertJSXIdentifier(path.node.name)
    const args = []

    // 取出标签名
    let tagName
    if (t.isIdentifier(tagExpr)) {
      tagName = tagExpr.name
      args.push(t.stringLiteral(tagName))
    } else {
      args.push(tagExpr)
    }

    // 生成属性表达式
    let attrs = path.node.attributes
    if (attrs.length) {
      attrs = buildOpeningElementAttributes(attrs, file)
    } else {
      attrs = t.nullLiteral()
    }
    args.push(attrs)

    return t.callExpression(t.identifier('__elem'), args)
  }

  /**
   *
   * @param type
   * @param value
   */
  function buildTextElementCall(type, value) {
    const args = []
    args.push(t.stringLiteral(type))
    args.push(
      t.objectExpression([
        t.objectProperty(
          t.identifier('value'),
          t.callExpression(t.identifier('__s'), [t.stringLiteral(value)])
        )
      ])
    )
    return t.callExpression(t.identifier('__elem'), args)
  }

  /**
   * 转换JSX符号
   * @param node
   * @param parent
   * @returns {*}
   */
  function convertJSXIdentifier(node) {
    if (t.isJSXIdentifier(node)) {
      node.type = 'Identifier' // 将type从JSXIdentifier改为Identifier
    }
    return node
  }

  /**
   * 生成标签的属性表达式
   * @param attribs
   * @returns {*}
   */
  function buildOpeningElementAttributes(attrs) {
    let _props = []
    const objs = []
    let hasSpread = false

    function pushProps() {
      if (!_props.length) return
      objs.push(t.objectExpression(_props))
      _props = []
    }

    while (attrs.length) {
      const prop = attrs.shift()
      if (t.isJSXSpreadAttribute(prop)) {
        pushProps()
        hasSpread = true
        objs.push(prop.argument)
      } else {
        _props.push(convertAttribute(prop))
      }
    }

    pushProps()

    if (hasSpread) {
      // $extend表达式
      objs.unshift(t.objectExpression([]))
      attrs = t.callExpression(t.identifier('__extend'), objs)
    } else {
      attrs = objs[0]
    }
    return attrs
  }

  /**
   *
   * @param node
   */
  function convertAttribute(node) {
    const value = convertAttributeValue(node.value || t.booleanLiteral(true))
    if (t.isStringLiteral(value) && !t.isJSXExpressionContainer(node.value)) {
      value.value = value.value.replace(/\n\s+/g, ' ')
    }
    if (t.isValidIdentifier(node.name.name)) {
      node.name.type = 'Identifier'
    } else {
      node.name = t.stringLiteral(node.name.name)
    }
    return t.inherits(t.objectProperty(node.name, value), node)
  }

  /**
   *
   * @param node
   * @returns {*}
   */
  function convertAttributeValue(node) {
    if (t.isJSXExpressionContainer(node)) {
      return node.expression
    } else {
      return node
    }
  }
}
