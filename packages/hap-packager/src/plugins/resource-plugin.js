/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import fs from 'fs-extra'
import aaptjs from '@hap-toolkit/aaptjs'
import glob from 'glob'
import eventBus from '@hap-toolkit/shared-utils/event-bus'
import { colorconsole, relateCwd, readJson, logger } from '@hap-toolkit/shared-utils'
import { compileOptionsObject } from '@hap-toolkit/shared-utils/compilation-config'

import { name } from '../common/info'
import { updateManifest } from '../common/shared'

const { PACKAGER_BUILD_DONE } = eventBus

// 多语言资源文件
const I18N_DIRECTORY = 'i18n'
// lottie动画配置文件
const LOTTIE_DIRECTORY = 'lottie'
// 需要打包的配置文件夹
// directoryName:文件夹名称
// onlyRoot:只遍历根目录，为false时会遍历所有的子目录
const JSON_DIRECTORY_NEED_PACKAGING = [
  { directoryName: I18N_DIRECTORY, onlyRoot: true },
  { directoryName: LOTTIE_DIRECTORY, onlyRoot: false }
]

// 支持文件扩展名
const FILE_EXT_LIST = name.extList
// 排除资源文件扩展名
const FILE_EXT_NORES = FILE_EXT_LIST.concat([
  '.js',
  '.jsx',
  '.coffee',
  '.ts',
  '.tsx',
  '.css',
  '.less',
  '.sass',
  '.styl',
  '.html',
  '.json',
  '.md'
])
const EXT_PATTERN = FILE_EXT_NORES.map((ext) => {
  return '*' + ext
}).join('|')

function getFiles(pattern, cwd) {
  return glob.sync(pattern, {
    nodir: true,
    cwd,
    ignore: ['**/Thumbs.db'],
    absolute: true
  })
}

function getSkeletonConfigFile(sourceDir) {
  const configFile = path.join(sourceDir, 'skeleton/config.json')
  let skConfigFile = []
  if (fs.existsSync(configFile)) {
    skConfigFile = [configFile]
  }
  return skConfigFile
}

function getSpecifiedJSONFiles(sourceDir, specifiedDirArray) {
  let filesArray = []
  specifiedDirArray.map((specifiedDir) => {
    const { directoryName, onlyRoot = false } = specifiedDir
    const dir = path.join(sourceDir, directoryName)
    // onlyRoot: 是否仅遍历根目录
    // i18n文件夹只能扫描根目录的配置文件（安卓多语言代码逻辑的实现限制）
    // lottie文件夹可以扫描根目录与子目录
    const jsonPath = onlyRoot ? '*.json' : '**/**.json'
    if (fs.existsSync(dir)) {
      filesArray = filesArray.concat(getFiles(jsonPath, dir))
    }
  })
  return filesArray
}

function minifyJson(source, target) {
  try {
    const contentStr = fs.readFileSync(source, 'utf8')
    const content = JSON.parse(contentStr)
    const minifiedContent = JSON.stringify(content)
    fs.writeFileSync(target, minifiedContent)
  } catch (err) {
    colorconsole.error(`### App Loader ### ${relateCwd(source)} 文件 压缩拷贝失败`, err.message)
  }
}

function minifySpecifiedJSONFiles(targetDir, specifiedDirArray) {
  specifiedDirArray.map((specifiedDir) => {
    const { directoryName, onlyRoot = false } = specifiedDir
    const dir = path.join(targetDir, directoryName)
    const jsonPath = onlyRoot ? '*.json' : '**/**.json'
    if (fs.existsSync(dir)) {
      const jsonFiles = getFiles(jsonPath, dir)
      jsonFiles.forEach((filePath) => {
        minifyJson(filePath, filePath)
      })
    }
  })
}

function minifySitemap(targetDir) {
  const sitemap = path.join(targetDir, 'sitemap.json')
  if (fs.existsSync(sitemap)) {
    minifyJson(sitemap, sitemap)
  }
}

function minifySkeletonConfig(targetDir) {
  const skeletonConfig = path.join(targetDir, 'skeleton/config.json')
  if (fs.existsSync(skeletonConfig)) {
    minifyJson(skeletonConfig, skeletonConfig)
  }
}

/**
 * 资源的处理
 * @param {object} options 参数对象
 * @param {Path} options.src src目录的路径
 * @param {Path} options.dest build目录的路径
 * @param {Path} options.projectRoot 项目的路径
 * @param {Boolean} options.configDebugInManifest 要写入manifest中的配置值
 * @param {Boolean} options.optimizeUnusedResource
 * @constructor
 */
function ResourcePlugin(options) {
  this.options = options
}

