# Change Log

## [1.9.11] -2022-10.28

- smart 打包兼容卡片
- 修复 js 独立打包问题
- 增加新的 option，--target card|app|all，可选打包的应用类型（卡片或 app），默认为 all

## [1.9.10] -2022-6.8

- 修复 1.9.9 编译的 bug
- 新增对#f0ff 和#ff00ff00 格式颜色的支持
- ad-clickable-area 的 type 不加限制

## [1.9.9] -2022-4.25

- 增加 treeShaking 配置
- 增加 babel.tree.config.js

## [1.9.8] - 2021-12.08

- 服务关闭时关闭 devicesEmitter
- watch 模式下优化 rpk/rpks 的构建速度
- js 独立打包的问题解决
- 优化日志输出
- 增加编译时 ide 传入的 DefinePlugin 参数
- fix: 修复修改 manifest version 和 package 字段时导致的 rpk 找不到问题

## [1.9.7] - 2021-10.20

- fix: 解决预览打包引入的测试不过问题
- 提供杀掉 adb 进程的方法
- [SR-443] 扫码预览功能的命令行实现
- 支持 ide 自定义配置 webpack
- 修改 sentry 上报 dsn 地址
- 新增 ad-clickable-area 和 ad-custom 组件;input 组件新增 hidetext 和 showtext 属性;修改 ad 组件
- 1100 native 接口及组件属性的扩展

## [1.9.6] - 2021-10.20

- （弃用）
- fix: 解决预览打包引入的测试不过问题
- 提供杀掉 adb 进程的方法
- [SR-443] 扫码预览功能的命令行实现
- 支持 ide 自定义配置 webpack
- 修改 sentry 上报 dsn 地址
- 新增 ad-clickable-area 和 ad-custom 组件;input 组件新增 hidetext 和 showtext 属性;修改 ad 组件
- 1100 native 接口及组件属性的扩展

## [1.9.5] - 2021-06.16

- fix: 优化预览包编译逻辑
- model 指令优化：1.参考 Vue3 和微信小程序优化 model 语法，解决兼容性、拓展性问题；2.修复 component 组件无法使用 model 问题

## [1.9.4] - 2021-05.12

- 替换 4096 新证书
- 新增 shortcut-button、share-button 组件
- 自定义标签覆盖系统标签时不需要按系统标签的规则检查
- 解决 emitWarning 抛出的警告没有打印出来的问题
- webpack5 动态 import 兼容
- webpack5 固定版本号为 5.24.0
- 解决 require.context 引入,分包打包报错问题
- 增加 video 组件播放倍速设置功能

## [1.9.3] - 2021-04.09

- 支持双向绑定
- input 新增 eventbutton 类型

## [1.9.2] - 2021-03.02

- 优化 lottie 配置文件读取
- 不对 minPlatformVersion 配置进行强制修改

## [1.9.1] - 2021-02.05

- 修改初始模板配置

## [1.9.0] - 2021-01.25

- 1090 新增组件
- 适配 webpack5 打包

## [1.8.5] - 2020-12.15

- 修复 alt 属性打包错误
- 增删页面修改 webpack 入口
- 新增 slideview 组件
- 新增 section-list 组件

## [1.8.4] - 2020-11.23

- 新增 trimDotnine 参数,可在 quickapp.config.js 中增加是否对.9 图进行 aapt 处理的参数
- 新增 transition 动画

## [1.8.3] - 2020-11.4

- 动画组件增加 animation-direction 属性
- 跟踪上报调试流程
- list 组件增加 focusbehavior 属性及　 selected 事件

## [1.8.2] - 2020-10-12

- 增加 manifest.json 内容校验
- css 新增 filter 属性, 支持 blur 模糊滤镜
- 添加 alt-object-fit 样式

## [1.8.1] - 2020-09-07

- 添加打包来源及其他数据埋点文件
- 修复默认新建工程 menu:true,导致 menubar 面板无法显示
- 动态导入 js,提示用户需增加打包参数

## [1.8.0] - 2020-08-12

- 修复了 1080 部分编译报错的提示
- 预览页面优化
- 兼容`<style lang="scss">`情况

## [0.7.6] - 2020-07-15

- 修复运行时报错 $app_define_wrap$不存在的问题
- 修复在分包时动态引入 js 的报错
- 移除模板中的 babel.config.js 文件，兼容自定义 babel.config.js 文件
- 加入多平台适配文件的默认模板

## [0.7.5] - 2020-07-06

- 增加编译动态引入 js 文件的能力，即开发者可以使用 import().then()的方式引入 js 文件
- 将 app.ux 引入的公共组件单独抽离到 app-chunks.json 中，不影响 app.js 体积
- 优化部分报错信息
- 非文本组件包含文本给出 warning 提示

