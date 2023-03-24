/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'

import fs from 'fs-extra'
import glob from 'glob'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { mkdirsSync, renderString, relateCwd, colorconsole } from '@hap-toolkit/shared-utils'
import dslXvm from '@hap-toolkit/dsl-xvm/lib/template'

const allSupportedDeviceArray = ['phone', 'tv', 'car', 'watch']
const allSupportedDevicesString = allSupportedDeviceArray.join(',')

/**
 * 生成工程目录
 * @param {String} name - 项目名
 * @param {Object} options - 参数
 */
async function generate(name, options) {
  if (name === '') {
    name = 'HelloWorld'
  }
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Init your project',
      default: name
    }
  ])
  const dirpath = path.join(process.cwd(), answers.name)
  try {
    await createProject(answers.name, dirpath, options)
  } catch (err) {
    colorconsole.error(err.message)
    if (err.message.match(/Please pick a new name/)) {
      await generate(name, options)
    }
  }
}

/**
 * 创建项目目录
 * @param name 项目名
 * @param dirpath 目标项目路径
 */
async function createProject(name, dirpath, options = {}) {
  if (fs.existsSync(dirpath)) {
    throw new Error(`"${dirpath}" exists! Please pick a new name.`)
  }

  if (!mkdirsSync(dirpath)) {
    throw new Error('failed to created folder "' + dirpath + '"!.')
  }

  const { dsl: dslName, deviceType: deviceTypeList } = options
  let finalDeviceTypeList = ['phone'] // 默认设备列表为 phone
  // 获取设备类型
  if (deviceTypeList && deviceTypeList.length > 0) {
    const deviceTypeArray = deviceTypeList.split(',')
    let deviceSet = new Set()
    let notSupportedDeviceSet = new Set()
    deviceTypeArray.map((deviceType) => {
      deviceType = deviceType.toLowerCase()
      const isValidDeviceTypeFlag = allSupportedDeviceArray.includes(deviceType)
      if (!isValidDeviceTypeFlag) {
        notSupportedDeviceSet.add(deviceType)
      }
      deviceSet.add(deviceType)
    })
    finalDeviceTypeList = Array.from(deviceSet)
    if (notSupportedDeviceSet.size > 0) {
      colorconsole.warn(
        `这些设备类型还没有得到快应用的官方支持: "${Array.from(notSupportedDeviceSet).join(',')}"`
      )
      colorconsole.warn(`现在快应用官方支持的设备类型有: "${allSupportedDevicesString}"`)
    }
  }

  // 获取dsl名称
  // 获取项目模板的路径
  let tplPath = null
  // 获取设备配置文件模板的路径
  let deviceJsonTemplatePath = null
  // 匹配路径
  switch (dslName) {
    case 'vue':
      console.error(`hap-toolkit >= 1.9.0版本暂不支持 dsl = vue!`)
      break
    default:
      tplPath = dslXvm.app.demo
      deviceJsonTemplatePath = dslXvm.app.deviceJsonTemplate
  }

  // 拷贝project
  const projectpath = path.resolve(__dirname, tplPath)
  await copyFiles(dirpath, projectpath, {
    _gitignore: '.gitignore'
  })
  const renderData = {
    appName: name,
    toolkitVersion: require('../../package.json').version
  }

  const files = ['src/manifest.json', 'package.json'].map((file) => path.join(dirpath, file))
  // render files
  files.forEach((filePath) => {
    let content = fs.readFileSync(filePath, 'utf-8')
    content = renderString(content, renderData)
    // 加入deviceTypeList 进 manifest.json
    if (filePath.includes('manifest.json')) {
      let manifestJson = JSON.parse(content.toString())
      manifestJson.deviceTypeList = finalDeviceTypeList
      content = JSON.stringify(manifestJson, null, 2)
    }
    fs.writeFileSync(filePath, content)
  })

  // 配置文件json的创建
  finalDeviceTypeList.map((deviceType) => {
    const deviceJsonName = `config-${deviceType}.json`
    const jsonTemplatePath = path.join(deviceJsonTemplatePath, deviceJsonName)
    let jsonContent = '{}'
    if (fs.existsSync(jsonTemplatePath)) {
      jsonContent = fs.readFileSync(jsonTemplatePath, 'utf-8')
    }
    console.log(`${name}/src/${deviceJsonName} created`)
    fs.writeFileSync(path.join(dirpath, `src/config-${deviceType}.json`), jsonContent)
  })
}

/**
 * 拷贝模板目录
 * @param {String} dest - 目标路径
 * @param {String} src - 模板文件路径
 * @param {Object} alias - 别名表，可用于复制时更名
 */
function copyFiles(dest, src, alias) {
  // 遍历收集文件列表
  const pattern = path.join(src, '**/{*,.*}')
  const files = glob.sync(pattern, { nodir: true })

  const promises = files.map((file) => {
    return new Promise((resolve) => {
      const relative = path.relative(src, file)
      const finalPath = path.join(dest, alias[relative] || relative)
      if (!fs.existsSync(finalPath)) {
        resolve(`${relateCwd(finalPath)} created.`)
        fs.copySync(file, finalPath)
      } else {
        resolve(chalk.yellow(`${relateCwd(finalPath)} already existed.`))
      }
    })
  })
  return Promise.all(promises).then((messages) => {
    console.log(messages.join('\n'))
  })
}

// 创建工程目录
module.exports = generate
