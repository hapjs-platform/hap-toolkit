/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const EventEmitter = require('events')

const eventBus = new EventEmitter()

eventBus.PACKAGER_BUILD_DONE = 'PACKAGER.BUILD_DONE'

eventBus.PACKAGER_WATCH_START = 'PACKAGER.WATCH_START'

eventBus.PACKAGER_BUILD_PROGRESS = 'PACKAGER.PACKAGER_BUILD_PROGRESS'

export { eventBus }
