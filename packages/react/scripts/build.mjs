#!/usr/bin/env node
/**
 * @ux/react build — tsc-based, no rollup, no native bindings.
 *
 * Steps:
 *   1. tsc compiles TypeScript → ESM .js + .d.ts in dist/
 *   2. Post-process: rewrite "@/..." path aliases to relative imports
 *   3. Post-process: add .js extensions to relative imports (Node ESM needs them)
 *   4. Add "use client"; banner where the file uses React hooks/JSX
 */
import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, rmSync, renameSync, mkdirSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const DIST = join(ROOT, "dist")

console.log("[react] tsc — compiling TypeScript…")
execSync("npx --no-install tsc -p tsconfig.build.json", { cwd: ROOT, stdio: "inherit" })

// tsconfig.build.json maps `@ux/tokens` to ../tokens/src via `paths`. With no
// explicit `rootDir`, tsc infers the rootDir as the common ancestor of the
// react src and the tokens src (= `packages/`). It then emits:
//
//     dist/react/src/index.js     ← the real react barrel
//     dist/react/src/components/… ← real react component source
//     dist/react/src/lib/utils.js
//     dist/tokens/src/…           ← cross-package leak we don't ship
//
// Lift dist/react/src/* → dist/, drop dist/react/ and dist/tokens/, so the
// final tree matches the package.json `exports` map (./dist/index.js etc.).
const lifted = join(DIST, "react", "src")
if (existsSync(lifted)) {
  for (const entry of readdirSync(lifted)) {
    const from = join(lifted, entry)
    const to = join(DIST, entry)
    rmSync(to, { recursive: true, force: true })   // remove any stale target
    renameSync(from, to)
  }
  rmSync(join(DIST, "react"), { recursive: true, force: true })
  console.log("[react] lifted dist/react/src/* → dist/")
}
rmSync(join(DIST, "tokens"), { recursive: true, force: true })  // cross-package leak — never ships

console.log("[react] post-process: rewriting imports…")
const walk = (dir, fn) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, fn)
    else fn(p)
  }
}

const aliasRegex = /(['"])@\/([^'"]+)\1/g                 // "@/lib/utils" or "@/components/Button/Button"
const relImportRegex = /from\s+(['"])(\.\.?\/[^'"]+?)\1/g // import-from with relative spec
const reqRegex = /require\((['"])(\.\.?\/[^'"]+?)\1\)/g   // require() with relative spec

let filesProcessed = 0
walk(DIST, (p) => {
  if (!p.endsWith(".js") && !p.endsWith(".d.ts")) return

  let src = readFileSync(p, "utf8")
  const fileDir = dirname(p)
  let changed = false

  // 1) Resolve "@/foo/bar" → "./relative/path/to/foo/bar"
  src = src.replace(aliasRegex, (_m, q, rest) => {
    changed = true
    const target = join(DIST, rest)
    let rel = relative(fileDir, target).replace(/\\/g, "/")
    if (!rel.startsWith(".")) rel = "./" + rel
    return `${q}${rel}${q}`
  })

  // 2) Add .js extension to relative imports/exports that have none
  //    (skip if it already has an extension or ends with /)
  if (p.endsWith(".js")) {
    const addExt = (specifier) => {
      if (/\.(js|cjs|mjs|json|css)$/.test(specifier)) return specifier
      if (specifier.endsWith("/")) return specifier + "index.js"
      // is it a directory? (test if a dir exists at the resolved location)
      const abs = resolve(fileDir, specifier)
      if (existsSync(abs) && statSync(abs).isDirectory()) return specifier + "/index.js"
      return specifier + ".js"
    }

    src = src.replace(/\b(from|import)\s+(['"])(\.\.?\/[^'"]+?)\2/g, (_m, kw, q, spec) => {
      changed = true
      return `${kw} ${q}${addExt(spec)}${q}`
    })
    src = src.replace(/\bimport\s*\(\s*(['"])(\.\.?\/[^'"]+?)\1\s*\)/g, (_m, q, spec) => {
      changed = true
      return `import(${q}${addExt(spec)}${q})`
    })
    src = src.replace(/\bexport\s+(?:\*|\{[^}]*\})\s*from\s+(['"])(\.\.?\/[^'"]+?)\1/g, (_m, q, spec) => {
      changed = true
      // re-emit by rewriting the entire match group via a second pass
      return _m.replace(`${q}${spec}${q}`, `${q}${addExt(spec)}${q}`)
    })
  }

  // Targeted "use client" banner — only if file uses hooks/Context/JSX-like primitives
  if (p.endsWith(".js")) {
    const usesClient =
      /React\.(use|create)|forwardRef|useState|useEffect|useContext|useReducer|useRef|useMemo|useCallback|useId|useTransition|useFormContext|Controller|FormProvider|cmdk|embla|Slot/.test(src)
    if (usesClient && !src.startsWith('"use client";')) {
      src = `"use client";\n` + src
      changed = true
    }
  }

  if (changed) {
    writeFileSync(p, src)
    filesProcessed++
  }
})

console.log(`[react] post-process: rewrote ${filesProcessed} files.`)
console.log("[react] done.")