## [0.7.4] - 2020-06-17

- toolkit 改造适配多终端。hap init 命令加入 -d --device [device-type-list]选项,指定项目运行的设备类型,device-type-list 为字符串，以逗号连接，如 "tv,phone,car"
- 支持编译全局公共组件

## [0.7.3] - 2020-05-28

-修复 adb 调试下模拟器无法连接到正确的调试器地址的问题

## [0.7.2] - 2020-05-22

- 新增动态存在大写的组件名编译警告提示
- 去除不必要的编译提示
- 编译工具支持 dp 单位的编译
- 优化编译工具代码，提高编译工具的性能

## [0.7.1] - 2020-04-28

- 新增 toolkit 增加在快应用注入输出 log 的能力
- 修复 watch 模式下修改 manifest.json 退出中断的问题
- 重构 debugger 模块的目录结构
- 重构 devtools 模块
- 修复部分标签样式的校验规则

## [0.7.0] - 2020-04-10

- 增加了项目编译时禁止对 rpk/rpks 文件进行签名的能力
- 增加项目重新签名的能力，新增命令行 resign
- 打包文件添加 sitemap.json 文件，提供快应用被搜索引擎检索的能力

## [0.6.15] - 2020-03-17

- 完成了调试器界面的优化与更新
- 增加 lint 能力，开发者可以使用 eslint 模块对项目进行校验和格式化
- richtext 组件增加 start 和 complete 事件的校验
- progress 增加 layer-color 样式校验
- list 增加 layout-type 样式校验
- 增加元素夜间模式 forcedark 参数校验

## [0.6.14] - 2020-01-21

- 修复公共 js 抽取的 bug
- 修复调试器在 chrome v61 版本下报错的问题
- 修复 background 渐变样式格式化无法正确展示的问题
- 修复 packager 包启动 server 时，代码覆盖率接口出现报错的问题
- 修复快应用 vue 项目的部分 bug

## [0.6.13] - 2019-12-31

- 修复编译工具启用 enable-e2e 时输出变量或者函数返回，无法进行测试的 bug
- 支持抽取公共 js 文件的能力，使用方法为编译选项设置--split-chunks-mode <value>；默认不启动，value 为 smart 时启动该能力
- 重构初始化项目模板
- 修复调试器在 chrome66 版本以下无法调试问题

## [0.6.12] - 2019-12-20

- 增加 mediaquery 支持 prefers-color-scheme 编译功能
- toolkit 配置统一使用 quickapp.config.js，兼容 hap.config.js

## [0.6.11] - 2019-12-06

- 增加预览版的编译模式
- hap.config.js 支持 webpack、cli 字段。webpack 字段对应的对象与目前 hap.config.js 文件输出对象相同；cli 可以设置命令行参数，该对象会与全局的命令行对象合并。
- 样式元信息从@meta 改为@info

## [0.6.10] - 2019-11-29

- 修复流式加载顺序的问题
- 修复 chrome66 以上版本的调试器不兼容问题
- 修复打包出的 css.json 在非样式抽取模式下添加 meta 信息的问题

## [0.6.9] - 2019-11-14

- 移除环境变量中 NODE_TEST 标识，使用命令行参数传递

## [0.6.8] - 2019-11-04

- 增加 ux 项目提取公共 css 样式的能力
- 更新对 animation 样式校验
- 增加快应用项目的 e2e 测试能力
- 修复了 1060 部分编译报错的提示
- 增加测试 ux 项目的代码覆盖率的能力

## [0.6.7] - 2019-10-23

- toolkit 支持字体颜色 auto|transparent|currentColor 的编译
- 兼容 android 10 以上版本的 USB 调试功能

## [0.6.6] - 2019-10-11

- 修复获取不到设备信息时的 localWsPort 报错问题
- 增加非独立包非 base 包不打入 i18n 文件的能力
- 增加分包可以配置独立的 icon 的能力
- 增加支持 component 节点的编译能力

## [0.6.5] - 2019-09-26

- 修复 0.6.4 预览页面问题
- 增加说明：针对 sourcemap 定位不准确的问题，请在命令行中添加`--match-sourcemap`选项

## [0.6.4] - 2019-09-19

- 完善了快应用自定义配置的能力。开发者可以通过在项目根目录下配置 hap.config.js 文件定制 toolkit。目前开放了 resolve/module/plugins 三个字段
- 修复了 release 包下 sourcemap 定位不准确的问题
- 更新了 dsl 包的依赖
- 添加 vue-dsl 移除空白文本节点的能力
- 完善 ux-loader，可以添加 enforce 字段增强 loader

