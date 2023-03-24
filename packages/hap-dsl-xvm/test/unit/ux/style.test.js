/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


const path = require('@jayfate/path')
const { wipeDynamic } = require('hap-dev-utils')
const { resolveEntries, compileFiles } = require('../../utils')

/**
 * Style
 */
describe('Style编译测试', () => {

  it('comile style', async () => {
    const basedir = path.resolve(__dirname, '../../case/ux/')
    const entries = resolveEntries(basedir, 'TestStyle')

    const stats = await compileFiles(entries)
    const json = stats.toJson({source: true})

    json.modules.forEach(module => {
      const id = wipeDynamic(module.id)
      expect(wipeDynamic(module.source)).toMatchSnapshot(id)
    })
  }, 2 * 60 * 1000)
})
