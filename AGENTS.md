# AGENTS.md

## npm beta 发包流程

本文只覆盖 beta 版发布，不涉及正式版（latest）。核心约束：

- lerna 3.22.1 fixed mode，实际发布 7 个包：`hap-toolkit` + `@hap-toolkit/{compiler,debugger,dsl-xvm,packager,server,shared-utils}`。
- `hap-toolkit` 是聚合入口，**必须最后发**；不发它，用户 `npm i hap-toolkit@beta` 拿不到任何子包改动。
- 各包只发布 `lib/`，必须先构建。
- 不要用 `lerna publish`：账号 2FA 是 security key，lerna 3 会卡死在 OTP。
- 发布凭据是 granular access token（bypass 2FA，配置在 `~/.npmrc`）；必须走 `https://registry.npmjs.org/`（仓库根 `.npmrc` 已强制）。

脚本在 `scripts/release/`（Node ≥14，无第三方依赖），优先跑脚本。

### 1. 前置确认

```bash
npm whoami                     # 必须是 moshian90s
npm config get registry        # 必须是 https://registry.npmjs.org/
npm view hap-toolkit dist-tags # 看 beta / latest 当前指向
```

### 2. 定版本号（基线 = npm registry，不是 git）

- `beta` dist-tag 指向 `X.Y.Z-beta.N` → 新号取同主线下一个未占用号（如 `2.1.1-beta.1` → `2.1.1-beta.2`）。
- 版本号重复会 E403（npm 不允许覆盖已发布版本），换下一个未占用号即可。
- 不要照抄 git tag（滞后），不要用 `lerna publish prerelease` 自动 bump（会以本地 lerna.json 错算）。

### 3. 构建与工作区

```bash
npm run build  # 产出各包 lib/
```

- 校验各包 `lib/` 非空且包含本次改动（空 lib = 空包）。
- 发布脚本不检查工作区，但 bump 与收尾 commit 需要干净基线；`gitHead` 残留是历史发布写入的噪音，直接丢弃：

```bash
git checkout -- packages/*/package.json examples/sample/package.json yarn.lock examples/sample/yarn.lock
```

### 4. 版本 bump

```bash
node scripts/release/bump-version.mjs <新版本号> --check  # 预检：应列出 11 个文件
node scripts/release/bump-version.mjs <新版本号>          # 落盘 lerna.json + 全部 package.json + 内部 ^ 依赖引用
```

- 11 个文件 = `lerna.json` + 10 个 package.json（`packages/` 下 9 个 + `examples/sample`，含 private 的）。
- `lib/` 无硬编码版本号，bump 后无需重新 build。

### 5. 逐包发布

```bash
node scripts/release/publish.mjs --dry-run  # 预检：版本一致、lib 非空、registry 状态
node scripts/release/publish.mjs --tag beta # 正式发布：拓扑序、跳过已发布版本、失败即停
```

手动兜底：按 `shared-utils → compiler → packager → dsl-xvm → debugger → server → hap-toolkit` 逐包执行（注意目录名带 `hap-` 前缀）：

```bash
npm publish ./packages/hap-shared-utils --tag beta
npm publish ./packages/hap-compiler     --tag beta
npm publish ./packages/hap-packager     --tag beta
npm publish ./packages/hap-dsl-xvm      --tag beta
npm publish ./packages/hap-debugger     --tag beta
npm publish ./packages/hap-server       --tag beta
npm publish ./packages/hap-toolkit      --tag beta   # 聚合入口，最后发
```

注意：

- 路径必须带 `./` 前缀（否则 npm 会把参数当 git URL）。
- 必须 `--tag beta`，漏了会挂到 `latest` 污染正式渠道。
- E403 "cannot publish over the previously published" = 版本已占用，跳过该包继续发其余的。

### 6. 验证

```bash
node scripts/release/verify-publish.mjs         # 核对 7 包均已发布且 beta 指向新版本
npm view hap-toolkit dist-tags                  # beta → 新版本
npm i hap-toolkit@beta                          # 下游试装
```

### 7. git 收尾

- 提交版本 bump（conventional 前缀 + 中文单行标题）。
- 从 fork 开 PR 到上游时只带 feature commit，勿夹带版本 bump。