## [0.6.3] - 2019-08-30

- 增加了流式加载适配多语言配置的能力
- 支持地图组件展示自定义 View 的能力
- 更新预览的 web.js 文件

## [0.6.2] - 2019-08-12

- 增加了对多语言包打包的能力
- 补充了 1050 部分功能校验: 1.通用 resize 事件 2.slider 的 block-color 样式 3.map 的 polygons 属性和 poitap 事件 4.system 的 resident 接口和 service 的 ad、health、exchange 接口

## [0.6.1] - 2019-07-29

- 修复`{{}}`内文本带有/img/修饰符的正则表达式不生效的问题
- 修复 vue-dsl 使用 less 语法 validate 校验错误的问题
- 调试器 支持`chrome[google-chrome]`浏览器和`chromium[chromium-browser]`浏览器

## [0.6.0] - 2019-07-12

- 修复预览命令时报的路径错误
- 修改 build 模式默认 sourcemap 选项 devtool 为 cheap-module-eval-source-map,如果开发者想还原默认的 sourcemap 行为,可以通过 `-- --devtool source-map`设置
- 修复 macos 特定版本启动问题

## [0.5.6] - 2019-07-05

- 修复 font-family 样式字符串带引号的问题
- 将 vue-dsl 的$app_define$和$app_bootstrap$移至 toolkit

## [0.5.5] - 2019-06-20

- 修复 font-face 编译问题
- 修复构建失败退出进程的问题
- 修复编译时拷贝文件的匹配问题
- 解决 template 里字符串模板错乱问题

## [0.5.4] - 2019-06-05

- 修复 vue-dsl release 问题

## [0.5.3] - 2019-05-30

- 证书私钥缺失时候，错误输出到 webpack
- 修复 IDE 拷贝图片失败问题
- 修复 vue-dsl css2json 插件缓存问题

## [0.5.2] - 2019-05-27

- 支持 app 全局样式的编译

## [0.5.1] - 2019-05-15

- 支持 span 嵌套 span 标签

## [0.4.7] - 2019-05-08

- 修复获取 dsl 名称异常的问题

## [0.4.6] - 2019-04-28

- 修复内部 spec fragment-loader 路径问题

## [0.4.5] - 2019-04-27

- 修复自定义 build 路径时预览报错问题
- 修复停止 webpack watch 模式，没有同时停止监听 manifest 问题

## [0.4.3] - 2019-04-26

- 修复了 manifest 中 minPlatformVersion 为 1040 时 不会转换 ES6 为 ES5 的编译时 JS 报错
- 支持在项目目录中添加 hap.config.js 自定义配置 webpack module 和 plugins 的能力

## [0.4.2] - 2019-04-11

- 修复了 hap update --force 时 JS 报错的问题

## [0.4.1] - 2019-04-10

- 修复了 dsl-vue 编译 css 文件名不正确的问题

## [0.4.0] - 2019-04-05

- 添加`--disable-stream-pack`参数用于禁用流式包（`build`,`release`,`watch`命令有效）
- 支持自定义配置
- 支持`font-weight`
- 优化命令交互

## [0.3.1] - 2019-03-19

- 监听模式现在会监听`manifest.json`文件
- 修复若干问题

## [0.3.0] - 2019-03-05

### 更新

- 1040 平台支持
- 不再支持`node 6`，要求`node 8`以上版本
- 不再创建备份文件

### 新增

- 新增`web`预览功能，打开服务`/preview`页面可使用浏览器预览快应用
- 新增`hap preview`子命令，可直接预览`rpk`文件或解压的`rpk`文件目录（包括`build`目录）
- 新增`hap view`子命令，可用于直接查看`rpk` 文件。详情可执行`hap view --help`查看

### 修复

- 修复了`hap-toolkit`导致系统`adb` 不可使用的问题
- 修复其他若干缺陷

### 优化

- 优化了`hap init` 子命令，当文件夹存在时会询问输入新的应用名

## [0.2.2] - 2019-02-18

### 更新

- 优化了错误信息提示

## [0.2.1] - 2019-01-29

### 修复

- 修复`toolkit`误报使用`node`原生模块问题

## [0.2.0] - 2019-01-25

### 更新

- 支持分包
- `chrome devtools` 升级到 66
- 移除的`mix`命令（`hap`和`mix`完全一致)
- 优化错误栈信息
- 稳定性优化

### 修复

- 修复初始化模块的 elisnt 配置无效的问题
- 修复若干 bug

## [0.1.1] - 2018-12-28

### 修复

