/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import SocketIO from 'socket.io'
import { colorconsole, stripPrefixForIPV4MappedIPV6Address } from '@hap-toolkit/shared-utils'

export function createSocketServer(server, app) {
  const io = SocketIO(server)
  // 暂时绑定io
  app.context.io = io

  io.on('connection', (socket) => {
    io.on('error', (err) => {
      colorconsole.error(`### App Socket Server ### websocket server发生错误: ${err.message}`)
    })
    colorconsole.info(
      `### App Socket Server ### websocket用户(${stripPrefixForIPV4MappedIPV6Address(
        socket.conn.remoteAddress
      )})连入到websocket server`
    )

    socket.on('disconnect', () => {
      colorconsole.info(`### App Socket Server ### websocket client与websocket server断开`)
      io.emit('user disconnected')
    })
  })
}
