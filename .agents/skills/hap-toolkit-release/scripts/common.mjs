import { spawnSync } from "node:child_process"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { dirname, join } from "node:path"

export const REGISTRY = "https://registry.npmjs.org/"

export const PUBLISH_ORDER = [
  "shared-utils",
  "compiler",
  "packager",
  "dsl-xvm",
  "debugger",
  "server",
  "toolkit",
]

export function repoRoot() {
  let dir = process.cwd()
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "lerna.json"))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    "未找到 lerna.json：请在仓库根目录或其子目录下执行（cwd 向上最多 8 层）"
  )
}

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"))
}

const ROOT = repoRoot()

export function lernaJson() {
  return readJson(join(ROOT, "lerna.json"))
}

export function packageDirs() {
  const pkgs = []
  for (const name of readdirSync(join(ROOT, "packages"))) {
    const pkgDir = join(ROOT, "packages", name)
    const pkgFile = join(pkgDir, "package.json")
    if (!existsSync(pkgFile)) continue
    pkgs.push({ name, dir: pkgDir, file: pkgFile })
  }
  const sampleFile = join(ROOT, "examples", "sample", "package.json")
  if (existsSync(sampleFile)) {
    pkgs.push({ name: "sample", dir: join(ROOT, "examples", "sample"), file: sampleFile })
  }
  return pkgs
}

export function publishablePackages() {
  const list = []
  for (const pkg of packageDirs()) {
    const manifest = readJson(pkg.file)
    if (manifest.private) continue
    list.push({
      dirName: pkg.name,
      packageName: manifest.name,
      version: manifest.version,
      path: `./packages/${pkg.name}`,
      libDir: join(ROOT, "packages", pkg.name, "lib"),
    })
  }
  list.sort((a, b) => {
    const ra = PUBLISH_ORDER.indexOf(a.dirName.replace(/^hap-/, ""))
    const rb = PUBLISH_ORDER.indexOf(b.dirName.replace(/^hap-/, ""))
    return (ra === -1 ? 99 : ra) - (rb === -1 ? 99 : rb)
  })
  return list
}

export function npmView(args) {
  const r = spawnSync("npm", ["view", ...args, "--registry", REGISTRY], {
    encoding: "utf8",
  })
  return { ok: r.status === 0, stdout: (r.stdout || "").trim() }
}

export function publishedOnRegistry(packageName, version) {
  const { ok, stdout } = npmView([`${packageName}@${version}`, "version"])
  return ok && stdout.length > 0
}

export function distTagsOf(packageName) {
  const { ok, stdout } = npmView([packageName, "dist-tags", "--json"])
  if (!ok) return {}
  try {
    return JSON.parse(stdout)
  } catch {
    return {}
  }
}
