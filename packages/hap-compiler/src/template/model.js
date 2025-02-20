/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { colorconsole } from '@hap-toolkit/shared-utils'
import exp from './exp'
import { isValidValue } from '../utils'
import validator from './validator.js'

/**
 * 构建model属性
 * @param {string} name model 绑定表达式，如：model:name
 * @param {string} value model 绑定的数据名
 * @param {object} output 构建的输出结果
 * @param {object} node parse5 生成的 node 节点
 * @param {object} locationInfo 位置信息
 * @param {object} options 配置信息
 */
export default function model(name, value, output, node, locationInfo, options) {
  // 获取model指令绑定的属性名，如：model:name="{{ youName }}"，绑定的是属性name
  const attrName = name.replace(/^model:/, '')

  // model指令格式校验
  if (!attrName) {
    colorconsole.warn(`\`${node.tagName}\` 组件model指令绑定的属性不能为空`)
    return false
  }

  if (!isValidValue(value)) {
    return false
  }

  // 补全绑定值的双花括号，如：model:name="youName"，为youName补全为{{youName}}
  value = exp.addExprffix(value)

  // 组件标签名
  const tag = output.result.type
  // 组件type属性的值
  const type = getBindingAttr(node, 'type') || ''

  let isDynamicType = false
  // input type 为动态时绑定的属性和事件需要额外处理
  if (tag === 'input' && type.match(/^this\.+/)) {
    isDynamicType = true
  }

  /* eslint-disable no-eval */
  if (!isDynamicType) {
    if (tag === 'select') {
      genSelectModel(value, output)
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(node, attrName, value, output)
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(node, attrName, value, output)
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(attrName, value, output)
    } else if (
      tag === 'component' ||
      !validator.isReservedTag(tag) ||
      (options.importNames && options.importNames.indexOf(tag) > -1)
    ) {
      // 动态组件、自定义组件model指令处理
      genComponentModel(node, attrName, value, output, locationInfo, options)
    }
  } else {
    genDynamicModel(node, attrName, value, output, type)
  }
}

/**
 * 构建 type 为 checkbox 的 input 组件的 model 属性
 * @param {object} node parse5 生成的 node 节点
 * @param {string} attrName model 绑定的属性名
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 * @returns {object} 构建过程中生成的代码字符串组成的对象，供 genDynamicModel 使用
 */
function genCheckboxModel(node, attrName, value, output) {
  const expValue = exp(value, false)
  const valueBinding = getBindingAttr(node, 'value', true) || 'null'
  const trueValueBinding = getBindingAttr(node, 'true-value', true) || 'true'
  const falseValueBinding = getBindingAttr(node, 'false-value', true) || 'false'

  const attrCheckedCode = `
    if (Array.isArray(${expValue})) {
      return ${expValue}.indexOf(${valueBinding}) > -1
    } else {
      return ${expValue}${trueValueBinding === 'true' ? '' : `=== ${trueValueBinding}`}
    }`

  const eventChangeCode = `
    const checked = evt.target.checked;
    if (Array.isArray(${expValue})) {
      const index = ${expValue}.indexOf(${valueBinding})
      if (checked) {
        index < 0 && (${expValue} = ${expValue}.concat([${valueBinding}]))
      } else {
        index > -1 && (${expValue} = ${expValue}.slice(0, index).concat(${expValue}.slice(index + 1)))
      }
    } else {
      ${expValue} = checked ? ${trueValueBinding} : ${falseValueBinding}
    }`

  const isNewJSCard = output.isNewJSCard
  if (isNewJSCard) {
    addAttr(output.result, attrName, `(function() {${attrCheckedCode}})`)
    addAttr(output.result, attrName + 'Raw', value)
    addHandler(output.result, 'change', `function(evt) {${eventChangeCode}}`)
  } else {
    addAttr(output.result, attrName, eval(`(function() {${attrCheckedCode}})`))
    addHandler(output.result, 'change', eval(`(function(evt) {${eventChangeCode}})`))
  }
  return {
    attr: { checked: attrCheckedCode },
    events: { change: eventChangeCode }
  }
}

/**
 * 构建 type 为 radio 时的 input 组件的 model 属性
 * @param {object} node parse5 生成的 node 节点
 * @param {string} attrName model 绑定的属性名
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 * @returns {object} 构建过程中生成的代码字符串组成的对象，供 genDynamicModel 使用
 */
function genRadioModel(node, attrName, value, output) {
  const valueBinding = getBindingAttr(node, 'value', true) || 'null'

  const attrCheckedCode = `return ${exp(value, false)} === ${valueBinding}`
  const eventChangeCode = `${exp(value, false)} = ${valueBinding}`

  const isNewJSCard = output.isNewJSCard
  if (isNewJSCard) {
    addAttr(output.result, attrName, `(function() {${attrCheckedCode}})`)
    addAttr(output.result, attrName + 'Raw', value)
    addHandler(output.result, 'change', `function(evt) {${eventChangeCode}}`)
  } else {
    addAttr(output.result, attrName, eval(`(function() {${attrCheckedCode}})`))
    addHandler(output.result, 'change', eval(`(function(evt) {${eventChangeCode}})`))
  }

  return {
    attr: { checked: attrCheckedCode },
    events: { change: eventChangeCode }
  }
}

/**
 * 构建 select 组件的 model
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 */
function genSelectModel(value, output) {
  const isNewJSCard = output.isNewJSCard
  if (isNewJSCard) {
    addHandler(output.result, 'change', `function(evt) { ${exp(value, false)} = evt.newValue}`)
  } else {
    addHandler(
      output.result,
      'change',
      eval(`(function(evt) { ${exp(value, false)} = evt.newValue})`)
    )
  }
}

