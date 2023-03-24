/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto'

let _cryptoSignFunction = null

function setRemoteCryptoSignFunction(fn) {
  _cryptoSignFunction = fn
}

function getRemoteCryptoSignFunction() {
  return _cryptoSignFunction
}

/**
 * 使用RSA-SHA256
 * @param buffer
 * @param prikey
 */
function defaultCryptoSignFunction(buffer, prikey) {
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(buffer)
  return signer.sign(prikey)
}

export { setRemoteCryptoSignFunction, getRemoteCryptoSignFunction, defaultCryptoSignFunction }