- 初始化项目时，更新项目的 toolkit 的版本号
- 支持 node 6+（未来将不再支持 node 6，建议使用 node 8 以上版本）
- IDE 无法自动升级项目

## [0.1.0] - 2018-12-18

### 更新

- 项目 package.json 的依赖只有 hap-toolkit，移除了其他依赖
- 支持可以自定义属性 data-xxx
- slot 可以作为 text 的子组件
- 支持 postcss 解析 css

### 修复

- 修复了图片资源检查的 bug

### 新增

- 支持 touchstart，touchmove，touchcancel，touchend 事件
- 支持 font-family 样式
- image 组件增加 complete、error 事件
- video 组件支持 muted 属性
- audio 组件支持 stop 方法
- 支持 CSS @font-face
- justify-content 支持 space-around
- background-image 支持网络图片地址
- input/textarea 组件增加 selectionchange 事件
- tab-content 组件增加 scrollable 属性
- input 组件支持动态切换 type 类型
- WebSocket 支持 ArrayBuffer

## [0.0.38] - 2018-11-13

### 更新

- 升级到 babel7
- 升级到 webpack4
- 优化了 webpack 的参数读取方式

### 修复

- transform 支持多个值，动画命名以下划线开发
- 支持 map 组件定位点样式修改
- 修复调试的时候，屏幕息屏的确认

### 新增

- 编译工具支持卡片开发
- 命令行增加清除设备记录,如:hap server --clear-records
- 使用 node 原生模块增加报错提示
- 增加了对 IDE 默认打开浏览器的支持
- 增加了捕获 webpack 的错误提示

### 注意

由于升级 toolkit 到 babel7，webpack4，可能会引起比较大的改动

## [0.0.37] - 2018-10-10

### 更新

- 升级 mocha 到 5.2.0 版本
- 优化了 webpack.config.js

### 修复

- 修复 windows 下资源引用路径时转换的 BUG
- 修复了 adb 执行时候的错误提示
- 修复打包时 manifest.json 中 config.debug 标识的 BUG

### 新增

- 支持 node_modules 模块中引入快应用接口

## [0.0.36] - 2018-9-3

### 更新

- 重构了编译模块，调整了打包的生命周期，从 done 到 after-emit

### 修复

- 引入 json 文件
- 引入 node_modules 中@组织的库

### 新增

- usb 调试功能（1020+）
- build 时增加参数 env.disable-source-map 以禁用 sourcemap

## [0.0.35] - 2018-8-15

### 更新

- chrome 调试页面：隐藏导航条，console 面板增加 warn 提示

### 修复

- 修复调试时，断点调试的问题（1020+）
- 修复微信，微博，qq 账号在控制台下的提示警告问题
- 修复调试时，element 面板的展开问题
- 修复 sourceMap 行数不正确
- 修复打开 chrome 出现的一些问题
- 修复 css 属性 border-color 的解析

### 新增

- 支持 npm run release 打包的 rpk 包增加版本号和时间戳功能
- 调试器支持编辑 html 和属性（1020+）
- 构建 rpk 时向 hap-toolkit 中历史记录的最近 5 条手机设备发送/update HTTP 信息

## [0.0.34] - 2018-6-21

### 更新

- 升级到 webpack3

### 修复

- 修复 translate(tx)转换不正确问题
- 修复 chrome 调试器通过键盘左右键展开 element 节点

### 新增

- 新增 chrome 调试器动态编辑样式功能
- 新增预处理.9 图
- 支持 background-position/ translate % unit
- 多列 picker 属性 type 增加 multi-text 值,增加 onclumnchange 和 cancel 方法
- flexbox 添加 align-self 属性支持
- 新增 textarea 组件属性 maxlength
- 新增 input 组件属性 maxlength，方法 enterkeytype 和 enterkeyclick
- 新增 video 组件属性 controls
- 新增 swiper 组件属性 loop

## [0.0.32] - 2018-5-15

### 修复

- 优化 jszip 打包的参数配置

### 更新

- 重构了编译模块，移除 hap-tools，使用 hap-toolkit 替代
- 优化 package.json 的文件的内容，精简 script 命令
- 更改 hap update --force 方式，覆盖 script, dependencies, devDependencies

## [0.0.31] - 2018-4-13

### 修复

- 打包使用 jszip 替换 node-archiver；进而支持 NodeJS 8.0.\*等版本；

### 新增

- 新增 popup 的事件 visibilitychange；
- 在 manifest.json 里面支持了 debug 调试项；

### 更新

- 更新 init 时的示例代码，调整代码风格；
- 重构 toolkit 项目以及内置模块；
- 如果在 manifest.json 里没有申明 minPlatformVersion，默认为 1070
