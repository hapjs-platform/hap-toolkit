/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

console.log('hello worker')

postMessage({
  msg: 'hello from worker: ' + utils.test(),
  buffer: utils.str2ab('hello arrayBuffer from worker')
})

onMessage((msg) => {
  console.log('[Worker] on appservice message', msg)
  const buffer = msg.buffer
  console.log('[Worker] on appservice buffer length ', buffer)
  console.log('[Worker] on appservice buffer', utils.ab2str(buffer))
})
