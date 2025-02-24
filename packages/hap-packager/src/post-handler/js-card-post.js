/*
 * Copyright (c) 2024-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  getExprType,
  isFunctionStr,
  isObject,
  isConstObjOrArray,
  isSimpleArr,
  isSimplePath,
  EXPR_TYPE
} from './utils'
import { templater } from '@hap-toolkit/compiler'
const { validator } = templater

const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
// 需要进行后处理的模块key
const TEMPLATE_KEY = 'template'

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

  const exprType = getExprType(template.shownRaw)
  if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
    const exprRes = getExprRes(template.shownRaw, template.shown)
    if (exprType === EXPR_TYPE.EXPRESSION) {
      template['$shown'] = exprRes
      delete template.shown
    } else {
      template.shown = exprRes
    }
  }
  delete template.shownRaw
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT.kind)
}

function markIs(template) {
  if (!template.is) return

  const exprType = getExprType(template.isRaw)
  if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
    const exprRes = getExprRes(template.isRaw, template.is)
    if (exprType === EXPR_TYPE.EXPRESSION) {
      template['$is'] = exprRes
      delete template.is
      template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
    } else {
      template.is = exprRes
    }
  }
  delete template.isRaw
}

function markId(template) {
  if (!template.id) return

  const exprType = getExprType(template.idRaw)
  if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
    const exprRes = getExprRes(template.idRaw, template.id)
    if (exprType === EXPR_TYPE.EXPRESSION) {
      template['$id'] = exprRes
      delete template.id
    } else {
      template.id = exprRes
    }
  }
  delete template.idRaw
  // 节点有id属性，标记为kind 为 1
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
}

function markFor(template) {
  if (!template.repeat) return

  if (isObject(template.repeat)) {
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
    const exprType = getExprType(template.repeatRaw.expRaw)
    if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
      const exprRes = getExprRes(template.repeatRaw.expRaw, template.repeat.exp)
      if (exprType === EXPR_TYPE.EXPRESSION) {
        template.repeat['$exp'] = exprRes
        delete template.repeat.exp
      } else {
        template.repeat.exp = exprRes
      }
    }
  } else {
    /**
      <div for="{{ItemList}}">   ->
      "$repeat": "ItemList",
    */
    const exprType = getExprType(template.repeatRaw)
    if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
      const exprRes = getExprRes(template.repeatRaw, template.repeat)
      if (exprType === EXPR_TYPE.EXPRESSION) {
        template['$repeat'] = exprRes
        delete template.repeat
      } else {
        template.repeat = exprRes
      }
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
      const exprType = getExprType(styleRaw[key])
      if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
        const exprRes = getExprRes(styleRaw[key], style[key])
        if (exprType === EXPR_TYPE.EXPRESSION) {
          template.style['$' + key] = exprRes
          delete template.style[key]
          template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
        } else {
          template.style[key] = exprRes
        }
      }
    })
  } else {
    const exprType = getExprType(styleRaw)
    if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
      const exprRes = getExprRes(styleRaw, template.style)
      if (exprType === EXPR_TYPE.EXPRESSION) {
        template['$style'] = exprRes
        delete template.style
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
      } else {
        template.style = exprRes
      }
    }
  }
  delete template.styleRaw
}

function markClass(template) {
  if (!template.class || template.class.length === 0) return

  const exprType = getExprType(template.classListRaw)
  if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
    const exprRes = getExprRes(template.classListRaw, template.classList)
    if (exprType === EXPR_TYPE.EXPRESSION) {
      template['$class'] = exprRes
      template['$classList'] = exprRes
      delete template.classList
      delete template.class
      template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
    } else {
      template.class = exprRes
      template.classList = exprRes
    }
  }
  delete template.classListRaw
}

function markEvents(template) {
  if (template.events) {
    Object.keys(template.events).forEach((eventName) => {
      const eventStr = template.events[eventName]
      if (isFunctionStr(eventStr)) {
        template.events['$' + eventName] = eventStr
        delete template.events[eventName]
      }
    })
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
  }
}

function markAttr(template) {
  if (!template.attr) return

  const attr = template.attr
  if (isObject(attr)) {
    Object.keys(attr).forEach((attrKey) => {
      const attrValueRaw = attr[attrKey + 'Raw']
      if (attrValueRaw !== undefined) {
        const exprType = getExprType(attrValueRaw)
        if (exprType === EXPR_TYPE.CONST_IN_EXPRESSION || exprType === EXPR_TYPE.EXPRESSION) {
          const exprRes = getExprRes(attrValueRaw, attr[attrKey])
          if (exprType === EXPR_TYPE.EXPRESSION) {
            attr['$' + attrKey] = exprRes
            delete attr[attrKey]
            template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
          } else {
            attr[attrKey] = exprRes
          }
        }
        delete attr[attrKey + 'Raw']
      }
    })
  }
}

function getExprRes(exprRaw, expr) {
  const tokens = validator.parseText(exprRaw.trim())
  if (tokens.length > 1) {
    return expr
  }

  const parsed = tokens[0].value
  if (isConstObjOrArray(parsed)) {
    // 简单表达式 {{ [1,2,3] }}、{{ {a: 1} }}
    // eslint-disable-next-line no-eval
    return eval(`(${parsed})`)
  } else if (isSimplePath(parsed) && isSimpleArr(parsed)) {
    // 简单表达式 {{name}}、{{title.name}}、{{title['name']}}、{{title[0]}}
    return parsed // {{ name }} -> name
  } else {
    // 复杂表达式，返回function形式的表达式结果
    return expr // {{a + b}} -> function () { return this.a + this.b }
  }
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
