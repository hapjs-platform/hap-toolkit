/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import crypto from 'crypto'
import chalk from 'chalk'
import path from '@jayfate/path'
import inquirer from 'inquirer'
import { enc, HmacSHA256, MD5 } from 'crypto-js'
import request from 'request'
import fs from 'fs-extra'
import qrTerminal from 'qrcode-terminal'
import qrImage from 'qr-image'

const home = require('os').homedir()

// 登录相关常量，与IDE保持一致
const SIGN_KEY = '02D3411146BE7892BAC13E2C835B465E'
const PASSWORD_SIGN_KEY = 'lightapp@2017'

// 接口环境，默认生产环境
const apiConfig = {
  production: 'https://www.quickapp.cn',
  development: 'http://test.so-quick.cn'
}

// 登录态token，此token会保存在本地。每次重新登录都会重写。
// 保存目录为previewRpkTemp中的token.json文件
let ideToken = ''
let cacheUserName = ''
let qrOutputPath = ''
let rpkUserNameHash = ''

const previewRpkTemp = path.join(home, '/quickAppPreviewTempPath/')
const tokenPath = path.join(home, '/quickAppToken.json')

let currentApi = apiConfig['production']

// 确保临时缓存目录存在,不存在则创建
fs.ensureDirSync(previewRpkTemp)

/**
 * 扫码预览入口函数
 * @param {Object} options - 命令行传入的参数
 */
export async function remotePreview(options) {
  if (options.env) {
    if (options.env !== 'production' && options.env !== 'development') {
      return console.log(chalk.red(`[ERROR] 环境参数只支持production或development!`))
    }
    currentApi = apiConfig[options.env]
  }

  // 二维码图片输出路径，不传则不输出图片
  if (options.qrOutput) {
    qrOutputPath = options.qrOutput
  }

  const isExistToken = await takeToken()

  if (!isExistToken) {
    // 不存在token则登录获取ideToken
    const userToken = await collectUserInfo()

    if (!userToken) {
      return console.log(chalk.red('[ERROR] 🤣 登录失败或者账号密码错误'))
    }

    updateToken(userToken.ideToken)
  }

  compilePreviewRpk(options)
}

/**
 * 获取本地存储的token
 * @returns {Boolean|undefined} - 如果不存在则返回false
 */
async function takeToken() {
  if (!fs.pathExistsSync(tokenPath)) return false

  const tokenJSON = fs.readJsonSync(tokenPath)

  if (tokenJSON && tokenJSON.token) {
    ideToken = tokenJSON.token
    console.log(chalk.green('[INFO] 用户ideToken已存在，校验合法性...')) // 校验合法性
    // 获取token，检查登录态
    const user = await checkUser()
    const data = JSON.parse(user)

    if (data.code === 0) {
      console.log(chalk.green('用户ideToken已存在，并且token可用')) // 下一步处理逻辑
      ideToken = tokenJSON.token
      return true
    } else {
      // 存在token但不合法，需要重新登录
      console.log(chalk.green('[INFO] 🤣 存在token但不合法，需要重新登录'))
      return false
    }
  }

  console.log(chalk.green('[INFO] 用户token不存在，需要重新登录；'))
  return false
}

/**
 * 将获取的token存入本地
 * @param {*} token
 */
function updateToken(token) {
  const err = fs.writeJsonSync(tokenPath, {
    token
  })

  if (err) {
    console.log(chalk.red('[ERROR] 🤣 token保存失败；'))
  }

  const e = fs.accessSync(tokenPath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK)

  if (!e) {
    console.log(chalk.green(`[INFO] 👍 token保存成功（${tokenPath}）；`))
  }
}

/**
 * 收集用户信息
 * @returns {Object} - 服务端返回的token对象
 */
