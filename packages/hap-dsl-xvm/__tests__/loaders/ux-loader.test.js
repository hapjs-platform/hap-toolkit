/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { rowify } = require('hap-dev-utils')
const uxLoader = require('../../lib/loaders/ux-loader')
const { compileOptionsObject } = require('@hap-toolkit/shared-utils/compilation-config')

describe('ux-loader', () => {
  const mockLoader = {
    context: __dirname,
    rootContext: __dirname
  }
  const samples = [
    [
      'normal page',
      `
    <template>
      <div>{{ val }}</div>
    </template>
      `,
      'page',
      'page.ux'
    ],
    [
      'normal page with style',
      `
      <template>
        <div>{{ val }}</div>
      </template>
      <style>
      div {
        color: blue;
      }
      </style>
      `,
      'page',
      'page.ux'
    ],
    [
      'normal page, enablePerformanceCheck',
      `
    <template>
      <div>{{ val }}</div>
    </template>
      `,
      'page',
      'page.ux',
      {
        compileOptionsObject: {
          enablePerformanceCheck: true
        }
      }
    ],
    [
      'without <template /> tag',
      `
      <div> without template tag </div>
      `,
      'page',
      'page.ux'
    ]
  ]
  beforeEach(() => {
    Object.assign(mockLoader, {
      emitError: jest.fn(),
      emitWarning: jest.fn()
    })
  })

  // exports 扩展的参数
  it.each(samples)('%s', async (_, source, type, fileName, extopts = {}) => {
    let resolver
    const promise = new Promise((resolve, reject) => {
      resolver = resolve
    })

    if (extopts.compileOptionsObject && extopts.compileOptionsObject.enablePerformanceCheck) {
      compileOptionsObject.enablePerformanceCheck =
        extopts.compileOptionsObject.enablePerformanceCheck
    }
    const loader = Object.assign({}, mockLoader, {
      resourcePath: path.resolve(__dirname, fileName),
      resourceQuery: `?uxType=${type}`,
      callback(err, result) {
        resolver([err, result])
      },
      async: function () {
        return this.callback
      }
    })

    uxLoader.call(loader, source)
    const [error, result] = await promise
    compileOptionsObject.enablePerformanceCheck = false

    expect(error).toMatchSnapshot('error')
    expect(rowify([source, result])).toMatchSnapshot('source-vs-result')
    expect(loader.emitError.mock.calls).toMatchSnapshot('emitted errors')
    expect(loader.emitWarning.mock.calls).toMatchSnapshot('emitted warnings')
  })
})
