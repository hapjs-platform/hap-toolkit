---
name: hap-toolkit-release
description: hap-toolkit monorepo 的 npm 发包 SOP（beta/正式版）。当用户要求发布或重发 hap-toolkit / @hap-toolkit/* 包、执行 lerna publish / npm publish、问 dist-tag/版本号/OTP/token/2FA 相关发布问题、或发布失败需要排障（EUNCOMMIT、E403、401、No tagged release、gitHead 残留、npmmirror 镜像等）时使用。不用于 hap-toolkit 之外其他包的发布。仅适用于本仓库（lerna 3 fixed mode 7 包同步发版）。
---

# hap-toolkit 发包 SOP

脚本目录：`.agents/skills/hap-toolkit-release/scripts/`（bump-version / publish / verify-publish，Node ≥14，无第三方依赖）。固定逻辑一律优先跑脚本；下述命令均有对应手动兜底。

## 仓库背景（先读，决定一切）

| 事实 | 说明 |
|---|---|
| lerna 3.22.1 **fixed mode** | `lerna.json` 统一版本；bump 需同步 **11 个文件**：`lerna.json` + `packages/*` 全部 10 个 package.json（含 private 的） |
| 实际发布 7 个包 | `hap-toolkit` + `@hap-toolkit/{compiler,debugger,dsl-xvm,packager,server,shared-utils}`；`hap-dev-utils`/`integration-tests`/`examples/sample` 为 `private: true`，lerna 自动跳过 |
| `hap-toolkit` 是聚合入口 | 依赖全部 6 个 `@hap-toolkit/*`（`^` 引用，prerelease 语义下只命中同号段）。**它不发，用户 `npm i hap-toolkit@beta` 拿不到任何子包改动**，是链路最后一道闸门 |
| 只发 `lib/` | 各包 `files` 只含 `lib/**/*.js`（部分包含 templates/babel.config.js 等）。**必须先构建再发，否则空包** |
| npm registry 是唯一事实源 | git tag 严重滞后（v2.0.7 后几乎不打 tag）、本地 `lerna.json` 可能停旧版本；**版本号一律以 `npm view hap-toolkit dist-tags` 计算** |
| 无 CI 自动发布 | ci.yml 只跑测试；正式版也是维护者本地发布后补 release PR |
| 发布账号 `moshian90s` | 2FA 为 **security key (WebAuthn)，无 TOTP 认证器 App**（TOTP 为何不可补绑见文末《背景与政策快照》） |
| registry 双源 | 仓库根 `.npmrc` 强制 `registry=https://registry.npmjs.org/`；用户级 `~/.npmrc` 默认 npmmirror + 内置 npmjs 的 `_authToken`。**发布必须走 npmjs.org** |

## 标准流程（beta 发布）

### 1. 前置确认
```bash
npm whoami                     # 必须是 moshian90s
npm config get registry        # 必须输出 https://registry.npmjs.org/（仓库根 .npmrc 已强制）
npm view hap-toolkit dist-tags # 看 beta / latest 当前指向
```
- 发布凭据用 **granular access token（Read and publish + bypass 2FA）**，写在 `~/.npmrc` 的 `//registry.npmjs.org/:_authToken=npm_xxx`。token 能覆盖 7 包发布权（即使不在 npm owner 列表），并绕开 lerna 3 不支持 security key 的 OTP 死结（见 TS-1）。token 是机密，勿写入仓库/日志。

### 2. 定版本号（基线 = npm registry，不是 git）
- `beta` dist-tag 当前指向 `X.Y.Z-beta.N` → 新号取同主线下一个未占用号（如 beta 为 `2.1.1-beta.1` → 发 `2.1.1-beta.2`）。
- 若本机代码基于更旧主线（如本地 `lerna.json` 停在 `2.0.9-beta.1`），可基于本机可见状态发 `2.0.9-beta.N`（registry 该号段已占用则 +1）。**npm 不允许覆盖已发布版本**，号重复直接 E403（见 TS-11）。
- 不要照抄 git tag（滞后）、不要用 `lerna publish prerelease` 自动 bump（会以本地 lerna.json 为基准错算）。

### 3. 构建与工作区
```bash
npm run build      # gulp 压缩构建，产出各包 lib/
```
- 校验各包 `lib/` 非空且包含本次代码改动（直接发布空 lib = 空包，见 TS-2）。
- 工作区必须干净：未提交改动会让 lerna/npm 报 EUNCOMMIT；**gitHead 残留是常态噪音**（见 TS-5）。

