#!/usr/bin/env node
import { existsSync, readdirSync } from "node:fs"
import { spawnSync } from "node:child_process"
import { repoRoot, publishablePackages, lernaJson, publishedOnRegistry } from "./common.mjs"

const USAGE = `用法:
  node publish.mjs [<版本号>] [--tag <tag>] [--dry-run] [--keep-going]

按依赖拓扑逐包 npm publish（绕过 lerna 3 的 OTP 死结，见 SKILL.md TS-1）。
默认从 lerna.json 读取版本号；已发布于 registry 的版本自动跳过。

  <版本号>    缺省用 lerna.json 的 version
  --tag       发行渠道，默认 beta（正式版传 latest）
  --dry-run   只盘点 7 包在 registry 的发布状态，不发布
  --keep-going 任一步骤失败也继续（默认失败即停）

示例:
  node publish.mjs --dry-run                    # 发布前预检
  node publish.mjs --tag beta                   # 发布 lerna.json 版本到 beta
  node publish.mjs 2.1.2 --tag latest           # 正式版
  node publish.mjs --tag beta --keep-going      # 单包失败后续跑剩余包`

const registryFlag = "--registry=https://registry.npmjs.org/"

function main() {
  const args = process.argv.slice(2)
  const tagIdx = args.indexOf("--tag")
  const tagArg = tagIdx !== -1 ? args[tagIdx + 1] : undefined
  if (tagIdx !== -1 && !tagArg) {
    console.error("错误：--tag 缺少取值（如 --tag beta）")
    process.exit(2)
  }
  const tag = tagArg || "beta"
  const dryRun = args.includes("--dry-run")
  const keepGoing = args.includes("--keep-going")
  const positional = args.filter((a) => !a.startsWith("-") && a !== tagArg)
  const explicitVersion = positional.find((a) => /^\d/.test(a))

  const root = repoRoot()
  const version = explicitVersion || lernaJson().version
  const packages = publishablePackages()

  const mismatches = packages.filter((p) => p.version !== version)
  if (mismatches.length > 0) {
    console.error(`错误：以下包版本不等于 ${version}，请先执行 bump-version.mjs ${version}：`)
    for (const p of mismatches) console.error(`  ${p.packageName}: ${p.version}`)
    process.exit(1)
  }

  const emptyLib = packages.filter((p) => !existsSync(p.libDir) || readdirSync(p.libDir).length === 0)
  if (emptyLib.length > 0) {
    console.error("错误：以下包 lib/ 为空——先 npm run build，空包会被发布（见 SKILL.md TS-2）：")
    for (const p of emptyLib) console.error(`  ${p.packageName}: ${p.libDir}`)
    process.exit(1)
  }

  const plan = packages.map((p) => ({ ...p, published: publishedOnRegistry(p.packageName, version) }))

  console.log(`计划发布 ${version} → ${tag}（npmjs.org）\n`)
  for (const p of plan) {
    const state = p.published ? "已发布(SKIP)" : "待发布"
    console.log(`  ${state.padEnd(12)} ${p.packageName.padEnd(32)} ${p.version}`)
  }

  if (dryRun) {
    const pending = plan.filter((p) => !p.published)
    console.log(`\ndry-run 结束：${pending.length} 个包待发布，0 个已执行（exit ${pending.length === 0 ? 0 : 1} 提示有待发项）`)
    process.exit(pending.length === 0 ? 0 : 1)
  }

  let failed = false
  for (const p of plan) {
    if (p.published) {
      console.log(`\n[SKIP] ${p.packageName}@${p.version} 已在 registry`)
      continue
    }
    const publishArgs = ["publish", p.path, "--tag", tag, registryFlag]
    if (p.packageName.startsWith("@")) publishArgs.push("--access", "public")
    console.log(`\n[publish] ${p.packageName}@${p.version} --tag ${tag}`)
    const r = spawnSync("npm", publishArgs, { stdio: "inherit", cwd: root })
    if (r.status !== 0) {
      console.error(`\n[FAIL] ${p.packageName} 发布失败（exit ${r.status}）`)
      if (keepGoing) {
        failed = true
        continue
      }
      console.error("已停止。排查见 SKILL.md Troubleshooting；继续剩余包请加 --keep-going 或手动执行。")
      process.exit(1)
    }
  }

  if (failed) console.error("\n存在失败项（--keep-going 模式），请用 verify-publish.mjs 复查")
  console.log("\n发布流程执行完毕。验证：node verify-publish.mjs " + version)
}

main()
