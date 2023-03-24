/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import loaderUtils from 'loader-utils'
import { parseFragmentsWithCache } from '@hap-toolkit/compiler'

import { splitSourceLine, generateMap, consumeMap, FRAG_TYPE } from './common/utils'

module.exports = function (source, inputSourceMap) {
  const callback = this.async()

  // 获取query参数
  const loaderQuery = loaderUtils.parseQuery(this.query)

  const type = loaderQuery.type
  const resourcePath = this.resourcePath

  // 解析数字索引
  let index = loaderQuery.index
  if (index != null && index.match(/^\d+$/)) {
    index = parseInt(index)
  }

  Promise.resolve(parseFragmentsWithCache(source, resourcePath)[type])
    .then((result) => {
      if (index != null) {
        result = result[index]
      }
      // 节点的文本内容
      let content = result.content.trim()

      // 只有js文件生成map
      let map
      if (this.sourceMap && (type === FRAG_TYPE.SCRIPT || type === FRAG_TYPE.IMPORT)) {
        const contentLineStart = result.location.line

        let cmap
        if (inputSourceMap) {
          cmap = consumeMap(this, source, inputSourceMap)
          source = cmap.sourcesContent.join('')
        }

        const iterator = splitSourceLine(content).map((input, line) => {
          line = line + 1
          let originalLine = line + contentLineStart
          const generatedLine = line
          if (cmap) {
            // 映射到原始代码
            originalLine = cmap.mapping[`line-${originalLine}-column-0`].line
          }
          return {
            original: {
              line: originalLine,
              column: 0
            },
            generated: {
              line: generatedLine,
              column: 0
            }
          }
        })

        map = generateMap(this, source, iterator)
      }

      return [content, map]
    })
    .then(([content, map]) => {
      callback(null, content, (map && map.toJSON()) || inputSourceMap)
    })
    .catch((e) => {
      callback(e, '')
    })
}
