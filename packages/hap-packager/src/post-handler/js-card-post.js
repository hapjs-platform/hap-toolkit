import { templateValueToCardCode } from '@aiot-toolkit/card-expression'
import { templater } from '@hap-toolkit/compiler'
import { getStyleObjectId } from '@hap-toolkit/shared-utils'
import path from 'path'
import acorn from 'acorn'
import escodegen from 'escodegen'
const { validator } = templater

const SUFFIX_UX = '.ux'
const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
// 需要进行后处理的模块key
const TEMPLATE_KEY = 'template'
const SIMPLE_EXPR_MODIFIERS = ['$', '.', '[]', '~', '{}']

// 节点标记，同一节点可能同时符合多个kind定义，按priority高的进行标记
const ENUM_KIND_TYPE = {
  ELEMENT: {
    // 普通动态节点、事件节点、带id属性的节点
    kind: 1,
    priority: 1
  },
  COMPONENT: {
    // 自定义组件节点
    kind: 3,
    priority: 2
  },
  FRAGMENT: {
    // if/for 动态节点
    kind: 2,
    priority: 3
  }
}

// 处理 template 中的字段，增加标记和处理表达式
function postHandleTemplate(template, JsCardRes) {
  if (!isObject(template)) return

  markStyle(template)
  markClass(template)
  markAttr(template)
  markEvents(template)
  markId(template)
  markIs(template)
  markIf(template)
  markFor(template)
  markCustomComp(template, JsCardRes)

  const children = template.children
  if (children && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      postHandleTemplate(child, JsCardRes)
    }
  }
}

// 获取kind值对应的优先级
function getPriority(kind) {
  let prioity = kind
  Object.keys(ENUM_KIND_TYPE).some((key) => {
    const item = ENUM_KIND_TYPE[key]
    if (item.kind === kind) {
      prioity = item.priority
      return true
    }
  })
  return prioity
}

// 根据优先级标记节点的 kind 值
function markKind(oldKind, newKind) {
  if (!oldKind) return newKind

  const oldPriority = getPriority(oldKind)
  const newPriority = getPriority(newKind)
  if (oldPriority < newPriority) return newKind

  return oldKind
}

function markCustomComp(template, JsCardRes) {
  if (!isObject(JsCardRes[CARD_ENTRY][TYPE_IMPORT])) return

  const importList = Object.keys(JsCardRes[CARD_ENTRY][TYPE_IMPORT])

  if (importList.includes(template.type)) {
    template.import = JsCardRes[CARD_ENTRY][TYPE_IMPORT][template.type]
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.COMPONENT.kind)
    delete JsCardRes[CARD_ENTRY][TYPE_IMPORT]
  }
}

function markIf(template) {
  if (!template.shown) return

  if (isExpr(template.shownRaw)) {
    template['$shown'] = getExprRes(template.shownRaw, template.shown)
    delete template.shown
  }
  delete template.shownRaw
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT.kind)
}

function markIs(template) {
  if (!template.is) return

  if (isExpr(template.isRaw)) {
    template['$is'] = getExprRes(template.isRaw, template.is)
    delete template.is
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
  }
  delete template.isRaw
}

function markId(template) {
  if (!template.id) return

  if (isExpr(template.idRaw)) {
    template['$id'] = getExprRes(template.idRaw, template.id)
    delete template.id
  }
  delete template.idRaw
  // 节点有id属性，标记为kind 为 1
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
}

function markFor(template) {
  if (!template.repeat) return

  if (isObject(template.repeat)) {
    if (isExpr(template.repeatRaw.expRaw)) {
      /**
       * example 1:
        <div for="{{(index, item) in ItemList}}">   ->
        "repeat": {
          "$exp": "ItemList",
          "key": "index",
          "value": "item"
        },

        example 2:
        <div for="{{(index, item) in [1,2,3]}}">   ->
        "repeat": {
          "$exp": "[1, 2, 3]",
          "key": "index",
          "value": "item"
        },
      */
      template.repeat['$exp'] = getExprRes(template.repeatRaw.expRaw, template.repeat.exp)
      delete template.repeat.exp
    }
  } else {
    if (isExpr(template.repeatRaw)) {
      /**
        <div for="{{ItemList}}">   ->
        "$repeat": "ItemList",
      */
      template['$repeat'] = getExprRes(template.repeatRaw, template.repeat)
      delete template.repeat
    }
    delete template.repeatRaw
  }
  delete template.repeatRaw
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT.kind)
}

