/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict'
const path = require('@jayfate/path')
const { processImport } = require('@hap-toolkit/compiler/lib/style/process')
const testCssDir = path.resolve(__dirname, '../../case/ux/Helloworld/Common')

const code = `
/* comment */
@import './common.css' screen and (orientation: portrait);
.box {
  width: 100px;
}
@import './common2.css' screen and (orientation: portrait);

`

describe('测试processImport函数', () => {
  it('process import', async () => {
    const result = processImport(code, testCssDir, [], [])
    expect(result).toMatchSnapshot()
  })
})
