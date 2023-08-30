import http from 'http'
import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import FormData from 'form-data'
import { colorconsole } from '@hap-toolkit/shared-utils'

function SignOnlinePlugin(options) {
  this.options = options
}

SignOnlinePlugin.prototype.apply = function (compiler) {
  const options = this.options

  compiler.hooks.done.tapAsync('SignOnlinePlugin', function (stats, cb) {
    const requestPath = options.request
    if (!requestPath || typeof requestPath !== 'string') {
      colorconsole.error(`### App Server ### 请求线上接口无效，请检查`)
      cb()
      return
    }
    const ext = options.signOnlineRpks ? 'rpks' : 'rpk'
    const pkgName = options.name
    const versionName = options.versionName
    const noSignFile = `${pkgName}.nosign.${versionName}.${ext}`

    const noSignFilePath = path.join(options.output, noSignFile)

    const distFileName = `${pkgName}.${options.sign}.${versionName}.${ext}`
    const distFilePath = path.join(options.output, distFileName)
    const distFileStream = fs.createWriteStream(distFilePath)

    const form = new FormData()
    form.append('file', fs.createReadStream(noSignFilePath))
    // 与服务器约定好的参数，1为直接下载
    form.append('download', '1')

    let headers = {}

    if (options.headers.token) {
      headers = {
        Authorization: 'Bearer ' + options.headers.token
      }
    }

    Object.assign(headers, form.getHeaders())

    const url = new URL(requestPath)
    const param = {
      host: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      timeout: 10000,
      headers
    }
    const req = http
      .request(param, (res) => {
        colorconsole.log(`### App Loader ### 请求接口的状态码：${res.statusCode}`)
        res.pipe(distFileStream, { end: false })
        res.on('end', (data) => {
          if (res.statusCode === 200) {
            distFileStream.end()
            colorconsole.log(
              `### App Loader ### 请求线上签名成功，dist目录生成文件：${distFileName}`
            )
            cb()
          }
        })
      })
      .on('error', (err) => {
        colorconsole.error(`### App Server ### 请求线上签名错误，错误信息: ${err.message} $`)
        cb(err)
      })
      .on('timeout', function () {
        colorconsole.warn('### App Server ### 请求线上签名网络超时，请检查网络与接口地址')
        req.abort()
      })
    form.pipe(req)
  })
}

export default SignOnlinePlugin
