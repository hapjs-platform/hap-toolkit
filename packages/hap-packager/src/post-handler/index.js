import { templateValueToCardCode } from '@aiot-toolkit/card-expression'
import { templater } from '@hap-toolkit/compiler'
const { validator } = templater

const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
// 需要进行后处理的模块key
const TEMPLATE_KEY = 'template'
const ACTIONS_KEY = 'actions'
const SIMPLE_EXPR_MODIFIERS = ['$', '.', '[]', '~', '{}']

// 节点标记，标记优先级依次提升
const ENUM_KIND_TYPE = {
  ELEMENT: 1, // 普通动态节点、事件节点、带id属性的节点
  FRAGMENT: 2, // if/for 动态节点
  COMPONENT: 3 // 自定义组件节点
}

function postHandleActions(actions) {
  if (!isObject(actions)) return

  markType(actions)
  markUrl(actions)
  markMethod(actions)
  markParams(actions)
}

function markType(actions) {
  if (isExpr(actions.type)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(actions.type)
    delete actions.type
    actions['$type'] = rawExpr
    actions['#type'] = prefixExpr
  }
}

function markUrl(actions) {
  if (typeof actions.url === 'string') {
    if (isExpr(actions.url)) {
      let { rawExpr, prefixExpr } = getPrefixExpr(actions.url)
      delete actions.url
      actions['$url'] = rawExpr
      actions['#url'] = prefixExpr
    }
  } else if (Array.isArray(actions.url)) {
    let hasBinding = false
    const rawUrlList = actions.url.map((url) => {
      if (isExpr(url)) {
        hasBinding = true
        let { rawExpr } = getPrefixExpr(url)
        return `{{${rawExpr}}}`
      }
      return url
    })

    const prefixUrlList = actions.url.map((url) => {
      if (isExpr(url)) {
        hasBinding = true
        let { prefixExpr } = getPrefixExpr(url)
        return prefixExpr
      }
      return url
    })

    if (hasBinding) {
      delete actions.url
      actions['$url'] = rawUrlList
      actions['#url'] = prefixUrlList
    }
  }
}
function markMethod(actions) {
  if (isExpr(actions.method)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(actions.method)
    delete actions.method
    actions['$method'] = rawExpr
    actions['#method'] = prefixExpr
  }
}

function markParams(actions) {
  if (!isObject(actions.params)) return

  // 标准只支持一级结构中绑定变量，做一级结构的key遍历即可
  Object.keys(actions.params).forEach((key) => {
    const value = actions.params[key]
    if (isExpr(value)) {
      let { rawExpr, prefixExpr } = getPrefixExpr(value)
      delete actions.params[key]
      actions.params['$' + key] = rawExpr
      actions.params['#' + key] = prefixExpr
    }
  })
}

// 处理 template 中的字段，增加标记和处理表达式
function postHandleTemplate(template, liteCardRes) {
  if (!isObject(template)) return

  markStyle(template)
  markClass(template)
  markClassList(template)
  markAttr(template)
  markEvents(template)
  markId(template)
  markIs(template)
  markIf(template)
  markFor(template)
  markCustomComp(template, liteCardRes)

  const children = template.children
  if (children && Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      postHandleTemplate(child, liteCardRes)
    }
  }
}

function markKind(oldKind, newKind) {
  if (!oldKind || oldKind < newKind) return newKind
  return oldKind
}

function markCustomComp(template, liteCardRes) {
  if (!isObject(liteCardRes[CARD_ENTRY][TYPE_IMPORT])) return

  const importList = Object.keys(liteCardRes[CARD_ENTRY][TYPE_IMPORT])

  if (importList.includes(template.type)) {
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.COMPONENT)
  }
}

function markIf(template) {
  if (!template.shown) return

  if (isExpr(template.shown)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(template.shown)
    delete template.shown
    template['$shown'] = rawExpr
    template['#shown'] = prefixExpr
  }
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT)
}

