/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs-extra'
import glob from 'glob'

import { signForRpk, signForRpks } from '@hap-toolkit/packager/lib/index'
import { relateCwd, colorconsole } from '@hap-toolkit/shared-utils'
import { projectPath } from '@hap-toolkit/shared-utils/config'

/**
 * 对rpk重新签名
 * @param { Object } options 重新签名的选项
 * @param { String } options.sign 传入存放公钥和私钥的签名文件夹
 * @param { String } options.file 需要重新签名的文件，若没有传入则使用origin文件夹
 * @param { String } options.dest 重新签名之后的输出文件夹名
 * @param { String } options.origin 需要重新签名的输入文件夹名，默认为dist
 */
async function resign(options = {}) {
  // 清除无用文件
  const destDir = path.resolve(projectPath, options.dest)
  fs.emptyDirSync(destDir)

  // 获取公钥和私钥的内容
  const privatekeyContent = fs.readFileSync(path.resolve(projectPath, options.sign, 'private.pem'))
  const certificateContent = fs.readFileSync(
    path.resolve(projectPath, options.sign, 'certificate.pem')
  )

  let files = []

  if (options.file) {
    const fullpath = path.resolve(process.cwd(), options.file)
    files = [path.basename(fullpath)]
  } else {
    // 如果没有指定具体的rpk包，则对默认指定的dist中的rpk进行重新签名
    files = glob.sync('**/*.{rpks,rpk}', { cwd: path.resolve(projectPath, options.origin) })
  }

  const output = path.resolve(projectPath, options.dest)
  const reletivePath = path.resolve(projectPath, options.origin)

  const filePromises = files.map(async (item) => {
    let fileBuffer = fs.readFileSync(path.resolve(reletivePath, item))
    if (item.endsWith('.rpk')) {
      fileBuffer = await signForRpk(fileBuffer, privatekeyContent, certificateContent)
    }
    if (item.endsWith('.rpks')) {
      fileBuffer = await signForRpks(fileBuffer, privatekeyContent, certificateContent)
    }
    generateDistFile(fileBuffer, output, item)
  })

  await Promise.all(filePromises)
}

function generateDistFile(buffer, output, item) {
  const outputFile = path.resolve(output, item)
  fs.writeFileSync(outputFile, buffer)
  const extName = path.extname(item)
  colorconsole.log(`### App Loader ### ${relateCwd(output)} 目录签名并生成${extName}文件：${item}`)
}

export { resign }