### 4. 版本 bump（跑脚本，不用 lerna 自动 bump）
```bash
node .agents/skills/hap-toolkit-release/scripts/bump-version.mjs <新版本号> --check   # 预检：应列出 11 个文件的 version + 内部依赖引用
node .agents/skills/hap-toolkit-release/scripts/bump-version.mjs <新版本号>           # 落盘
grep -rn "<旧版本号>" lerna.json packages examples                                     # 复核无残留（脚本已同步内部 ^ 引用）
```
- 脚本覆盖 `lerna.json` + 全部 10 个 package.json 的 `version`，并把 `packages/*` 间 `@hap-toolkit/*` / `hap-toolkit` / `hap-dev-utils` 等内部依赖引用（保留 `^` 前缀）同步为新版本；外部同名前缀包（如 `@hap-toolkit/aaptjs`）不会被误伤。
- 手动兜底：改 11 个文件的 `version` + 同步内部依赖引用（重点 `packages/hap-toolkit`）。
- `lib/` 产物无硬编码版本号，**bump 后无需重新 build**。

### 5. 逐包发布（跑脚本，推荐路径，绕过 lerna 3）
发布是批量不可逆操作，先做**发布前预检**（必做）：
```bash
node .agents/skills/hap-toolkit-release/scripts/publish.mjs --dry-run   # 预检：校验版本一致、lib 非空、盘点 7 包 registry 状态
```
内容级预检（可选，仅当怀疑 files 白名单问题时）：在包目录 `npm pack --dry-run` 核对将发布的文件清单（见 TS-2）。
预检通过后正式发布（脚本按拓扑序逐包执行、跳过已发布版本、默认失败即停；单包失败排查后可用 `--keep-going` 续跑剩余包）：
```bash
node .agents/skills/hap-toolkit-release/scripts/publish.mjs --tag beta   # 版本号缺省取 lerna.json
```
脚本在每包 publish 前还校验 `lib/` 非空（防空包，TS-2）。手动兜底：按依赖拓扑从叶子到根 `shared-utils → compiler → packager → dsl-xvm → debugger → server → hap-toolkit`，复制以下清单到回复中，每成功一包勾一项：
```text
发布进度（7/7）：
- [ ] @hap-toolkit/shared-utils
- [ ] @hap-toolkit/compiler
- [ ] @hap-toolkit/packager
- [ ] @hap-toolkit/dsl-xvm
- [ ] @hap-toolkit/debugger
- [ ] @hap-toolkit/server
- [ ] hap-toolkit（最后发，聚合入口）
```

手动逐包命令（脚本等价物）：
```bash
npm publish ./packages/hap-shared-utils --tag beta
npm publish ./packages/hap-compiler     --tag beta
npm publish ./packages/hap-packager     --tag beta
npm publish ./packages/hap-dsl-xvm      --tag beta
npm publish ./packages/hap-debugger     --tag beta
npm publish ./packages/hap-server       --tag beta
npm publish ./packages/hap-toolkit      --tag beta
```
- 路径必须带 `./` 前缀（否则 npm 可能把参数当 git URL，见 TS-6）。
- 必须 `--tag beta`，漏了会挂到 `latest` 污染正式渠道。
- 已在 registry 的版本会报 E403 重复，**重试时跳过已成功的包**（见 TS-11）。
- 失败不累积半发布状态的技巧见 TS-4。

### 6. 验证
```bash
node .agents/skills/hap-toolkit-release/scripts/verify-publish.mjs            # 核对 7 包均已发布且 beta dist-tag 指向新版本（exit 1 = 有缺失）
```
手动兜底：
```bash
npm view hap-toolkit dist-tags                 # beta → 新版本
npm view @hap-toolkit/compiler@<新号> version   # 抽查子包
npm view @hap-toolkit/compiler versions --json # registry 全量可见（同步延迟几分钟）
npm i hap-toolkit@beta                         # 下游试装
```

### 7. git 收尾
- 提交版本变更（仓库惯例：conventional 前缀 + 中文单行标题 + chore 提交说明，参考 commit `edc107e`）。
- 推送到自己的 fork；若分支历史被 squash 过需 `--force-with-lease`。
- 从 fork 开 PR 到上游时只带 feature commit，勿夹带版本 bump（上游维护者用自己的账号/流程发正式版）。

## 正式版（latest）发布