function markIs(template) {
  if (!template.is) return

  if (isExpr(template.is)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(template.is)
    delete template.is
    template['$is'] = rawExpr
    template['#is'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markId(template) {
  if (!template.id) return

  if (isExpr(template.id)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(template.id)
    delete template.id
    template['$id'] = rawExpr
    template['#id'] = prefixExpr
  }
  // 节点有id属性，标记为kind=1
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
}

function markFor(template) {
  if (!template.repeat) return

  if (isObject(template.repeat)) {
    if (isExpr(template.repeat.exp)) {
      /**
       * example 1:
        <div for="{{(index, item) in ItemList}}">   ->
        "repeat": {
          "$exp": "ItemList",
          "#exp": ["$", "ItemList"],
          "key": "index",
          "value": "item"
        },

        example 2:
        <div for="{{(index, item) in [1,2,3]}}">   ->
        "repeat": {
          "$exp": "[1, 2, 3]",
          "#exp": "[\"~\",1,2,3]",
          "key": "index",
          "value": "item"
        },
      */
      let { rawExpr, prefixExpr } = getPrefixExpr(template.repeat.exp)
      delete template.repeat.exp
      template.repeat['$exp'] = rawExpr
      template.repeat['#exp'] = prefixExpr
    }
  } else if (isExpr(template.repeat)) {
    /**
      <div for="{{ItemList}}">   ->
      "$repeat": "{{ItemList}}",
    */
    let { rawExpr, prefixExpr } = getPrefixExpr(template.repeat)
    delete template.repeat
    template['$repeat'] = rawExpr
    template['#repeat'] = prefixExpr
  }
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT)
}

function markStyle(template) {
  if (!template.style) return

  const style = template.style
  if (typeof style === 'object') {
    Object.keys(style).forEach((key) => {
      const value = style[key]
      if (isExpr(value)) {
        let { rawExpr, prefixExpr } = getPrefixExpr(value)
        delete template.style[key]
        template.style['$' + key] = rawExpr
        template.style['#' + key] = prefixExpr
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
      }
    })
  } else {
    if (isExpr(style)) {
      let { rawExpr, prefixExpr } = getPrefixExpr(style)
      delete template.style
      template['$style'] = rawExpr
      template['#style'] = prefixExpr
      template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
    }
  }
}

function markClass(template) {
  if (!template.class || template.class.length === 0) return

  if (isExpr(template.class)) {
    let { rawExpr, prefixExpr } = getPrefixExpr(template.class)
    delete template.class
    template['$class'] = rawExpr
    template['#class'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markClassList(template) {
  if (!template.classList || template.classList.length === 0) return

  let hasBinding = false
  const prefixExprList = template.classList.map((classEle) => {
    if (isExpr(classEle)) {
      hasBinding = true
      let { prefixExpr } = getPrefixExpr(classEle)
      return prefixExpr
    }
    return classEle
  })

  if (hasBinding) {
    // 如果 classList 元素有表达式
    delete template.classList
    template['#classList'] = prefixExprList
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markEvents(template) {
  if (template.events) {
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markAttr(template) {
  if (!template.attr) return

  const attr = template.attr
  if (isObject(attr)) {
    Object.keys(attr).forEach((attrKey) => {
      const attrValue = attr[attrKey]
      if (isExpr(attrValue)) {
        let { rawExpr, prefixExpr } = getPrefixExpr(attrValue)
        delete attr[attrKey]
        attr['$' + attrKey] = rawExpr
        attr['#' + attrKey] = prefixExpr
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT.kind)
      }
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

function getPrefixExpr(expr) {
  const res = templateValueToCardCode(expr)
  const parsed = JSON.parse(res)
  if (isSimpleExpr(parsed)) {
    // 简单表达式
    // 目前只有 {{name}}、{{title.name}}、{{title[0]}}、{{[1,2,3]}}、{{ {a: 1} }} 算作简单表达式
    return {
      rawExpr: validator.parseText(expr)[0].value, // {{ name }} -> name
      prefixExpr: parsed // {{ name }} -> ['$', 'name']
    }
  } else {
    // 复杂表达式
    return {
      rawExpr: expr, // {{ a + b }} -> {{ a + b }}
      prefixExpr: parsed // {{ a + b }} -> ["+",["$","a"],["$","b"]]
    }
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

function recordKeys(liteCardRes, templateKeys) {
  const helper = function (obj) {
    if (!obj || typeof obj !== 'object') return

    const keys = Object.keys(obj)
    templateKeys.push(...keys)
    keys.forEach((key) => {
      return helper(obj[key], templateKeys)
    })
  }

  helper(liteCardRes, templateKeys)
}

export function postHandleLiteCardRes(liteCardRes) {
  const uxList = Object.keys(liteCardRes)

  // template
  for (let i = 0; i < uxList.length; i++) {
    const compName = uxList[i]
    postHandleTemplate(liteCardRes[compName][TEMPLATE_KEY], liteCardRes)
  }

  // actions
  for (let i = 0; i < uxList.length; i++) {
    const compName = uxList[i]
    const actionEvents = liteCardRes[compName][ACTIONS_KEY]
    if (actionEvents) {
      Object.keys(actionEvents).forEach((eventName) => {
        postHandleActions(actionEvents[eventName])
      })
    }
  }

  // 用于修改 template 的 key 的 stringify 的顺序，type放第一个，children放最后一个
  let templateKeys = []
  recordKeys(liteCardRes, templateKeys)

  templateKeys = [...new Set(templateKeys.sort())]
    .filter((key) => key !== 'children' && key !== 'type')
    .concat('children')
    .unshift('type')

  return JSON.stringify(liteCardRes, templateKeys)
}
