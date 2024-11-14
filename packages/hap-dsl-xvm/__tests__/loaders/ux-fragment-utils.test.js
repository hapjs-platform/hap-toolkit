/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { parseFragmentsWithCache, parseTemplate } = require('@hap-toolkit/compiler')
const { processImportFrag } = require('../../lib/loaders/ux-fragment-utils')

describe('ux-fragment-utils', () => {
  const mockLoader = {
    emitError: jest.fn(),
    emitWarning: jest.fn()
  }
  beforeEach(() => {
    mockLoader.emitError = jest.fn()
    mockLoader.emitWarning = jest.fn()
  })
  describe('processImportFrag', () => {
    it('import without src', () => {
      const code = `
    <import name="compOne"></import>
    <template>
      <div>hello</div>
    </template>
    `
      const frags = parseFragmentsWithCache(code, '/mock/path')
      processImportFrag(mockLoader, frags.import)

      expect(mockLoader.emitError.mock.calls).toMatchInlineSnapshot(`Array []`)
      expect(mockLoader.emitWarning.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            [Error: 导入组件需要设置属性 \`src\` ],
          ],
        ]
      `)
    })
  })

  it('import name is reserved', () => {
    const code = `
    <import src="./comp1.ux" name="div"></import>
    <template>
      <div>hello</div>
    </template>
    `
    const frags = parseFragmentsWithCache(code, '/mock/path')
    // bypass validate
    frags.import.forEach((imp) => {
      imp.isValid = true
      imp.srcPath = '/mock/path'
    })
    processImportFrag(mockLoader, frags.import, [])

    expect(mockLoader.emitError.mock.calls).toMatchInlineSnapshot(`Array []`)
    expect(mockLoader.emitWarning.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          [Error: 导入组件的属性 \`name\` 不能使用保留字: div],
        ],
      ]
    `)
  })

  it('is not TextContentAtomic tag prompt warning', () => {
    const code = `
      <div>
        <div>div</div>
        <list>list</list>
        <image>image</image>
        <slider>slider</slider>
        <text>text</text>
        <div>
          <div>div <text>text</text></div>
        </div>
      </div>
    `
    const { log } = parseTemplate(code, { filePath: '/mock/path' })

    expect(log[0].reason).toMatch('Warn: 组件 div 不支持文本内容作为子节点')
    expect(log[1].reason).toMatch('Warn: 组件 list 不支持文本内容作为子节点')
    expect(log[2].reason).toMatch('Warn: 组件 div 不支持文本内容作为子节点')
  })
})
