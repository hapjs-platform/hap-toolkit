/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { replaceModuleImport } = require('@hap-toolkit/compiler/lib/script').default

describe('compile functions', () => {
  it('replaceModuleImport', () => {
    const importExp1 = replaceModuleImport(`
      import $utils from './utils'
      import fetch from '@system.fetch'
      import prompt from '@system.prompt'
    `)
    const importExp2 = replaceModuleImport(`
      import $utils from './utils'
      import system from '@system'
    `)
    const requireExp1 = replaceModuleImport(`
      const fetch = require('@system.fetch')
      const prompt = require("@system.prompt")
    `)
    const requireExp2 = replaceModuleImport(`
      const fetch = require('@system.fetch')
      const system = require("@system")
    `)

    expect(importExp1).toMatchSnapshot()
    expect(importExp2).toMatchSnapshot()

    expect(requireExp1).toMatchSnapshot()
    expect(requireExp2).toMatchSnapshot()
  })
})
