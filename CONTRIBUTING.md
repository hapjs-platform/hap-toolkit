# 贡献指南

感谢参与 hap-toolkit 的开发！在提交 Pull Request 之前，请先阅读以下内容。

## 开发环境

开发、构建、测试相关的详细说明请参考[开发指南](./readme.md)。

## 提交 Pull Request

### 版本号变更

日常的功能 / 修复 PR 不需要变更版本号，也请避免在 PR 中夹带版本号修改，包括：

- `lerna.json` 中的 `version` 字段
- 各 `package.json`（根目录、`packages/*`、`examples/sample`）中的 `version` 字段
- 各包内部依赖其他包时使用的版本号（如 `"@hap-toolkit/shared-utils": "2.x.y"`）

版本号的同步由维护者在**发版后**通过独立的版本号 PR 完成。例如 [release v2.0.7][pr-157] 就是一个这样的 case：该 PR 只包含版本号相关文件的改动，不夹带功能代码。这样可以避免：

- 多个 PR 同时 bump 同一版本造成频繁的合并冲突
- 仓库中的版本号与 npm registry 上的实际发布状态不一致

如果你的工作区中存在版本号改动（例如本地跑过发布脚本），提交 PR 前请先将相关文件还原：

```sh
git checkout main -- lerna.json examples/sample/package.json packages/*/package.json
```

[pr-157]: https://github.com/hapjs-platform/hap-toolkit/pull/157
