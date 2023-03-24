/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

// 模板属性名全写-缩写对照表
const templateAttrMap = {
  type: 't',
  attr: 'a',
  classList: 'cL',
  style: 's',
  events: 'e',
  children: 'c'
}

/**
 * 压缩模板属性名
 * @param jsonObject
 */
function compressTemplateAttr(jsonObject) {
  if (!jsonObject) {
    return
  }

  if (jsonObject.children) {
    for (let i = 0, len = jsonObject.children.length; i < len; i++) {
      const child = jsonObject.children[i]
      compressTemplateAttr(child)
    }
  }

  for (const k in jsonObject) {
    if (templateAttrMap[k]) {
      const kAbbr = templateAttrMap[k]
      jsonObject[kAbbr] = jsonObject[k]
      delete jsonObject[k]
    }
  }
}

export { compressTemplateAttr }