function markStyle(template) {
  if (!template.style) return
  const styleRaw = template.styleRaw
  const style = template.style
  if (typeof style === 'object') {
    Object.keys(style).forEach((key) => {
      if (isExpr(styleRaw[key])) {
        template.style['$' + key] = getExprRes(styleRaw[key], style[key])
        delete template.style[key]
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
      }
    })
  } else {
    if (isExpr(styleRaw)) {
      template['$style'] = getExprRes(styleRaw, template.style)
      delete template.style
      template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
    }
  }
  delete template.styleRaw
}

function markClass(template) {
  if (!template.class || template.class.length === 0) return

  if (isExpr(template.classListRaw)) {
    template['$class'] = getExprRes(template.classListRaw, template.classList)
    delete template.class
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
  }
  delete template.classList
  delete template.classListRaw
}

function markEvents(template) {
  if (template.events) {
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
  }
}

function markAttr(template) {
  if (!template.attr) return

  const attr = template.attr
  if (isObject(attr)) {
    Object.keys(attr).forEach((attrKey) => {
      const attrValueRaw = attr[attrKey + 'Raw']
      if (isExpr(attrValueRaw)) {
        attr['$' + attrKey] = getExprRes(attrValueRaw, attr[attrKey])
        delete attr[attrKey]
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
      }
      delete attr[attrKey + 'Raw']
    })
  }
}

function isExpr(val) {
  if (!val) return false
  return validator.isExpr(val)
}

function isObject(obj) {
  return obj && Object.prototype.toString.call(obj) === '[object Object]' && obj !== null
}

function getExprRes(exprRaw, exprFunc) {
  const res = templateValueToCardCode(exprRaw)
  const parsed = JSON.parse(res)
  if (isSimpleExpr(parsed)) {
    // 简单表达式
    // 目前只有 {{name}}、{{title.name}}、{{[1,2,3]}}、{{ {a: 1} }} 算作简单表达式
    return validator.parseText(exprRaw)[0].value // {{ name }} -> name
  } else {
    // 复杂表达式，返回function形式的表达式结果
    return exprFunc // {{a + b}} -> function () { return this.a + this.b }
  }
}

// 根据操作符来判断是否为简单表达式
function isSimpleExpr(expr) {
  if (!expr || !Array.isArray(expr)) return false

  const modifierList = []
  getAllModifiers(expr, modifierList)
  return modifierList.every((modifier) => SIMPLE_EXPR_MODIFIERS.includes(modifier))
}

function getAllModifiers(exprList, modifierList) {
  modifierList.push(exprList[0])
  for (let i = 1; i < exprList.length; i++) {
    if (Array.isArray(exprList[i])) {
      // 如果当前元素是数组，递归调用，找出所有的操作符
      getAllModifiers(exprList[i], modifierList)
    }
  }
  return modifierList
}

export function postHandleJSCardTemplateRes(JsCardRes) {
  const uxList = Object.keys(JsCardRes)

  // template
  for (let i = 0; i < uxList.length; i++) {
    const compName = uxList[i]
    postHandleTemplate(JsCardRes[compName][TEMPLATE_KEY], JsCardRes)
  }

  return JsCardRes
}

function isStyleModule(str) {
  return str.indexOf('type=style') > -1
}

function isTemplateModule(str) {
  return str.indexOf('type=template') > -1
}

function getRelativeCompPath(pathSrc, uxPath) {
  let relativeSrcPathStr = path.relative(pathSrc, uxPath)
  relativeSrcPathStr = relativeSrcPathStr.replace(/\\/g, '/')
  if (relativeSrcPathStr && relativeSrcPathStr.endsWith('.ux')) {
    return relativeSrcPathStr.substring(0, relativeSrcPathStr.length - SUFFIX_UX.length)
  }
  return relativeSrcPathStr
}

