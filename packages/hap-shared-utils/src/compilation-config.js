/*
 * Copyright (c) 2021-present, the hapjs-platform Project Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

const compileOptionsMeta = {
  // 打包来源
  originTypeNum: {
    IDE: 'quickapp-ide',
    CMD: 'cmd'
  },
  // 签名模式的枚举
  signModeEnum: {
    BUILD: 'BUILD',
    RELEASE: 'RELEASE',
    NULL: 'NULL'
  },
  // 主包保留名
  MAIN_PKG_NAME: 'base',
  // 枚举类型
  splitChunksModeEnum: {
    // 默认：冗余到每个页面JS中
    REDUNDANCY: 'REDUNDANCY',
    // 抽取公共JS到chunk文件中
    SMART: 'SMART'
  },
  // 抽取公共JS的文名称
  splitChunksNameEnum: {
    APP: 'app-chunks.json',
    PAGE: 'page-chunks.json'
  },
  // 自定义包名的枚举
  buildNameFormat: {
    DEFAULT: 'DEFAULT',
    ORIGINAL: 'ORIGINAL'
  }
}

const compileOptionsObject = {
  // 默认不禁用 cache
  disableCache: false,
  // 工具默认输出card和app的所有路由，可定制为单纯输出card或app
  target: 'all',
  // 打包来源，ide|cmd
  originType: compileOptionsMeta.originTypeNum.CMD,
  // 签名模式 当前默认为debug签名
  signMode: compileOptionsMeta.signModeEnum.BUILD,
  // 是否开启分析
  stats: false,
  // sourcemap配置
  devtool: false,
  // 是否禁用子包
  disableSubpackages: false,
  // 是否禁用流式编译
  disableStreamPack: false,
  // 是否禁用签名能力
  disableSign: false,
  // 是否禁用V8的6.5版本编译
  disableScriptV8V65: false,
  // 是否编译复合选择器,生成_meta信息
  optimizeDescMeta: false,
  // 是否压缩CSS属性名
  optimizeCssAttr: false,
  // 是否压缩模板属性名
  optimizeTemplateAttr: false,
  // TODO:是否支持页面级别的样式(暂不支持)
  optimizeStylePageLevel: false,
  // TODO:是否支持应用级别的样式(暂不支持)
  optimizeStyleAppLevel: false,
  // 延迟加载自定义组件
  enableLazyComponent: false,
  // 是否移除无用资源
  optimizeUnusedResource: false,
  // 是否将dsl打包到rpk
  includeDslFromLib: false,
  // 解决sourcemap资源的错位问题
  matchSourcemap: false,
  // 开启css样式抽取
  enableExtractCss: false,
  removeUxStyle: false,
  // 是否启用e2e测试用例
  enableE2e: false,
  // 是否启用代码覆盖率检查
  enableIstanbul: false,
  // 抽取公共JS的配置
  splitChunksMode: compileOptionsMeta.splitChunksModeEnum.REDUNDANCY,
  // 是否启用日志诊断功能
  enableDiagnosis: false,
  // 是否启用性能检查
  enablePerformanceCheck: false,
  // 调试时是否启用server的watch模式
  enableServerWatch: false,
  // 是否处理.9图
  trimDotnine: true,
  // 自定义包名 默认为带版本号的包名
  buildNameFormat: compileOptionsMeta.buildNameFormat.DEFAULT,
  // IDE或者命令行传入的参数，用来参与构建IDE预览包
  buildPreviewRpkOptions: null
}

/**
 * 初始化命令行中传递的配置
 * @param argopts - 命令行参数对象
 */
function mergeCompileOptionsObject(argopts) {
  // TODO release memeory, use optimize-prop only
  compileOptionsObject.devtool = argopts.devtool ? argopts.devtool : false
  Object.assign(compileOptionsObject, argopts)
}

export { compileOptionsMeta, compileOptionsObject, mergeCompileOptionsObject }