仓库惯例（源自历史，无文档）：
- release 分支 2023 年已废弃，正式版 = **本地将版本号提升为正式号**（如 `2.1.2-beta.1` → `2.1.2`）→ 逐包 `npm publish --tag latest` → **补提 release PR**（标题 `release vX.Y.Z`，base=main，仅含 bump commit）。
- 无 CI 发布；正式版**不打 git tag**；git 侧常滞后于 npm（npm 发布时间可能早于 git commit）。
- `latest` 指向哪个版本以 `npm view hap-toolkit dist-tags` 为准。

## 背景与政策快照（时效性内容，会随 npm/lerna 演进过期）

<details>
<summary>npm 2FA/token 政策与 lerna 支持现状（快照 2026-09；正文中相关判断以此为准）</summary>

- npm 不再开放新的 TOTP（Authenticator App）注册 → 账号 2FA 只能是 security key（WebAuthn/passkey），也解释了正文中"认证器 App 不可补绑"。
- bypass-2FA 的 granular token：已不能用于账户管理操作（建 token、改 maintainer 等），但**发布仍可用**；官方有计划进一步限制"直接发布"，届时本 skill 主路径需重估。
- 发布前提是账号 2FA 开启：关闭 2FA 会被 npm 拒绝 publish。
- lerna 官方 issue #3273（2022 提出，快照时仍 OPEN）：lerna 不支持 security key 认证；PR #4417（2026-08 提交）若合并发布，升级 lerna 或可走通，届时回到 TS-10 路径重新评估。

</details>

## Troubleshooting

### TS-1: lerna 反复要 `Enter OTP` / `This operation requires a one-time password`，输码永远失败
**现象**：`lerna publish` 卡在 OTP 提示，无论输什么都 401/403。
**根因**：账号 2FA 是 **security key（WebAuthn/passkey），没有 TOTP 认证器**，不存在 6 位动态码。lerna 3.x 内部走旧式 npm 认证（只认 TOTP 输码），长期不支持 security key 发布（相关 issue/PR 进度见文末《背景与政策快照》），**升级 lerna 也解决不了**。
**解法**：放弃 lerna publish，改用**逐包 `npm publish` + bypass-2FA 的 granular token**（见标准流程第 5 步）。
**不要做**：关闭 2FA（npm 要求账号必须开 2FA 才能 publish）；输 recovery code（见 TS-8）；输任意 hex/hash。

### TS-2: 发布成功但装下来是空包 / 包体积异常小
**现象**：`npm i` 后 require 不到模块，或 registry 上包 tarball 只有几 KB。
**根因**：各包 `files` 只含 `lib/**/*.js`，但 `lib/` 为空（未构建或 clean 过），发布物是空壳。
**解法**：发布前 `npm run build`，并检查 `ls packages/<pkg>/lib/` 非空、含本次改动。构建完成后才能 bump/发布。

### TS-3: 版本号重复 → `E403 You cannot publish over the previously published versions: X.Y.Z-beta.N`
**现象**：publish 时报 E403，npm 登录态与包权限均正常。
**根因**：该版本号 registry 上已存在（可能是本批次中途成功了一部分，或别人发过）。
**解法**：不是权限问题。换下一个未占用版本号重新 bump（先 `npm view <pkg> versions --json` 确认），或确认已成功的包后**跳过重发**继续剩余包。

### TS-4: 半发布状态（部分包成功、部分失败）
**现象**：7 包中只成功 N 个，npm 上版本不齐，`hap-toolkit` 主包缺失。
**原因**：中途失败（OTP、单包权限、网络）。注意 granular token 授权下逐包发布**不会**像 lerna 那样先污染本地 git。
**解法**：
- 先 `npm view @hap-toolkit/<每个包> versions --json` 盘点哪些已发。
- 失败的包单独重发（跳过已成功的，见 TS-11）。
- 若某包确实无权限且不在计划内：评估是否可只发 scoped 子包 + 让用户直装 `@hap-toolkit/compiler@beta` 验证（聚合包 hap-toolkit 不动则下游 `npm i hap-toolkit@beta` 无效）。

### TS-5: `EUNCOMMIT Working tree has uncommitted changes` / gitHead 残留反复出现
**现象**：lerna/npm 发布时把 `gitHead` 字段写入各包 package.json 但未提交，工作区永远"脏"；`from-git` 也常因此拒绝。
**根因**：`gitHead`（指向发布 commit）由发布流程写入本地 package.json；npm 下次 publish 会重新注入正确值，本地残留是冗余噪音。
**解法**：丢弃即可，无需提交：
```bash
git checkout -- packages/*/package.json examples/sample/package.json yarn.lock examples/sample/yarn.lock
```
（若里面有真实改动如版本 bump，先 commit 再丢弃残留部分。）

