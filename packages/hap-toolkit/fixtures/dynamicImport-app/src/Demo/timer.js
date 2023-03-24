/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const a = 1
export const b = 2

function timerGenerator() {
  const time = new Date().toLocaleString()

  console.log(`TIME: ${time}`)

  return time
}

export default timerGenerator