async function collectUserInfo() {
  console.log(chalk.green('[INFO] 在命令行内使用扫码预览功能需要使用快应用联盟账号登录；'))
  console.log(
    chalk.green('[INFO] 如果没有账号，请到https://www.quickapp.cn/account/register注册；')
  )

  const answers = await inquirer.prompt([
    {
      type: 'username',
      message: '请键入你的用户名',
      name: 'username'
    },
    {
      type: 'password',
      message: '请键入密码',
      name: 'password'
    }
  ])

  const { username, password } = answers

  const res = await login(username, password)
  const data = JSON.parse(res)
  if (data.code === 0) {
    const _d = data.data
    ideToken = _d.ideToken
    console.log(chalk.green('[INFO] 👍 登录成功；'))
    return _d
  } else {
    console.log(chalk.red(`[ERROR] ${data.msg}；`))
  }
}

/**
 * 登录
 * @param {String} userName - 用户名
 * @param {String} password - 密码
 * @returns {Promise}
 */
function login(userName, password) {
  const deal = dealRequestParams({
    userName,
    password: MD5(password + PASSWORD_SIGN_KEY).toString(),
    versionCode: '3.7'
  })
  const api = `${currentApi}/api/ide/account/login`
  const data = { form: deal }
  return new Promise(function (resolve, reject) {
    request.post(api, data, function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.log(err)
        reject(err)
      }
      cacheUserName = userName
      resolve(body)
    })
  })
}

/**
 * 判断登录态
 * @returns {Promise}
 */
function checkUser() {
  const api = `${currentApi}/api/ide/account/checkUser`
  const args = dealRequestParams({ ideToken })
  const data = { form: args }
  return new Promise(function (resolve, reject) {
    request.post(api, data, function (err, res, body) {
      if (err) {
        console.log(err)
      }
      resolve(body)
    })
  })
}

/**
 * 构造请求参数
 * @param {Object} args
 * @param {Boolean} notTimestamp
 * @returns {Object} 返回构造好的参数
 */
function dealRequestParams(args, notTimestamp) {
  // 某些情况是不需要时间戳的
  const timestamp = Date.now()
  if (!notTimestamp) {
    args.timestamp = timestamp
  }

  let newStr = ''
  const newkey = Object.keys(args).sort()

  // 先用Object内置类的keys方法获取要排序对象的属性名数组，再利用Array的sort方法进行排序
  for (let i = 0, len = newkey.length; i < len; i++) {
    if (i === len - 1) {
      newStr += [newkey[i]] + '=' + args[newkey[i]]
    } else {
      newStr += [newkey[i]] + '=' + args[newkey[i]] + '&'
    }
  }

  const sign = HmacSHA256(newStr, SIGN_KEY)
  args.sign = enc.Hex.stringify(sign)
  return args
}

/**
 * 调用compile打包
 * @param {Object} options - 命令行入参
 */
async function compilePreviewRpk(options) {
  console.log(chalk.green(`\n[INFO] 开始打预览包...`))
  rpkUserNameHash = getUserNameHash(cacheUserName)

  const { compileError } = await options.compile(
    'native',
    'prod',
    false,
    Object.assign(
      {
        originType: 'ide',
        buildPreviewRpkOptions: {
          setPreviewPkgPath: previewRpkTemp,
          userNameHash: rpkUserNameHash
          // TODO: 写入默认图标
        }
      },
      options
    )
  )
  // 校验previewRpkTemp有没有文件，如果没有则显示打包失败（打包之前会清空目录）
  // 某些情况下打release包失败并不会报错
  const files = fs.readdirSync(previewRpkTemp)
  if (compileError === null && files.length !== 0) {
    console.log(chalk.green(`[INFO] 👍 预览包打包成功（${previewRpkTemp}）；`))
    // 完成了打包之后开启上传
    updatePreviewRpk()
  } else {
    console.log(chalk.red('[ERROR] 🤣 预览包打包失败；'))
  }
}

/**
 * 上传打包好的rpk
 */
