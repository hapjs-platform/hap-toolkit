# 开发指南

## 准备

```sh
npm install
# 让 lerna 安装各个模块的依赖，再链接依赖
npx lerna bootstrap && npx lerna bootstrap --hoist=webpack # npm run bootstrap
npx lerna link
```

- 说明：`--hoist=webpack`参数为将各模块所需的 webpack 及其依赖提升至顶层，此时各模块将使用顶层的同一 webpack。

- 原因：webpack5 下，部分内置插件会有判断某个变量是否为某个类的实例，如（使用 extract-css 功能时时）： `compilation instanceof Compilation` 这样的判断。
  开发时由于各模块各自安装 webpack（实际应用时即使用发布版本时，依赖会打平安装，使得用的是同个 webpack），所以上述判断的左右两边并不对等，导致插件运行报错。故使用该参数将其提升。目的在于使各模块使用同一 webpack。

注：正常情况应执行 `npx lerna bootstrap --hoist=webpack` 即可。但在 NodeJS 15 下发现并没有提升。经试验，先安装再执行提升可达到，故先如此执行。

## 构建

### 基本

```sh
npm run gulp
# 推荐使用 npx （须在根目录执行）
npx gulp
# 查看所有任务
npx gulp --tasks
```

### 构建指定模块

```sh
# 构建全部
npx gulp # npm run gulp
npx gulp toolkit # npm run gulp -- toolkit
npx gulp toolkit packager # npm run gulp -- toolkit packager
npx gulp build # 不包含测试
```

## 开发和测试

以下满足大部分开发测试需求(希望)，如果特殊需求，可自行修改 gulpfiles.

### 跳过`minify`

执行 `gulp`、`gulp {toolkit, debugger, packager, build}` 这几个命令时，传入
`--dev` 将跳过 `minify`，方便开发时调试代码

### watch 模式

监听文件，当文件修改时执行任务。

```sh
npx gulp watch                            # 监听全部
npx gulp watch --modules toolkit          # 监听 toolkit
npx gulp watch --modules toolkit,packager # 监听 toolkit 和 packager
npx gulp watch -m t,p                     # 同上
npm run dev                               # gulp watch --dev
```

### 单元测试

```sh
npx gulp test
```

### 项目测试/调试

```sh
npx gulp # 构建项目
node bin/index.js init <testapp> # 创建一个测试项目
cd <testapp> # 进入测试项目
node ../bin/index.js server --watch # 启动服务
node inspect ../bin/index.js server --watch # 调试
```

### 项目测试

使用[npm link] 命令创建软链接。 假设有测试项目 `testapp`，则可以通过下面的方式
创建软链接。

```sh
cd <hap-toolkit-root>
[sudo] npm link
cd <path-to-testapp>
npm link hap-toolkit
```

或

```sh
cd <path-to-testapp>
npm link <hap-toolkit-root>
```

创建软链接后，`hap-toolkit` 中的修改都会映射到 `testapp` 项目下的`hap-toolkit`。

### jest-snapshot

测试使用了[jest snapshot]，避免人工编写预期结果的繁琐。测试修改时，应认真对比
`snapshot`，确保它是正确的，还要记得提交`snapshot`。

使用 `-u` 参数[更新`snapshot`][update-jest-snapshot]:

```shell
npx jest ./server/__tests__/server.js -u
```

### 代码检查

使用`eslint`做代码检查，基于`standard` 规则。配置了[husky] 和[lint-staged]，提交
代码时会自动做一次检查并尝试矫正（fix）

[npm link]: https://docs.npmjs.com/cli/link.html
[husky]: https://github.com/typicode/husky
[lint-staged]: https://github.com/okonet/lint-staged
[jest-snapshot]: https://jestjs.io/docs/en/snapshot-testing
[update-jest-snapshot]: https://jestjs.io/docs/en/snapshot-testing