ResourcePlugin.prototype.apply = function (compiler) {
  const options = this.options
  const webpackOptions = compiler.options
  // 监听时处理
  compiler.hooks.watchRun.tapAsync('ResourcePlugin', function (watching, callback) {
    Object.keys(webpackOptions.entry).forEach(function (key) {
      const val = webpackOptions.entry[key]
      if (val instanceof Array && !/app\.js/.test(key)) {
        // 删除webpack-dev-server注入的watch依赖
        val[0].indexOf('webpack-dev-server') !== -1 && val.shift()
      }
    })
    callback()
  })

  compiler.hooks.emit.tapAsync('ResourcePlugin', function (compilation, callback) {
    const sourceDir = options.src
    const targetDir = options.dest

    // 列出 sourceDir 下的所有文件
    // 不包含 *.{js,jsx,json} 等文件，但包含 manifest.json
    // "." 开头的文件会被默认忽略,
    // **/*(*.!(${extpattern})|manifest.json)
    let files = getFiles(`**/+(!(${EXT_PATTERN})|manifest.json|sitemap.json)`, sourceDir)
    files = files.concat(
      getSpecifiedJSONFiles(sourceDir, JSON_DIRECTORY_NEED_PACKAGING),
      getSkeletonConfigFile(sourceDir)
    )
    let iconPath
    // 横幅
    let bannerPath
    try {
      const manifestFile = path.join(sourceDir, 'manifest.json')
      const manifest = readJson(manifestFile)
      iconPath = manifest.icon
      bannerPath = manifest.banner
      iconPath = path.join(sourceDir, iconPath)
      // banner字段是可选项，所以要判断一下是否存在
      if (bannerPath) {
        bannerPath = path.join(sourceDir, bannerPath)
      }
    } catch (err) {
      // 这里重点不是处理manifest，只catch不报错
      iconPath = ''
      bannerPath = ''
    }
    let pairs = files.map((file) => {
      return {
        srcFile: file,
        destFile: path.resolve(targetDir, path.relative(sourceDir, file))
      }
    })
    // 将 node_modules 中依赖的资源添加到res中
    const { projectRoot } = options
    const pathNodeModules = path.join(projectRoot, 'node_modules')
    const fileDependencies = compilation.fileDependencies
    for (let srcFile of fileDependencies) {
      const extname = path.extname(srcFile)
      if (
        srcFile.indexOf(pathNodeModules) > -1 &&
        FILE_EXT_NORES.indexOf(extname) === -1 &&
        files.indexOf(srcFile) === -1 &&
        extname
      ) {
        // 原文件路径 srcFile 形如: /<project-root>/node_modules/module/demo.png
        // 目标文件路径 destFile 形如: /<project-root>/build/node_modules/module/demo.png
        pairs.push({
          srcFile: srcFile,
          destFile: path.resolve(targetDir, path.relative(projectRoot, srcFile))
        })
      }
    }
    pairs = pairs.filter((pair) => {
      const { srcFile } = pair
      if (options.optimizeUnusedResource) {
        return (
          fileDependencies.has(srcFile) ||
          srcFile === iconPath ||
          // banner字段是可选项，所以要判断一下是否存在
          (bannerPath && srcFile === bannerPath) ||
          path.relative(sourceDir, srcFile) === 'manifest.json'
        )
      } else {
        return true
      }
    })
    const promises = pairs.map((pair) => {
      return new Promise((resolve, reject) => {
        const { srcFile, destFile } = pair
        // 确保目标目录存在
        fs.mkdirp(path.dirname(destFile), () => {
          // 处理每个文件
          let filePromise
          if (/.+\.9\.png$/.test(srcFile)) {
            if (compileOptionsObject.trimDotnine) {
              // 处理 .9 图片
              // 传入相对当前目录的路径，输出信息友好
              filePromise = aaptjs.singleCrunch(srcFile, destFile).catch((err) => {
                if (err) {
                  colorconsole.log(`复制文件 ${relateCwd(srcFile)} 失败：${err.message}`)
                }
              })
            } else {
              filePromise = fs.copy(srcFile, destFile).catch((err) => {
                colorconsole.log(`复制 ${srcFile} -> ${destFile} 失败`)
                throw err
              })
            }
          } else {
            filePromise = fs.copy(srcFile, destFile).catch((err) => {
              colorconsole.log(`复制 ${srcFile} -> ${destFile} 失败`)
              throw err
            })
          }
          filePromise.then(resolve, reject)
        })
      })
    })

    Promise.all(promises).then(
      () => {
        if (compilation.errors.length) {
          const msg = compilation.errors
            .map((error) => {
              return error.message
            })
            .join('/n')
          logger.add(msg)
        }
        // 此节点即可通知预览刷新，打 rpk 错误不显示在预览界面
        eventBus.emit(PACKAGER_BUILD_DONE)
        callback()
      },
      (err) => {
        colorconsole.log('ERROR: 拷贝文件出现错误', err)
        throw err
      }
    )
  })

  // 更新 build/manifest.json
  compiler.hooks.emit.tapAsync('ResourcePlugin', (compilation, callback) => {
    const sourceDir = options.src
    const targetDir = options.dest

    const pathManifestFrom = path.join(sourceDir, 'manifest.json')
    const pathManifestDest = path.join(targetDir, 'manifest.json')

    const fileExists = fs.existsSync(pathManifestFrom)

    minifySpecifiedJSONFiles(targetDir, JSON_DIRECTORY_NEED_PACKAGING)

    minifySitemap(targetDir)

    minifySkeletonConfig(targetDir)

    if (fileExists) {
      let manifest
      try {
        manifest = readJson(pathManifestFrom)
      } catch (err) {
        compilation.errors.push(err)
        callback()
        // 下面都是处理manifest，出错则不往下走
        return
      }

      const { configDebugInManifest } = options

      // 验证参数：必须为布尔
      if ([true, false].indexOf(configDebugInManifest) === -1) {
        colorconsole.error(
          `### App Loader ### 参数configDebugInManifest必须为布尔值：${configDebugInManifest}`
        )
        callback()
      }

      // 写入到文件
      manifest = updateManifest(manifest, configDebugInManifest)

      manifest['packageInfo'] = JSON.parse(this.options.comment)

      // minify in production mode
      const updatedContent = JSON.stringify(manifest, null, configDebugInManifest ? 2 : 0)
      fs.writeFile(pathManifestDest, updatedContent, 'utf8', (err) => {
        if (err) {
          colorconsole.error(
            '### App Loader ### 更新 %s 失败：%s',
            relateCwd(pathManifestFrom),
            err.message
          )
        }
        callback()
      })
    } else {
      colorconsole.error('### App Loader ### %s 下无 manifest.json 文件', relateCwd(sourceDir))
      callback()
    }
  })
}

module.exports = ResourcePlugin
