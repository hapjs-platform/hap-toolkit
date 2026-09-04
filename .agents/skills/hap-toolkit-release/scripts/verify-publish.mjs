#!/usr/bin/env node
import { publishablePackages, lernaJson, publishedOnRegistry, distTagsOf } from "./common.mjs"

const USAGE = `用法:
  node verify-publish.mjs [<版本号>] [--tag <tag>]

核对发布包在 registry 上是否都已发布指定版本、指定 dist-tag 是否指向该版本。
缺省版本号取 lerna.json；缺省 --tag 为 beta（正式版核对传 --tag latest）。
任一包缺失或 tag 未指向则 exit 1。

示例:
  node verify-publish.mjs                    # beta 发布核对（lerna.json 版本）
  node verify-publish.mjs 2.1.2 --tag latest # 正式版核对`

function main() {
  const args = process.argv.slice(2)
  const tagIdx = args.indexOf("--tag")
  const tagArg = tagIdx !== -1 ? args[tagIdx + 1] : undefined
  if (tagIdx !== -1 && !tagArg) {
    console.error("错误：--tag 缺少取值（如 --tag latest）")
    process.exit(2)
  }
  const tag = tagArg || "beta"
  const positional = args.filter((a) => !a.startsWith("-") && a !== tagArg)
  const version = positional.find((a) => /^\d/.test(a)) || lernaJson().version
  const packages = publishablePackages()

  let missing = 0
  let tagMismatch = 0
  console.log(`核对 ${version} @ npmjs.org（${tag} dist-tag）\n`)
  for (const p of packages) {
    const published = publishedOnRegistry(p.packageName, version)
    const tags = distTagsOf(p.packageName)
    const tagOk = published && tags[tag] === version
    if (!published) missing++
    else if (tags[tag] !== version) tagMismatch++
    const why = !published
      ? "  (未发布)"
      : tags[tag] === version
        ? ""
        : `  (${tag} dist-tag 指向 ${tags[tag] ?? "-"})`
    console.log(`${tagOk ? "OK  " : "MISS"}  ${p.packageName.padEnd(32)} ${published ? version : "-"}${why}`)
  }

  if (missing + tagMismatch > 0) {
    console.error(
      `\n${missing} 个包未发布 ${version}，${tagMismatch} 个包 ${tag} dist-tag 未指向该版本。` +
        "registry 同步有几分钟延迟，可稍后重试；未发布的包用 publish.mjs 补发（SKILL.md TS-4/TS-11）。"
    )
    process.exit(1)
  }
  console.log(`\n7 包全部已发布，${tag} dist-tag 全部指向 ${version}。`)
}

main()
