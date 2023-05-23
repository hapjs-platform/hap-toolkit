/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


const path = require('path/posix')
const { wipeDynamic } = require('hap-dev-utils')
const { resolveTestEntries, compileFiles } = require('../../utils')

/**
 * Component
 */
describe('Component 编译测试', () => {
  it('ux components', async () => {
    const basedir = path.resolve(__dirname, '../../case/ux/')
    const entries = resolveTestEntries(basedir, 'TestComponent')

    const stats = await compileFiles(entries)

    const json = stats.toJson({source: true})

    json.modules.filter(module => module.source).forEach(module => {
      const id = wipeDynamic(module.id)
      expect(wipeDynamic(module.source)).toMatchSnapshot(id)
    })
  }, 20000)
})