/**
 * 构建 type 为 text 的 input 组件和 textarea 组件的 model 属性
 * @param {string} attrName model 绑定的属性名
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 * @returns {object} 构建过程中生成的代码字符串组成的对象，供 genDynamicModel 使用
 */
function genDefaultModel(attrName, value, output) {
  const eventChangeCode = `${exp(value, false)} = evt.target.value`
  const isNewJSCard = output.isNewJSCard
  const isLite = output.isLite
  if (isNewJSCard) {
    addAttr(output.result, attrName, exp(value, true, isLite, isNewJSCard))
    addAttr(output.result, attrName + 'Raw', value)
    addHandler(output.result, 'change', `function(evt) {${eventChangeCode}}`)
  } else {
    addAttr(output.result, attrName, exp(value))
    addHandler(output.result, 'change', eval(`(function(evt) {${eventChangeCode}})`))
  }
  return { events: { change: eventChangeCode } }
}

/**
 * 构建自定义组件的 model 属性
 * @param {object} node parse5 生成的 node 节点
 * @param {string} attrName model 绑定的属性名
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 * @param {object} locationInfo 位置信息
 * @param {object} options 配置信息
 */
function genComponentModel(node, attrName, value, output, locationInfo, options) {
  // 自定义组件model指令绑定的属性，依然作为普通属性处理
  validator.checkAttr(attrName, value, output, node.tagName, locationInfo, options)

  const isNewJSCard = output.isNewJSCard
  if (isNewJSCard) {
    addHandler(
      output.result,
      `update:${attrName}`,
      `function(evt) { ${exp(value, false)} = evt.detail}`
    )
  } else {
    // 为自定义组件绑定update:${attrName}事件，接收组件内部emit的update:${attrName}事件
    addHandler(
      output.result,
      `update:${attrName}`,
      eval(`(function(evt) { ${exp(value, false)} = evt.detail})`)
    )
  }
}

/**
 * 构建 type 为动态值时的 input 组件的 model 属性
 * @param {object} node parse5 生成的 node 节点
 * @param {string} attrName model 绑定的属性名
 * @param {string} value model 绑定的值
 * @param {object} output 构建的输出结果
 * @param {string} expType type 属性绑定的值
 */
function genDynamicModel(node, attrName, value, output, expType) {
  const checkboxCode = genCheckboxModel(node, attrName, value, output)
  const radioCode = genRadioModel(node, attrName, value, output)
  const textCode = genDefaultModel(attrName, value, output)
  const isNewJSCard = output.isNewJSCard
  const isLite = output.isLite
  if (isNewJSCard) {
    addAttr(output.result, attrName, exp(value, true, isLite, isNewJSCard))
    addAttr(output.result, attrName + 'Raw', value)

    addAttr(
      output.result,
      'checked',
      `(function() { 
        if (${expType} === 'checkbox') {
          ${checkboxCode.attr.checked}
        } else if (${expType} === 'radio') {
          ${radioCode.attr.checked}
        } else {
          return false
        }
      })
    `
    )

    addAttr(output.result, 'checkedRaw', value)
    addHandler(
      output.result,
      'change',
      `function(evt) {
        if (${expType} === 'checkbox') {
          ${checkboxCode.events.change}
        } else if (${expType} === 'radio') {
          ${radioCode.events.change}
        } else {
          ${textCode.events.change}
        }
      }`
    )
  } else {
    addAttr(output.result, attrName, exp(value))

    addAttr(
      output.result,
      'checked',
      eval(`
      (function() { 
        if (${expType} === 'checkbox') {
          ${checkboxCode.attr.checked}
        } else if (${expType} === 'radio') {
          ${radioCode.attr.checked}
        } else {
          return false
        }
      })
    `)
    )

    addHandler(
      output.result,
      'change',
      eval(`
      (function(evt) {
        if (${expType} === 'checkbox') {
          ${checkboxCode.events.change}
        } else if (${expType} === 'radio') {
          ${radioCode.events.change}
        } else {
          ${textCode.events.change}
        }
      })
    `)
    )
  }
}

/**
 * 获取节点上绑定的属性的值
 * @param {object} node parse5 生成的 node 节点
 * @param {string} attrName 想要获取值的属性名
 * @param {boolean} addQuotation 是否对不是插值的结果（非this.xxx）添加双引号包裹。如name -> "name"
 * @returns {string} 属性对应的值，当为插值时返回 this.xxx
 */
function getBindingAttr(node, attrName, addQuotation = false) {
  const attrs = node.attrs || []
  for (let i = 0; i < attrs.length; i++) {
    let name = attrs[i].name
    const inMatch = name.match(/^:+/)
    if (inMatch) {
      name = name.slice(inMatch.length)
    }
    if (name === attrName) {
      const expValue = exp(attrs[i].value, false)
      if (addQuotation && !expValue.match(/^this\.+/)) {
        return `"${expValue}"`
      }
      return expValue
    }
  }
}

/**
 * 往结果上添加属性
 * @param {object} result 输出的结果
 * @param {string} name 需要添加的属性名
 * @param {function} value 获取值时需要执行的回调
 */
function addAttr(result, name, value) {
  ;(result.attr || (result.attr = {}))[name] = value
}

/**
 * 往结果上添加事件
 * @param {object} result 输出的结果
 * @param {string} name 需要添加的事件名
 * @param {function} value 事件触发时需要执行的回调
 */
function addHandler(result, name, value) {
  ;(result.events || (result.events = {}))[name] = value
}
