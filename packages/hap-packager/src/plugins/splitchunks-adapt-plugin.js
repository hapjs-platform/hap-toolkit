/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import path from '@jayfate/path'
import Compilation from 'webpack/lib/Compilation'
import { getEntryFiles } from '../common/info'
import { compileOptionsMeta } from '@hap-toolkit/shared-utils/compilation-config'
import { isEmptyObject } from '../common/utils'

let ConcatSource

const SEP = path.sep
// page-chunks.json
const SPLIT_CHUNKS_PAGE_NAME = compileOptionsMeta.splitChunksNameEnum.PAGE
// app-chunks.json
const SPLIT_CHUNKS_APP_NAME = compileOptionsMeta.splitChunksNameEnum.APP
// 主包保留名：base
const MAIN_PKG_NAME = compileOptionsMeta.MAIN_PKG_NAME

const pluginName = 'splitChunksAdaptPlugin'
const actualModuleRequireParam = [
  'module.exports',
  'module',
  'module.exports',
  '__webpack_require__'
]
const moduleRequireNativeFunctions = [
  '$app_define$',
  '$app_bootstrap$',
  '$app_require$',
  '$app_define_wrap$'
]
const appModuleRequireNativeFunctions = [
  '$app_define$',
  '$app_bootstrap$',
  '$app_require$',
  '$app_define_wrap$'
]

// 实参：modules[moduleId].call() 里的参数字符串
const actualParamStr = actualModuleRequireParam.concat(moduleRequireNativeFunctions).join(', ')
// 形参：每个模块引入的参数字符串，会和正则匹配到的参数进行相连
const formalParamStr = moduleRequireNativeFunctions.join(', ')

const quickappGlobal = 'var __quickappGlobal = Object.getPrototypeOf(global) || global;'

// 替换window变量（chunk中为global）
function replaceWindowWithGlobalStr(isSplitChunks, content) {
  let __global = isSplitChunks ? 'global' : '__quickappGlobal'
  return content.replace(/window(?=\["webpackChunk\w+"\])/g, __global)
}

function createChunksJsonInfo(subpackageOptions) {
  let chunksJsonInfo = {
    [SPLIT_CHUNKS_APP_NAME]: {
      jsonFilePath: SPLIT_CHUNKS_APP_NAME,
      chunks: {}
    },
    [SPLIT_CHUNKS_PAGE_NAME]: {
      jsonFilePath: SPLIT_CHUNKS_PAGE_NAME,
      chunks: {}
    }
  }
  if (subpackageOptions) {
    // 基础（base）包的 page-chunks.json 先以 `base/page-chunks.json` 形式存在，用以与顶级的 page-chunks.json 区分
    // 打入 srpk 再生成到 base 包根目录下
    chunksJsonInfo[MAIN_PKG_NAME] = {
      resource: MAIN_PKG_NAME,
      jsonFilePath: MAIN_PKG_NAME + SEP + SPLIT_CHUNKS_PAGE_NAME,
      chunks: {}
    }
    // 普通分包里的 page-chunks.json `分包资源名/page-chunks.json` 的路径存在
    // 打入 srpk 里生成到其分包目录下
    chunksJsonInfo = subpackageOptions.reduce((result, item) => {
      result[item.resource] = {
        resource: item.resource,
        jsonFilePath: item.resource + SEP + SPLIT_CHUNKS_PAGE_NAME,
        standalone: item.standalone,
        chunks: {}
      }
      return result
    }, chunksJsonInfo)
  }
  return chunksJsonInfo
}

class SplitChunksAdaptPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      ConcatSource = compiler.webpack.sources.ConcatSource
      const options = this.options
      let subpackageOptions
      if (!options.disableSubpackages && options.subpackages && options.subpackages.length > 0) {
        subpackageOptions = options.subpackages
      }
      // app.js 的依赖模块
      const app_dependency = new Set()
      let entryFiles = []
      let chunkFileMapStr = ''

      // 这个钩子负责生成chunkFileMapStr，兼容release包里找不到文件路径,因为压缩后会把文件名打为数字id
      compilation.hooks.optimizeChunkIds.tap(pluginName, (chunks) => {
        entryFiles = getEntryFiles(compiler.options.entry)

        const chunksMap = Array.from(chunks)
          .filter((chunk) => {
            return entryFiles.indexOf(`${chunk.name}.js`) === -1
          })
          .map((chunk) => {
            return `"${chunk.id}": "${chunk.name}.js"`
          })

        chunkFileMapStr = `__quickappGlobal.chunkFileMap = __quickappGlobal.chunkFileMap || {${chunksMap.join(
          ', '
        )}};`

        // 收集app.js所依赖的模块
        chunks.forEach((chunk) => {
          // webpack/lib/chunk/entryModule
          const entryModule = Array.from(
            compilation.chunkGraph.getChunkEntryModulesIterable(chunk)
          )[0]
          if (chunk.name.match(/\bapp$/) && entryModule) {
            chunk.groupsIterable.forEach((item) => {
              item.chunks.forEach((items) => {
                app_dependency.add(`${items.name}.js`)
              })
            })
            app_dependency.delete('app.js')
          }
        })
      })

      // 这个钩子负责对各个chunk配置附加参数及增加全局变量__quickappGlobal进行模块化管理
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        () => {
          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((fileName) => {
              // 过滤掉非js文件，只需要对公共js进行抽取
              if (!fileName.match(/\.js$/)) return

              let _actualParamStr = actualParamStr
              let _formalParamStr = formalParamStr
              let isSplitChunks = false
              // app.js不需要$app_define_wrap$参数
              if (fileName.match(/\bapp\.js$/)) {
                _actualParamStr = actualModuleRequireParam
                  .concat(appModuleRequireNativeFunctions)
                  .join(', ')
                _formalParamStr = appModuleRequireNativeFunctions.join(', ')
              }

              let content = compilation.assets[fileName].source()

              // 在入口文件第二行添加全局变量quickappGlobal和Chunks文件map
              const entryModule = Array.from(
                compilation.chunkGraph.getChunkEntryModulesIterable(chunk)
              )[0]
              if (entryModule) {
                content = content.replace(
                  /\/\/\s+webpackBootstrap/,
                  ($0) => `${$0}\n\n\t\t\t\t\t${quickappGlobal}\n\t\t\t\t\t${chunkFileMapStr}\n`
                )
              } else {
                isSplitChunks = true
              }

              // window -> __quickappGlobal | global
              content = replaceWindowWithGlobalStr(isSplitChunks, content)
              // fulfilled = false时去加载js -> $app_evaluate$

              content = content.replace(
                /fulfilled\s+=\s+false;/,
                'fulfilled = false; $app_evaluate$(`${__quickappGlobal.chunkFileMap[chunkIds[j]]}`);' // eslint-disable-line
              )

              // webpack5下面的js动态引入，用$app_evaluate$替换__webpack_require__.l的jsonp
              content = content.replace(
                /__webpack_require__\.l\(url, loadingEnded,.+\)/g,
                '$app_evaluate$(`${__quickappGlobal.chunkFileMap[chunkId]}`);loadingEnded();' // eslint-disable-line
              )

              // call调用时增加一些实参，引入额外方法
              content = content.replace(
                /(__webpack_modules__\[moduleId\])\(\s*module,\s*module\.exports,\s*__webpack_require__/gm,
                `$1.call(${_actualParamStr}`
              )
              // 函数本身增加形参，引入额外方法
              content = content.replace(
                /(\(\(__unused_webpack_module,\s+(exports|__webpack_exports__|__unused_webpack_exports)(,\s+__webpack_require__)?)/g,
                (match) => {
                  return match.includes('__webpack_require__')
                    ? match + `, ${_formalParamStr}`
                    : match + `, __webpack_require__, ${_formalParamStr}`
                }
              )

              content = content.replace(
                /var\s*script\s*=\s*document\.createElement\('script'\);([\s|\S])+?document\.head\.appendChild\(script\);/,
                '$app_evaluate$(`${__quickappGlobal.chunkFileMap[chunkId]}`);\n/******/\t\t\t\treturn Promise.all(promises);' // eslint-disable-line
              )

              compilation.assets[fileName] = new ConcatSource(content)
            })
          })
        }
      )

      // 这个钩子负责整理输出的公共JS资源，如果是app依赖的统一放在app-chunks.json中,其余放在page-chunks.json中
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_DEV_TOOLING
        },
        () => {
          // 获取各分包所需信息
          const chunksJsonInfo = createChunksJsonInfo(subpackageOptions)
          const getChunksJsonInfo = (chunkName) => {
            const key = Object.keys(chunksJsonInfo).find((pkgName) => {
              return chunkName.replace(/\\/g, '/').startsWith((pkgName + SEP).replace(/\\/g, '/'))
            })
            return key ? chunksJsonInfo[key] : chunksJsonInfo[MAIN_PKG_NAME]
          }

          compilation.chunks.forEach((chunk) => {
            chunk.files.forEach((fileName) => {
              // 过滤掉非js文件，只需要对公共js进行整理
              if (!fileName.match(/\.js$/)) return

              if (entryFiles.indexOf(fileName) === -1) {
                // 根据app_dependency来判断是否应该放进app-chunks.json中
                const source = compilation.assets[fileName].source()

                if (app_dependency.has(fileName)) {
                  chunksJsonInfo[SPLIT_CHUNKS_APP_NAME]['chunks'][fileName] = source
                } else {
                  chunksJsonInfo[SPLIT_CHUNKS_PAGE_NAME]['chunks'][fileName] = source
                  // 以下为处理分包
                  if (subpackageOptions) {
                    // chunkGroups对应每个入口页面生成的chunk
                    compilation.chunkGroups.forEach((chunkGroup) => {
                      // 其chunks属性记录了该入口页面chunk所需（引用）的文件（也即是chunk）
                      const files = chunkGroup.chunks.map((ch) => ch.name + '.js')
                      if (files.indexOf(fileName) !== -1) {
                        // 异步加载js 抽离也会存放在 chunkGroup 里，但其 name 为 null
                        // 异步加载js 不被其他 chunk 记录为所需 chunk，故会分配到 base 包下
                        const chunkName = chunkGroup.options.name || '' // 文件名
                        const { resource, standalone } = getChunksJsonInfo(chunkName)
                        if (standalone) {
                          // 独立包拥有完整的共用js内容（与顶级 page-chunks.json 内容一致）
                          chunksJsonInfo[resource]['chunks'] =
                            chunksJsonInfo[SPLIT_CHUNKS_PAGE_NAME]['chunks']
                        } else {
                          // 非独立包只拥有该分包引用的共用js内容
                          chunksJsonInfo[resource]['chunks'][fileName] = source
                        }
                      }
                    })
                  }
                }

                // 最后删除无用的chunks，因为已经被整合
                delete compilation.assets[fileName]
                chunk.files = []
              }
            })
          })
          for (const key in chunksJsonInfo) {
            const webpacksource = chunksJsonInfo[key].chunks
            // 有实际独立js内容才生成相应的 app/page-chunks.json
            if (!isEmptyObject(webpacksource)) {
              const jsonFilePath = chunksJsonInfo[key].jsonFilePath
              compilation.assets[jsonFilePath] = new ConcatSource(JSON.stringify(webpacksource))
            }
          }
        }
      )
    })
  }
}

module.exports = SplitChunksAdaptPlugin
