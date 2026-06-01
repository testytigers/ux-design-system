#!/usr/bin/env node
/**
 * @ux/mcp-design-system build — tsc-based, plus .js-extension rewriting
 * and a shebang on the entry point so npx can launch it directly.
 */
import { execSync } from "node:child_process"
import { readFileSync, writeFileSync, readdirSync, statSync, chmodSync, existsSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const DIST = join(ROOT, "dist")

console.log("[mcp] tsc — compiling…")
execSync("npx --no-install tsc -p tsconfig.json", { cwd: ROOT, stdio: "inherit" })

// Post-process: add .js extensions to relative imports (Node ESM requires them)
console.log("[mcp] post-process: rewriting imports…")
function walk(dir, fn) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, fn)
    else fn(p)
  }
}
let processed = 0
walk(DIST, (p) => {
  if (!p.endsWith(".js")) return
  const fileDir = dirname(p)
  let src = readFileSync(p, "utf8")
  let changed = false
  const addExt = (spec) => {
    if (/\.(js|cjs|mjs|json)$/.test(spec)) return spec
    if (spec.endsWith("/")) return spec + "index.js"
    const abs = resolve(fileDir, spec)
    if (existsSync(abs) && statSync(abs).isDirectory()) return spec + "/index.js"
    return spec + ".js"
  }
  src = src.replace(/\b(from|import)\s+(['"])(\.\.?\/[^'"]+?)\2/g, (_m, kw, q, spec) => {
    changed = true
    return `${kw} ${q}${addExt(spec)}${q}`
  })
  src = src.replace(/\bexport\s+(?:\*|\{[^}]*\})\s*from\s+(['"])(\.\.?\/[^'"]+?)\1/g, (m, q, spec) => {
    changed = true
    return m.replace(`${q}${spec}${q}`, `${q}${addExt(spec)}${q}`)
  })
  if (changed) writeFileSync(p, src), processed++
})
console.log(`[mcp] rewrote ${processed} files.`)

// Add a shebang to server.js and make it executable so `npx ux-design-system-mcp`
// (and Claude Desktop's "command" field) can launch it directly.
const entry = join(DIST, "server.js")
if (existsSync(entry)) {
  let src = readFileSync(entry, "utf8")
  if (!src.startsWith("#!")) {
    writeFileSync(entry, `#!/usr/bin/env node\n${src}`)
    console.log("[mcp] added shebang to server.js")
  }
  chmodSync(entry, 0o755)
}

console.log("[mcp] done.")