async function updatePreviewRpk() {
  console.log(chalk.green(`\n[INFO] 开始上传预览包...`))

  let releaseRpkName = ''
  const releaseRpkNameArr = fs.readdirSync(previewRpkTemp)

  // 处理开启分包的情况
  for (let i = 0; i < releaseRpkNameArr.length; i++) {
    const file = releaseRpkNameArr[i]

    if (/rpks$/.test(file)) {
      releaseRpkName = file
      break
    }

    if (/rpk$/.test(file)) {
      releaseRpkName = file
    }
  }

  const releaseRpkPath = path.join(previewRpkTemp, releaseRpkName)

  // 如果不存在打包后的rpk文件
  if (!fs.existsSync(releaseRpkPath)) {
    return console.log(chalk.green(`[ERROR] 🤣 ${previewRpkTemp}下不存在预览包文件`))
  }

  const manifest = path.resolve(process.cwd(), 'src/manifest.json')

  // 上传时包名必须拼接'.__preview__'
  const packageName = fs.readJsonSync(manifest).package
  const rpkPackage = packageName + '.__preview__'
  const fsHash = crypto.createHash('md5')
  fsHash.update(fs.readFileSync(releaseRpkPath))
  const rpkMd5 = fsHash.digest('hex')
  const signedParam = dealRequestParams({
    rpkPackage: rpkPackage,
    ideToken,
    file: rpkMd5
  })
  uploadRemote(
    {
      rpkPackage,
      ideToken,
      sign: signedParam.sign,
      timestamp: signedParam.timestamp
    },
    releaseRpkPath
  )
    .catch((e) => {
      console.log(chalk.red(`[ERROR] 🤣 上传预览rpk失败:${e}`))
    })
    .then((res) => {
      const { data, code } = JSON.parse(res)
      if (code === 0) {
        const { previewRpkId } = data
        console.log(chalk.green(`[INFO] 👍 上传预览包成功；`))
        generateQrcode(previewRpkId)
      } else {
        console.log(chalk.red(`[ERROR] 🤣 上传预览rpk失败:${JSON.stringify(res)}`))
      }
    })
}

/**
 * 上传请求
 * @param {Object} param - 上传所需参数
 * @param {String} rpkPath - rpk(rpks)保存路径
 * @returns {Promise}
 */
function uploadRemote(param, rpkPath) {
  return new Promise((resolve, reject) => {
    const url = `${currentApi}/api/ide/previewRpk/upload`
    request.post(
      url,
      {
        formData: {
          ideToken: param.ideToken,
          sign: param.sign,
          rpkPackage: param.rpkPackage,
          file: fs.createReadStream(rpkPath),
          timestamp: param.timestamp
        }
      },
      function optionalCallback(err, httpResponse, body) {
        if (err) {
          reject(err)
        }
        resolve(body)
      }
    )
  })
}

/**
 * 生成二维码
 * @param {String} previewRpkId - 服务端返回的预览rpk的id
 */
function generateQrcode(previewRpkId) {
  const { sign } = dealRequestParams(
    {
      pid: previewRpkId
    },
    true
  )
  const url = `${currentApi}/api/ide/_p?pid=${previewRpkId}&sign=${sign}`
  qrTerminal.generate(url, { small: true })
  console.log(
    chalk.green(
      `[INFO] 👏👏👏请使用微信、内置浏览器或者其他扫码工具扫描上面的二维码，打开预览版快应用；`
    )
  )
  // 如果传入了输出路径
  if (qrOutputPath) {
    generateQrPicToPath(url)
  }
}

/**
 * 将二维码图片输出到指定路径
 * @param {String} qrcode - 二维码字符串
 */
function generateQrPicToPath(qrcode) {
  const image = qrImage.image(qrcode, { type: 'png' })
  image.pipe(require('fs').createWriteStream(path.resolve(qrOutputPath, `${rpkUserNameHash}.png`)))
  // 重置输出路径
  qrOutputPath = ''
}

/**
 * 返回取hash后的用户名，用作快应用名
 * 开发版快应用名称规则为：q_id + ideToken前8
 * 例如name = 'qid_asd2w2scf32ev234'
 * @param {String} username
 * @returns {String} - 计算后的username
 */
function getUserNameHash(username) {
  const fsHash = crypto.createHash('md5')
  fsHash.update(username + new Date().getTime())
  return `qid_${fsHash.digest('hex').slice(0, 8)}`
}