function getCompPath(str, pathSrc) {
  const reqArr = str.split('!')
  const lastItem = reqArr[reqArr.length - 1]
  const pathArr = lastItem.split('?')
  const uxPath = pathArr[0]
  const relativeSrcPath = getRelativeCompPath(pathSrc, uxPath)
  const paramStr = pathArr[1]
  const compUxType = 'uxType=comp'
  const namePrefix = 'name='
  let compPath = relativeSrcPath
  if (paramStr && paramStr.includes(compUxType) && paramStr.includes(namePrefix)) {
    const paramArr = paramStr.split('&')
    const nameStr = paramArr.find((item) => item.indexOf(namePrefix) === 0)
    if (nameStr) {
      compPath = nameStr.substring(namePrefix.length)
    }
  }
  return compPath
}

function trimTemplateAndStyleModules(nodes, cssFileName, pathSrc) {
  if (!nodes) return

  if (Object.prototype.toString.call(nodes) === '[object Array]') {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      if (isTemplateModule(node.key.value)) {
        nodes.splice(i, 1)
      } else if (isStyleModule(node.key.value)) {
        const compPath = getCompPath(node.key.value, pathSrc)
        const styleObjId = getStyleObjectId(compPath)
        const objExprNode = acorn.parse(
          `
          ((module) => {
            module.exports = {
              "@info": {
                "styleObjectId": "${styleObjId}"
              },
              "extracted": true,
              "jsonPath": "${cssFileName}"
            }
          })
          `,
          { ecmaVersion: 8 }
        )
        Object.assign(node.value, objExprNode.body[0].expression)
      }
    }
  }
}
function findWebpackModules(node, modules) {
  if (!node) return

  if (Object.prototype.toString.call(node) === '[object Object]') {
    if (node.type === 'VariableDeclarator' && node.id?.name === '__webpack_modules__') {
      modules.targetNode = node.init.properties
      return
    }
    Object.keys(node).forEach((key) => {
      if (!modules.targetNode) {
        findWebpackModules(node[key], modules)
      }
    })
  } else if (Object.prototype.toString.call(node) === '[object Array]') {
    node.forEach((item) => {
      if (!modules.targetNode) {
        findWebpackModules(item, modules)
      }
    })
  }
}

function replaceTemplateAndStyleFunc(node, pathSrc, templateFileName, cssFileName) {
  if (!node) return

  if (Object.prototype.toString.call(node) === '[object Object]') {
    if (node.type === 'CallExpression' && node.callee?.name === '__webpack_require__') {
      const arg = node.arguments[0]
      const compPath = getCompPath(arg.value, pathSrc)
      if (isTemplateModule(arg.value)) {
        node.callee.name = '$json_require$'
        arg.value = templateFileName
        arg.raw = `"${arg.value}"`

        let templatePath = compPath
        if (templateFileName === `${compPath}.template.json`) {
          templatePath = CARD_ENTRY
        }
        const optionsArg = {
          type: 'ObjectExpression',
          properties: [
            {
              type: 'Property',
              key: {
                type: 'Identifier',
                name: 'componentPath'
              },
              value: {
                type: 'Literal',
                value: templatePath
              },
              kind: 'init',
              method: false,
              shorthand: false,
              computed: false
            }
          ]
        }
        node.arguments.push(optionsArg)
      }
    }
    Object.keys(node).forEach((key) => {
      replaceTemplateAndStyleFunc(node[key], pathSrc, templateFileName, cssFileName)
    })
  } else if (Object.prototype.toString.call(node) === '[object Array]') {
    node.forEach((item) => {
      replaceTemplateAndStyleFunc(item, pathSrc, templateFileName, cssFileName)
    })
  }
}

export function postHandleJSCardScriptRes(
  fileName,
  compilation,
  pathSrc,
  templateFileName,
  cssFileName
) {
  let scriptSource = compilation.assets[fileName]._source
  if (typeof scriptSource === 'function') {
    scriptSource = scriptSource()
  }
  const scriptStr = scriptSource.source()
  try {
    const ast = acorn.parse(scriptStr, {
      sourceType: 'script',
      ecmaVersion: 8
    })
    let modules = {}
    findWebpackModules(ast, modules)
    trimTemplateAndStyleModules(modules.targetNode, cssFileName, pathSrc)
    replaceTemplateAndStyleFunc(ast, pathSrc, templateFileName, cssFileName)

    const generatedCode = escodegen.generate(ast)
    return generatedCode
  } catch (error) {
    return scriptStr
  }
}
