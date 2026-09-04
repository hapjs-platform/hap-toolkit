# Evaluations — hap-toolkit-release

按 skill 最佳实践（evaluation-driven development）建立。使用方式：用一个全新 agent 会话（不带本会话上下文）加载 skill 后执行下列 query，对照 `expected_behavior` 判定通过/失败；失败项回填 SKILL.md。

## 场景 1：完整 beta 发布（happy path）

query: 把 feature 分支 `feat/video-controlstoggle-event` 上的改动发一个 beta 包。

expected_behavior:
- 先做前置确认：`npm whoami`（moshian90s）、`npm config get registry`、`npm view hap-toolkit dist-tags`
- 版本号以 registry beta dist-tag 为基线计算下一个未占用号，不照抄 git tag / 本地 lerna.json
- 要求或执行 `npm run build` 并校验各包 `lib/` 非空
- 用 `scripts/bump-version.mjs <号> --check` 预检后落盘（11 文件 + 内部依赖引用），并 grep 校验无旧号残留
- 发布前执行 `scripts/publish.mjs --dry-run` 预检
- 用 `scripts/publish.mjs --tag beta` 发布（拓扑序、跳过已发布、失败即停），或手动逐包等价命令
- 用勾选清单跟踪 7 包进度（脚本模式由脚本输出承担，手动模式必须用清单）
- 用 `scripts/verify-publish.mjs` 验证 7/7 一致
- 不使用 `lerna publish` 走 OTP 交互；不用 recovery code；不关闭 2FA

## 场景 2：E403 排障（TS-3/TS-11 判别）

query: 用户贴出以下日志，问为什么发不上去：
`lerna http fetch PUT 403 https://registry.npmjs.org/@hap-toolkit%2fshared-utils`
`lerna ERR! E403 You cannot publish over the previously published versions: 2.0.9-beta.4.`

expected_behavior:
- 判定为版本占用而非权限问题（不引导用户改权限/换账号）
- 用 `npm view <pkg> versions --json` 盘点该版本是否已发布、哪些包已成功
- 建议跳过已成功的包继续发剩余包，或换下一个未占用版本号
- 若用户此前卡 OTP，识别出 recovery code 输入导致 401 的链条（TS-8）并纠正

## 场景 3：触发准确性（description 路由）

should-trigger queries（应加载本 skill）：
- "把这个改动发个 hap-toolkit 的 beta 版本"
- "lerna publish 卡在 Enter OTP 怎么办"
- "npm publish 报 E403 cannot publish over the previously published versions"
- "现在 beta 渠道的版本号是多少，下一个该发什么"
- "发包后 npm 上暂时查不到新版本"

should-not-trigger queries（不应加载本 skill）：
- "帮我发布 @mi/xxx 到公司 pkgs.d.xiaomi.net 镜像"
- "写一个 gh release 发布说明"
- "用 vsce 发布 vscode 插件"

expected_behavior: 全部命中/不命中与上表一致。

## 场景 4：内容断言回归（防措辞漂移，每次大改后跑）

expected_behavior:
- 全文不含真实 `_authToken` 值（不得出现 `npm_` 开头的 20+ 位字符串）
- 正文（非快照节）不含绝对年份日期；日期只出现在《背景与政策快照》
- 命令用可移植工具：无 `rg`、无 `\` 反斜杠路径
- 术语一致：路径均 `./packages/...` 或 `packages/...`（不混用 `packages\`）
- 每个 TS 含 现象/根因/解法 或等价结构（结论型如 TS-13 除外）
- 主路径唯一且清晰：标准流程第 5 步（scripts/publish.mjs 逐包发布）为唯一主路径，TS-10 带"仅诊断勿执行"护栏
- 引用的仓库文件路径真实存在（lerna.json、packages/hap-*/package.json、commit edc107e）
- scripts/ 下脚本存在且可执行：`bump-version.mjs <新号> --check` 不落盘、`publish.mjs --dry-run` 与 `verify-publish.mjs` 为只读操作（不得包含任何写 registry 的隐藏动作）
- scripts/ 不引入第三方依赖、不含密钥；脚本互相引用仅限 common.mjs

## 使用记录

| 日期 | 场景 | 结果 | 回填项 |
|---|---|---|---|
| （首次真实发包后填写） | | | |
