/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const path = require('@jayfate/path')
const { rowify } = require('hap-dev-utils')
const appLoader = require('../../lib/loaders/app-loader')

describe('app-loader', () => {
  const mockLoader = {
    context: __dirname,
    rootContext: __dirname,
    resourceQuery: `?uxType=app`,
    resourcePath: path.resolve(__dirname, 'app.ux')
  }
  const samples = [
    [
      'normal',
      `
    <script>
    export default {
      method1() {
        console.log('this is method1')
      }
    }
    </script>
      `
    ],
    [
      'without <script/> tag',
      `
      <!-- no script tag -->
      `
    ]
  ]
  beforeEach(() => {
    Object.assign(mockLoader, {
      emitError: jest.fn(),
      emitWarning: jest.fn()
    })
  })

  it.each(samples)('%s', async (_, source) => {
    const loader = Object.assign({}, mockLoader)
    const result = await appLoader.call(loader, source)

    expect(rowify([source, result])).toMatchSnapshot('source-vs-result')
    expect(loader.emitError.mock.calls).toMatchSnapshot('emitted errors')
    expect(loader.emitWarning.mock.calls).toMatchSnapshot('emitted warnings')
  })
})
