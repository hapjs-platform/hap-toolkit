/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable */
'use strict'

var Base64 = {},
  decoder

Base64.decode = function (a) {
  var i
  if (decoder === undefined) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      ignore = '= \f\n\r\t\u00A0\u2028\u2029'
    decoder = []
    for (i = 0; i < 64; ++i) decoder[b64.charAt(i)] = i
    for (i = 0; i < ignore.length; ++i) decoder[ignore.charAt(i)] = -1
  }
  var out = []
  var bits = 0,
    char_count = 0
  for (i = 0; i < a.length; ++i) {
    var c = a.charAt(i)
    if (c == '=') break
    c = decoder[c]
    if (c == -1) continue
    if (c === undefined) throw 'Illegal character at offset ' + i
    bits |= c
    if (++char_count >= 4) {
      out[out.length] = bits >> 16
      out[out.length] = (bits >> 8) & 0xff
      out[out.length] = bits & 0xff
      bits = 0
      char_count = 0
    } else {
      bits <<= 6
    }
  }
  switch (char_count) {
    case 1:
      throw 'Base64 encoding incomplete: at least 2 bits missing'
    case 2:
      out[out.length] = bits >> 10
      break
    case 3:
      out[out.length] = bits >> 16
      out[out.length] = (bits >> 8) & 0xff
      break
  }
  return out
}

Base64.re =
  /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/
Base64.unarmor = function (a) {
  var m = Base64.re.exec(a)
  if (m) {
    if (m[1]) a = m[1]
    else if (m[2]) a = m[2]
    else throw 'RegExp out of sync'
  }
  return Base64.decode(a)
}

module.exports = Base64
