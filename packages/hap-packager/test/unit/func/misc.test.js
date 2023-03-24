/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const { serialize, sortFilesBy } = require('../../../lib/common/utils')

/* eslint-disable no-unused-vars, semi */

describe('misc', () => {
  it('sortFilesBy() 根据给定参考顺序数组排序', () => {
    const files = [
      'Common/logo.png',
      'Demo/',
      'Demo/index.js.map',
      'Demo/screenshot.png',
      'DemoDetail/',
      'DemoDetail/firefox.jpg',
      'DemoDetail/index.js',
      'DemoDetail/index.js.map',
      'Demo/index.js',
      'app.js',
      'app.js.map',
      'manifest.json',
      'i18n/zh.json',
      'i18n/en.json'
    ]
    const priorities = [
      /^i18n\/.+\.json$/i,
      'manifest.json',
      'app.js',
      /^Demo\/$/,
      /^Demo\/.+/,
      /^common\//i
    ]

    const head = sortFilesBy(files, priorities).slice(0, 8)
    expect(head).toMatchSnapshot()
  })
})

describe('serialize', () => {
  it('Serialize is a function', () => {
    expect(typeof serialize).toBe('function')
  })

  it('Normal Object', () => {
    expect(serialize({ a: 1, b: 2 })).toBe('{"a":1,"b":2}')
  })

  it('Normal Array', () => {
    expect(serialize([1, 2, 3])).toBe('[1,2,3]')
    expect(serialize([1, 2, 3], 2)).toBe('[\n  1,\n  2,\n  3\n]')
    expect(serialize(['ab', 'bc'])).toBe('["ab","bc"]')
    expect(serialize(['ab', 'bc'], 2)).toBe('[\n  "ab",\n  "bc"\n]')
  })

  it('Nested object', () => {
    const target = {
      str: 'string',
      num: 0,
      obj: { foo: 'foo' },
      arr: [1, 2, 3],
      bool: true,
      nil: null
    }
    expect(serialize(target)).toMatchSnapshot()
    expect(serialize(target, 2)).toMatchSnapshot()
  })

  it('Object contains functions', () => {
    const target = {
      a: null,
      b: 2,
      f: function () {
        console.log('hello')
        return function () {
          return '__FKS_1_FKE__0' + '__FKS_1_FKE__1'
        }
      },
      f2: function () {
        return function () {
          return function () {
            return Math.random()
          }
        }
      }
    }
    expect(serialize(target)).toMatchSnapshot()
    expect(serialize(target, 2)).toMatchSnapshot()
  })

  it('Special keys', () => {
    const orignRand = Math.random
    Math.random = function () {
      return 0x101
    }
    const target = {
      a: null,
      b: 2,
      f: function () {
        console.log('hello')
        return function () {
          return '__FKS_1_FKE__0' + '__FKS_1_FKE__1'
        }
      },
      __FKS_1_FKE__1: function () {
        return function () {
          return function () {
            return Math.random()
          }
        }
      },
      f2: function () {
        return function () {
          return function () {
            return Math.random()
          }
        }
      }
    }
    expect(serialize(target)).toMatchSnapshot()
    expect(serialize(target, 2)).toMatchSnapshot()
    Math.random = orignRand
  })

  it('Single function', () => {
    const target = function singleFunction() {}
    expect(serialize(target)).toMatchSnapshot()
  })

  it('Function with arguments', () => {
    const target = function funcHasArgs(arg1, arg2) {}
    expect(serialize(target)).toMatchSnapshot()
  })

  it('primitive data types', () => {
    expect(serialize(null)).toBe('null')
    expect(serialize(undefined)).toBeUndefined()
    expect(serialize(false)).toBe('false')
    expect(serialize(1)).toBe('1')
  })
})
