#!/usr/bin/env node
/**
 * @ux/tokens build — produces ESM (.mjs) + CJS (.cjs) + d.ts + variables.css
 * Uses tsc directly (no rollup) to avoid native-binary platform mismatches.
 */
import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, existsSync, statSync, rmSync as nodeRmSync } from "node:fs"
import { dirname, join, resolve } from "node:path"

// Tolerant delete: ignores EPERM (legacy: this script also runs on read-only
// mounts where deletes silently fail). On normal filesystems it really deletes.
function rmSync(p, opts) {
  try { nodeRmSync(p, opts) } catch (e) { if (e?.code !== "EPERM" && e?.code !== "EACCES") throw e }
}
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const DIST = join(ROOT, "dist")

console.log("[tokens] cleaning dist…")
rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

console.log("[tokens] tsc — emitting ESM .js + .d.ts…")
execSync("npx --no-install tsc -p tsconfig.json", { cwd: ROOT, stdio: "inherit" })

console.log("[tokens] renaming .js → .mjs (ESM)…")
// Two-pass walk: snapshot the list of .js files first, THEN rename them.
// Iterating a directory while we delete/rename inside it leads to ENOENT
// on the next iteration when readdirSync's snapshot points at a now-gone entry.
function collectJsFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    if (!existsSync(p)) continue
    if (statSync(p).isDirectory()) collectJsFiles(p, out)
    else if (p.endsWith(".js")) out.push(p)
  }
  return out
}

for (const p of collectJsFiles(DIST)) {
  if (!existsSync(p)) continue
  const newP = p.replace(/\.js$/, ".mjs")
  // rewrite source-map URL refs and relative .js imports → .mjs
  let src = readFileSync(p, "utf8")
  src = src.replace(/(from\s+['"])(\.[^'"]+?)\.js(['"])/g, "$1$2.mjs$3")
  src = src.replace(/(import\s*\(\s*['"])(\.[^'"]+?)\.js(['"])/g, "$1$2.mjs$3")
  src = src.replace(/\/\/# sourceMappingURL=([^\s]+)\.js\.map/g, "//# sourceMappingURL=$1.mjs.map")
  writeFileSync(newP, src)
  rmSync(p, { force: true })

  const map = p + ".map"
  if (existsSync(map)) {
    // patch the source-map "file" field too
    const mapText = readFileSync(map, "utf8")
    try {
      const j = JSON.parse(mapText)
      if (j.file) j.file = j.file.replace(/\.js$/, ".mjs")
      writeFileSync(newP + ".map", JSON.stringify(j))
    } catch {
      writeFileSync(newP + ".map", mapText)
    }
    rmSync(map, { force: true })
  }
}

console.log("[tokens] generating CJS .cjs from sources…")
// Compile a parallel CJS build using a tweaked tsconfig
const cjsTsconfig = {
  compilerOptions: {
    target: "ES2020",
    module: "CommonJS",
    moduleResolution: "node",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    isolatedModules: true,
    declaration: false,
    sourceMap: true,
    outDir: "dist-cjs",
    jsx: "react-jsx",
    baseUrl: ".",
    paths: { "@ux/tokens": ["../tokens/src"] },
  },
  include: ["src/**/*.ts"],
  exclude: ["node_modules"],
}
writeFileSync(join(ROOT, "tsconfig.cjs.json"), JSON.stringify(cjsTsconfig, null, 2))
execSync("npx --no-install tsc -p tsconfig.cjs.json", { cwd: ROOT, stdio: "inherit" })
const renameJsToCjs = (srcDir, dstDir) => {
  mkdirSync(dstDir, { recursive: true })
  for (const e of readdirSync(srcDir)) {
    const p = join(srcDir, e)
    const dp = join(dstDir, e)
    if (statSync(p).isDirectory()) renameJsToCjs(p, dp)
    else if (p.endsWith(".js")) {
      let src = readFileSync(p, "utf8")
      src = src.replace(/require\((['"])(\.[^'"]+?)\.js(['"])\)/g, 'require($1$2.cjs$3)')
      writeFileSync(dp.replace(/\.js$/, ".cjs"), src)
    } else if (p.endsWith(".js.map")) {
      try {
        const dst = dp.replace(/\.js\.map$/, ".cjs.map")
        writeFileSync(dst, readFileSync(p, "utf8"))
      } catch { /* read-only mount: tolerate */ }
    }
  }
}
renameJsToCjs(join(ROOT, "dist-cjs"), DIST)
rmSync(join(ROOT, "dist-cjs"), { recursive: true, force: true })
rmSync(join(ROOT, "tsconfig.cjs.json"), { force: true })

console.log("[tokens] copying CSS variables…")
mkdirSync(join(DIST, "css"), { recursive: true })
const stylesGlobals = resolve(ROOT, "../../styles/globals.css")
if (existsSync(stylesGlobals)) {
  // Extract just the :root + .dark blocks for portable variables.css
  const css = readFileSync(stylesGlobals, "utf8")
  const root = css.match(/:root\s*\{[\s\S]*?\n\s*\}/)
  const dark = css.match(/\.dark\s*\{[\s\S]*?\n\s*\}/)
  const out = `/* @ux/tokens — CSS custom properties\n   Auto-generated from styles/globals.css\n*/\n\n${root ? root[0] : ""}\n\n${dark ? dark[0] : ""}\n`
  writeFileSync(join(DIST, "css", "variables.css"), out)
} else {
  // fallback to built-in cssVariables string
  const idxMjs = readFileSync(join(DIST, "index.mjs"), "utf8")
  const m = idxMjs.match(/cssVariables\s*=\s*`([\s\S]*?)`/)
  writeFileSync(join(DIST, "css", "variables.css"), `:root {\n${m ? m[1] : ""}\n}\n`)
}

console.log("[tokens] writing per-layer barrel entry points…")
// The package.json `exports` field references ./primitive, ./alias, ./component
// Re-export them from the layer files so consumers can import "@ux/tokens/primitive"
for (const layer of ["primitive", "alias", "component"]) {
  // ESM
  writeFileSync(join(DIST, `${layer}.mjs`), `export * from "./layers/${layer}.mjs";\n`)
  writeFileSync(join(DIST, `${layer}.cjs`), `"use strict";\nObject.defineProperty(exports, "__esModule", { value: true });\nmodule.exports = require("./layers/${layer}.cjs");\n`)
  writeFileSync(join(DIST, `${layer}.d.ts`), `export * from "./layers/${layer}";\n`)
}

console.log("[tokens] done.")
