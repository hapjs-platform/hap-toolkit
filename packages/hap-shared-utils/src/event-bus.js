/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const EventEmitter = require('events')

module.exports = new EventEmitter()

module.exports.PACKAGER_BUILD_DONE = 'PACKAGER.BUILD_DONE'

module.exports.PACKAGER_WATCH_START = 'PACKAGER.WATCH_START'

module.exports.PACKAGER_BUILD_PROGRESS = 'PACKAGER.PACKAGER_BUILD_PROGRESS'
