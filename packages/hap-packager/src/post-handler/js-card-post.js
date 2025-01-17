/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { templater } from '@hap-toolkit/compiler'
const { validator } = templater

const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
// 需要进行后处理的模块key
const TEMPLATE_KEY = 'template'

const pathTestRE =
  /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/

const literalValueRE = /^(?:true|false|null|undefined|Infinity|NaN)$/

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
    template['$classList'] = getExprRes(template.classListRaw, template.classList)
    delete template.classList
    delete template.class
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
  }
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

function getExprRes(exprRaw, expr) {
  const tokens = validator.parseText(exprRaw.trim())
  if (tokens.length > 1) {
    return expr
  }

  const parsed = tokens[0].value
  if (isObjOrArray(parsed) || (isSimplePath(parsed) && isSimpleArr(parsed))) {
    // 简单表达式
    // 目前只有 {{name}}、{{title.name}}、{{title[0]}}、{{[1,2,3]}}、{{ {a: 1} }} 算作简单表达式
    return parsed // {{ name }} -> name
  } else {
    // 复杂表达式，返回function形式的表达式结果
    return expr // {{a + b}} -> function () { return this.a + this.b }
  }
}

function isObjOrArray(exp) {
  return Object.prototype.toString.call(exp) === '[object Object]' || Array.isArray(exp)
}
function isSimpleArr(exp) {
  // eslint-disable-next-line no-useless-escape
  const regex = /\[([^\[\]]+)\]/g
  let match
  const results = []

  while ((match = regex.exec(exp)) !== null) {
    results.push(match[1])
  }

  let res = true
  // 检查所有[]匹配项是否全部为数字
  results.forEach((content) => {
    if (!/^\d+$/.test(content)) {
      res = false
    }
  })
  return res
}
function isSimplePath(exp) {
  return (
    pathTestRE.test(exp) &&
    // true/false/null/undefined/Infinity/NaN
    !literalValueRE.test(exp) &&
    // Math常量
    exp.slice(0, 5) !== 'Math.'
  )
}

export function postHandleJSCardRes(JsCardRes) {
  const uxList = Object.keys(JsCardRes)

  // template
  for (let i = 0; i < uxList.length; i++) {
    const compName = uxList[i]
    postHandleTemplate(JsCardRes[compName][TEMPLATE_KEY], JsCardRes)
  }

  return JsCardRes
}
