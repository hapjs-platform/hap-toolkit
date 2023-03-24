/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getIPv4IPAddress } from '@hap-toolkit/shared-utils/'
import createPreview from '@hap-toolkit/server/lib/preview/create-preview'

module.exports = async function preview(target, { port }) {
  const previewApp = await createPreview(target)
  previewApp.listen(port, () => {
    console.log(
      `> 访问以下地址查看 ${target} 的预览:\n` +
        `> 本地: http://localhost:${port}/preview\n` +
        `> 局域网: http://${getIPv4IPAddress()}:${port}/preview`
    )
  })
}
