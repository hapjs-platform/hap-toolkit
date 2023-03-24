/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { wipeDynamic } = require('hap-dev-utils')
const { compilePage } = require('../../utils')

describe('测试全局样式', () => {
  it('全局样式正确提取', async () => {
    const stats = await compilePage('Helloworld/app.ux', 'app')
    const json = stats.toJson({source: true})
    expect(json.modules.length).toMatchInlineSnapshot(`3`)

    json.modules.forEach(module => {
      const id = wipeDynamic(module.id)
      expect(wipeDynamic(module.source)).toMatchSnapshot(id)
    })
  }, 20000)
})
