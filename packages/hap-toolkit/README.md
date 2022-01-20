# hap-toolkit

快应用开发者工具

### 如何使用

1. 全局安装 hap-toolkit

```sh
npm install -g hap-toolkit
```

2. 新建示例工程，方便开发者快速上手

```sh
hap init `<project-name>`
```

3. 安装 npm 依赖

```sh
cd `<project-name>`
npm install
```

4. 构建项目

```sh
npm run build
npm run server
```

5. 其他命令（[请参考开发者文档](https://doc.quickapp.cn/)）

### 版本日志(详情请在 node_modules 中查看 CHANGELOG)

#### [1.8.x]

- 适配骨架屏功能
- 添加打包来源及其他数据埋点文件

#### [0.7.x]

- 增加项目重新签名的能力，新增命令行 resign
- 新增 toolkit 增加在快应用注入输出 log 的能力
- 支持编译全局公共组件
- 增加编译动态引入 js 文件的能力，即开发者可以使用 import().then()的方式引入 js 文件

#### [0.6.x]

- 调试器 支持`chrome[google-chrome]`浏览器和`chromium[chromium-browser]`浏览器
- 增加了对多语言包打包的能力
- 兼容 android 10 以上版本的 USB 调试功能
- 增加 ux 项目提取公共 css 样式的能力
- 增加快应用项目的 e2e 测试能力
- 增加测试 ux 项目的代码覆盖率的能力
- toolkit 配置统一使用 quickapp.config.js，兼容 hap.config.js
- 支持抽取公共 js 文件的能力，使用方法为编译选项设置--split-chunks-mode <value>；默认不启动，value 为 smart 时启动该能力
- 增加 lint 能力，开发者可以使用 eslint 模块对项目进行校验和格式化

#### [0.5.x]

- 支持 app 全局样式的编译
- 解决 template 里字符串模板错乱问题

#### [0.4.x]

- 添加`--disable-stream-pack`参数用于禁用流式包（`build`,`release`,`watch`命令有效）
- 支持自定义配置
- 修复了 hap update --force 时 JS 报错的问题

#### [0.3.x]

- 1040 平台支持
- 不再支持`node 6`，要求`node 8`以上版本
- 不再创建备份文件
- 新增`web`预览功能，打开服务`/preview`页面可使用浏览器预览快应用
- 新增`hap preview`子命令，可直接预览`rpk`文件或解压的`rpk`文件目录（包括`build`目录）
- 新增`hap view`子命令，可用于直接查看`rpk` 文件。详情可执行`hap view --help`查看
- 监听模式增加监听`manifest.json`文件

#### [0.2.x]

- 支持分包
- `chrome devtools` 升级到 66
- 修复初始化模块的 elisnt 配置无效的问题
- 优化错误栈信息
- 修复`toolkit`误报使用`node`原生模块问题

#### [0.1.x]

- 项目 package.json 的依赖只有 hap-toolkit，移除了其他依赖
- 支持 postcss 解析 css
- 支持可以自定义属性 data-xxx
- slot 可以作为 text 的子组件
- WebSocket 支持 ArrayBuffer
- 更新对部分新属性，新事件，新样式的支持

### 常见问题

#### 一、从小于 0.0.38 版本升级

若 hap-toolkit 从 0.0.37 升级上来，有比较大的改动，其中需要注意的是：

1. 项目下面的 .babelrc 文件变更为 babel.config.js 文件。babel.config.js 内容如：

```
module.exports = function(api) {
  api.cache(true)
  return {
    presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    babelrcRoots: ['.', 'node_modules']
  }
}
```

**.babelrc 文件需要删除。**

2. 项目的基础依赖只需要以下模块，package.json 里的 devDependencies 字段如：

```
{
  "devDependencies": {
    "babel-eslint": "^10.0.1",
    "eslint": "^5.12.1",
    "eslint-plugin-hybrid": "0.0.5",
    "hap-toolkit": "^0.4.3"
  }
}
```

**修改后请将 node_modules 和 package-lock.json 删除，再重新安装依赖。**

[反馈问题](https://github.com/quickappcn/issues/issues/new/choose)
