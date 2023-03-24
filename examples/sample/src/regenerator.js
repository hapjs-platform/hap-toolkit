/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const injectRef = Object.getPrototypeOf(global) || global

// 注入regeneratorRuntime
injectRef.regeneratorRuntime = require('@babel/runtime/regenerator')
