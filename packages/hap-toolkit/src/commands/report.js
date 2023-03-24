/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import childProcess from 'child_process'
import os from 'os'
import path from '@jayfate/path'

import fs from 'fs-extra'
import chalk from 'chalk'

/**
 * 收集用户的环境信息，生成report.log，用于反馈和重现问题
 */
function report() {
  const nodeVersion = process.versions
  const npmVersion = childProcess.execSync(`npm -v`).toString()
  const arch = process.arch // 操作系统架构
  const osVersion = os.release()
  const osType = os.type()
  console.log(chalk.green('正在收集环境信息...'))
  childProcess.exec(
    'npm list --json',
    {
      maxBuffer: 1024 * 1024 * 10 // 10M
    },
    (error, stdout, stderr) => {
      if (error || stderr) {
        console.error(error || stderr)
        return
      }
      const dependenciesTree = JSON.parse(stdout.toString())
      const content = {
        nodeVersion,
        npmVersion,
        arch,
        osVersion,
        osType,
        dependenciesTree
      }
      fs.writeFileSync(path.join(process.cwd(), 'report.log'), JSON.stringify(content, null, 2))
      console.log(chalk.green('收集完毕'))
    }
  )
}

module.exports = report
