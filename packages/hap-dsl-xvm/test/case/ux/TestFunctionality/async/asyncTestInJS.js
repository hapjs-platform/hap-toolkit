/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

async function bar() {
  return 'bar'
}

async function foo() {
  const ret1 = await bar()
  console.info('ret1: ', ret1)
}

foo()
