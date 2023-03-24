/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable */
'use strict'

var Hex = {},
  decoder

Hex.decode = function (a) {
  var i
  if (decoder === undefined) {
    var hex = '0123456789ABCDEF',
      ignore = ' \f\n\r\t\u00A0\u2028\u2029'
    decoder = []
    for (i = 0; i < 16; ++i) decoder[hex.charAt(i)] = i
    hex = hex.toLowerCase()
    for (i = 10; i < 16; ++i) decoder[hex.charAt(i)] = i
    for (i = 0; i < ignore.length; ++i) decoder[ignore.charAt(i)] = -1
  }
  var out = [],
    bits = 0,
    char_count = 0
  for (i = 0; i < a.length; ++i) {
    var c = a.charAt(i)
    if (c == '=') break
    c = decoder[c]
    if (c == -1) continue
    if (c === undefined) throw 'Illegal character at offset ' + i
    bits |= c
    if (++char_count >= 2) {
      out[out.length] = bits
      bits = 0
      char_count = 0
    } else {
      bits <<= 4
    }
  }
  if (char_count) throw 'Hex encoding incomplete: 4 bits missing'
  return out
}

module.exports = Hex
