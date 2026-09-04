#!/usr/bin/env node
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { repoRoot, packageDirs, lernaJson, readJson } from "./common.mjs"

const USAGE = `用法:
  node bump-version.mjs <版本号> [--check]

将 lerna.json 与全部子包 package.json（fixed mode）的 version
及内部包依赖引用同步为新版本。

  <版本号>  形如 2.1.2-beta.2 / 2.1.2
  --check   只打印将改动的文件与字段，不落盘（预检）

示例:
  node bump-version.mjs 2.1.2-beta.2 --check
  node bump-version.mjs 2.1.2`

const VERSION_RE = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/
const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]

const ROOT = repoRoot()
const ALL_PACKAGES = packageDirs().map((dir) => {
  const manifest = readJson(dir.file)
  return { ...dir, manifest }
})
const LOCAL_PACKAGE_NAMES = new Set(ALL_PACKAGES.map((p) => p.manifest.name))
const LERNA_FILE = join(ROOT, "lerna.json")

function main() {
  const args = process.argv.slice(2)
  const version = args.find((a) => !a.startsWith("-"))
  const checkOnly = args.includes("--check")

  if (!version) {
    console.error(USAGE)
    process.exit(2)
  }
  if (!VERSION_RE.test(version)) {
    console.error(`版本号格式非法: ${version}（期望形如 2.1.2-beta.2）`)
    process.exit(2)
  }

  const lerna = lernaJson()
  if (lerna.version === version) {
    console.error(`lerna.json 已是 ${version}，无需 bump`)
    process.exit(1)
  }
  const oldVersion = lerna.version

  const changes = [{ file: LERNA_FILE, kind: "version", from: oldVersion, to: version }]

  for (const pkg of ALL_PACKAGES) {
    const { manifest } = pkg
    if (manifest.version !== oldVersion && manifest.version !== version) {
      console.error(
        `警告：${pkg.file} 版本为 ${manifest.version}（与 lerna.json 的 ${oldVersion} 漂移），将同步到 ${version}；` +
          "漂移可能来自未提交的本地改动，请确认后继续"
      )
    }
    if (manifest.version !== version) {
      changes.push({ file: pkg.file, kind: "version", from: manifest.version, to: version })
    }
    for (const field of DEP_FIELDS) {
      const deps = manifest[field]
      if (!deps) continue
      for (const [depName, spec] of Object.entries(deps)) {
        if (!LOCAL_PACKAGE_NAMES.has(depName)) continue
        const prefix = /^[~^]/.test(spec) ? spec[0] : ""
        if (spec.slice(prefix.length) !== version) {
          changes.push({
            file: pkg.file,
            kind: "dep",
            depField: field,
            depName,
            from: spec,
            to: prefix + version,
          })
        }
      }
    }
  }

  if (checkOnly) {
    console.log(`将把 ${oldVersion} → ${version}，共 ${changes.length} 处改动：`)
    for (const c of changes) {
      const where = c.kind === "version" ? "version" : `${c.depField}.${c.depName}`
      console.log(`  ${c.file}  ${where}: ${c.from} → ${c.to}`)
    }
    return
  }

  const files = new Map()
  for (const c of changes) {
    if (!files.has(c.file)) files.set(c.file, readJson(c.file))
    const doc = files.get(c.file)
    if (c.kind === "version") doc.version = version
    else doc[c.depField][c.depName] = c.to
  }
  for (const [file, doc] of files) {
    writeFileSync(file, JSON.stringify(doc, null, 2) + "\n")
  }

  console.log(
    `已完成：${oldVersion} → ${version}（${changes.length} 处改动，${files.size} 个文件）`
  )
  console.log(`检查 git 差异：git diff --stat lerna.json packages examples`)
}

main()