### TS-6: `npm publish packages/hap-compiler` 报 git 访问错误（尝试 fetch `git@github.com/packages/hap-compiler.git`）
**根因**：npm/cli 已知 bug（issue #2796）——monorepo 中发布无 `repository` 字段的包时，不带 `./` 的路径参数会被当成 git URL 去 `git ls-remote`。
**解法**：路径加 `./` 前缀：`npm publish ./packages/hap-compiler`；或 `cd packages/hap-compiler && npm publish`。

### TS-7: 发布 401 / 发布到了错误的源
**现象**：401 Unauthorized，或发到了 npmmirror / 公司镜像而不是 npmjs。
**根因**：`~/.npmrc` 默认 registry 是 `https://registry.npmmirror.com/`（只读镜像），authToken 只对 `//registry.npmjs.org/` 有效。
**解法**：在仓库根执行（根 `.npmrc` 已强制 npmjs.org），并 `npm config get registry` 确认；仍不放心就显式加 `--registry https://registry.npmjs.org/`。

### TS-8: 输入 recovery code 当 OTP → 401
**根因**：npm 的 Recovery Code 只用于**重置 2FA 时的账号恢复**，官方禁止当 OTP 用于发布；认证器里也没有可输的码（security key 账号本来无 TOTP）。
**解法**：见 TS-1——别跟 OTP 提示搏斗，直接换 granular token（bypass 2FA）逐包发布。

### TS-9: 有 granular token 仍被要求 OTP
**根因**：创建 token 时没勾选 **bypass 2FA**（"This token can bypass two-factor authentication"）选项。
**解法**：npmjs.com → Access Tokens → 重新生成 granular token，勾选目标包（建议只勾要发的 7 包范围，最小化泄露面）+ bypass 2FA，替换 `~/.npmrc` 后重试。

### TS-10: `lerna publish from-git` → `No tagged release found` / `No changed packages to publish`
**现象**：版本号与 tag 均已就绪，但 lerna 输出 `lerna notice from-git No tagged release found` 或 `lerna success No changed packages to publish`，一个包都不发。
**根因**（两条独立规则，都踩过）：
1. `from-git` 只认**指向当前 HEAD** 的 tag——HEAD 在 tag 之上有别的提交就匹配不到。
2. `from-git` 用 `git diff-tree HEAD` 找**本提交改动的包**——tag 指向的提交若只含 yarn.lock/chore 而无 package.json 版本变更，匹配不到任何包。
**解法**：把 feature 改动 + 版本 bump **squash 成单个提交**，tag 打到它上面，HEAD 与之重合，再 `npx lerna publish from-git --dist-tag beta --yes`。

> ⚠️ **仅用于诊断**这两个报错的现象理解；**不要照此执行发布**——lerna 3 在 security-key 账号上最终仍会卡死在 OTP（TS-1），此路径只在账号具备 TOTP 或使用 CI token 时才可行。当前唯一主路径是标准流程第 5 步的逐包 `npm publish`。

### TS-11: E403 分不清"无权限"与"版本已占用"
**区分方法**：
```bash
npm view hap-toolkit versions --json | grep "<该版本>"   # 存在 → 版本占用（换号）
npm access list collaborators hap-toolkit moshian90s   # 查具体用户权限
```
403 文案含 `cannot publish over the previously published` = 版本占用；含 `You do not have permission` = 无权限。granular token 若勾选了包范围，即使不在 owner 列表也可发布（历史实证：hap-toolkit 主包 owner 列表无 moshian90s，token 照样发成功）。

### TS-12: 新 beta 版本号低于已存在的正式版（如发 2.0.9-beta.4，而 latest 已是 2.1.1）
**后果**：semver 上 `2.0.9-beta.4 < 2.1.1`，beta dist-tag 与 latest 隔离所以功能不受影响，但版本号观感"旧主线回归"，且 2.0.9-beta 号段可能已被他人占用。
**解法**：代码基线不可追溯时，优先基于本机可追溯状态选号；若本机代码内容与更高主线一致，直接取**更高主线的下一个 beta 号**（如 2.1.2-beta.1）更干净（历史实证：2.0.9-beta.4 发完又重发 2.1.2-beta.1 覆盖）。

### TS-13: lerna `--force-publish` 是否危险
**结论**：fixed mode 下**不危险且必要**——不 force 时未变更的包会被跳过，git 记录新版本而 npm 缺失 → "幽灵版本"。它不会覆盖已发布版本（npm 层面禁止）。逐包发布路径（标准流程）没有此问题，无需该参数。
