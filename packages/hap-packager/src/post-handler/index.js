import { templateValueToCardCode } from '@aiot-toolkit/card-expression'
import { templater } from '@hap-toolkit/compiler'
const { validator } = templater

const CARD_ENTRY = '#entry'
const TYPE_IMPORT = 'import'
// 需要进行后处理的模块key
const TEMPLATE_KEY = 'template'
const ACTIONS_KEY = 'actions'

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
  // 如果有表达式，则用前缀方式优化
  if (isExpr(actions.type)) {
    const prefixExpr = getPrefixExpr(actions.type)
    delete actions.type
    actions['$type'] = prefixExpr
  }
}

function markUrl(actions) {
  // 如果有表达式，则用前缀方式优化
  if (isExpr(actions.url)) {
    const prefixExpr = getPrefixExpr(actions.url)
    delete actions.url
    actions['$url'] = prefixExpr
  }
}
function markMethod(actions) {
  // 如果有表达式，则用前缀方式优化
  if (isExpr(actions.method)) {
    const prefixExpr = getPrefixExpr(actions.method)
    delete actions.method
    actions['$method'] = prefixExpr
  }
}

function markParams(actions) {
  if (!isObject(actions.params)) return

  // 标准只支持一级结构中绑定变量，做一级结构的key遍历即可
  Object.keys(actions.params).forEach((key) => {
    const value = actions.params[key]
    if (isExpr(value)) {
      const prefixExpr = getPrefixExpr(value)
      delete actions.params[key]
      actions.params['$' + key] = prefixExpr
    }
  })
}

function postHandleTemplate(template, liteCardRes) {
  if (!isObject(template)) return

  markStyle(template)
  markClassList(template)
  markAttrs(template)
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
  // 如果有表达式，则用前缀方式优化
  if (isExpr(template.shown)) {
    const prefixExpr = getPrefixExpr(template.shown)
    delete template.shown
    template['$shown'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT)
  }
}

function markIs(template) {
  // 如果有表达式，则用前缀方式优化
  if (isExpr(template.is)) {
    const prefixExpr = getPrefixExpr(template.is)
    delete template.is
    template['$is'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markId(template) {
  if (!template.id) return

  // 如果有表达式，则用前缀方式优化
  if (isExpr(template.id)) {
    const prefixExpr = getPrefixExpr(template.id)
    delete template.id
    template['$id'] = prefixExpr
  }
  // 节点有id属性，标记为kind=1
  template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
}

function markFor(template) {
  if (isObject(template.repeat) && isExpr(template.repeat.exp)) {
    /**
      <div for="{{(index, item) in ItemList}}">   ->
      "repeat": {
        "$exp": "{{ItemList}}",
        "key": "index",
        "value": "item"
      },

      <div for="{{(index, item) in [1,2,3]}}">   ->
      "repeat": {
        "$exp": "[\"~\",1,2,3]",
        "key": "index",
        "value": "item"
      },
    */
    const prefixExpr = getPrefixExpr(template.repeat.exp)
    delete template.repeat.exp
    template.repeat['$exp'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT)
  } else if (isExpr(template.repeat)) {
    /**
      <div for="{{ItemList}}">   ->
      "$repeat": "{{ItemList}}",
    */
    const prefixExpr = getPrefixExpr(template.repeat)
    delete template.repeat
    template['$repeat'] = prefixExpr
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.FRAGMENT)
  }
}

function markStyle(template) {
  if (!template.style) return

  const style = template.style
  if (typeof style === 'object') {
    Object.keys(style).forEach((key) => {
      const value = style[key]
      // 如果有表达式，则用前缀方式优化
      if (isExpr(value)) {
        const prefixExpr = getPrefixExpr(value)
        delete template.style[key]
        template.style['$' + key] = prefixExpr
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
      }
    })
  } else {
    // 如果有表达式，则用前缀方式优化
    if (isExpr(style)) {
      const prefixExpr = getPrefixExpr(style)
      delete template.style
      template['$style'] = prefixExpr
      template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
    }
  }
}

function markClassList(template) {
  if (!template.classList || template.classList.length === 0) return

  let hasBinding = false
  const cList = template.classList.map((classEle) => {
    // 如果有表达式，则用前缀方式优化
    if (isExpr(classEle)) {
      hasBinding = true
      return getPrefixExpr(classEle)
    }
    return classEle
  })
  if (hasBinding) {
    // 如果 classList 元素有表达式
    delete template.classList
    template['$classList'] = cList
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markEvents(template) {
  if (template.events) {
    template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
  }
}

function markAttrs(template) {
  const attrs = template.attr
  if (isObject(attrs)) {
    Object.keys(attrs).forEach((attrKey) => {
      const attrValue = attrs[attrKey]
      // 如果有表达式，则用前缀方式优化
      if (isExpr(attrValue)) {
        const prefixExpr = getPrefixExpr(attrValue)
        delete attrs[attrKey]
        attrs['$' + attrKey] = prefixExpr
        template.kind = markKind(template.kind, ENUM_KIND_TYPE.ELEMENT)
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
    // 表达式是简单标识符，直接返回模板字符串。如： {{ name }} -> {{ name }}
    return expr
  } else {
    // 表达式为复杂表达式，返回前缀表达式字符串。如： {{ $item.name }} -> "[\".\",[\"$\",\"$item\"],\"name\"]"
    return res
  }
}

function isSimpleExpr(expr) {
  return Array.isArray(expr) && expr.length === 2 && expr[0] === '$'
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
