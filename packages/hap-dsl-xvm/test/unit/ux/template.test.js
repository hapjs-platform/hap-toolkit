/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


const path = require('@jayfate/path')
const { wipeDynamic } = require('hap-dev-utils')
const { resolveEntries, compileFiles } = require('../../utils')

/**
 * Template
 */
describe('Template 编译测试', () => {
  it('ux templates', async () => {
    const basedir = path.resolve(__dirname, '../../case/ux/')
    const entries = resolveEntries(basedir, 'TestTemplate')
    const stats = await compileFiles(entries, 'ux')

    const json = stats.toJson({source: true})
    json.modules.filter(mod => mod.source).forEach(module => {
      const id = wipeDynamic(module.id)
      expect(wipeDynamic(module.source)).toMatchSnapshot(id)
    })
  }, 20000)
})
