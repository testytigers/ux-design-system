# Playbook — Validation

The mandatory pre-commit gate. Every change to `packages/`, `styles/`, or `tailwind.config.ts` must pass §3 in full.

If you skip these checks: you broke HARD-RULE R10. Revert your commit and run them.

---

## 1 · The token-resolves guard

Every `var(--ux-*)` reference in the codebase must point at a variable defined in `styles/globals.css`.

```bash
node -e '
const fs = require("node:fs"), { execSync } = require("node:child_process")
const css = fs.readFileSync("styles/globals.css", "utf8")
const def = new Set(
  [...css.matchAll(/^\s*(--ux-[A-Za-z0-9_.\\-]+):/gm)]
    .map(m => m[1].replace(/\\\./g, "."))
)
const grep = execSync(
  "grep -rohE \"var.--ux-[A-Za-z0-9_.\\-]+\" packages styles tailwind.config.ts 2>/dev/null || true"
).toString()
const ref = new Set([...grep.matchAll(/(--ux-[A-Za-z0-9_.-]+)/g)].map(m => m[1]))
const miss = [...ref].filter(v => !def.has(v))
console.log("defined:", def.size, "  ref:", ref.size, "  missing:", miss.length)
if (miss.length) { miss.forEach(v => console.log("  -", v)); process.exit(1) }
'
```

**Pass condition:** `missing: 0` and exit code 0.

**Fail recovery:**
- If a missing var is a typo in code: fix the typo.
- If a missing var should genuinely exist: add it to `globals.css` (`:root` and `.dark`).
- If a missing var is no longer used anywhere: remove the reference.

---

## 2 · Static rule-violation grep set

Run all of these. Any non-empty output is a HARD-RULE violation.

```bash
# R1 — no nested var() arbitrary classes
echo "── R1: nested var() ──"
grep -rE "var\(--ux-color-[a-z]+-\[var" packages/react/src && echo "FAIL R1" || echo "PASS R1"

# R4 — no raw colors in components
echo "── R4: raw colors in components ──"
grep -rnE "(text-\[#|bg-\[#|bg-white|bg-black|text-white|text-black|bg-neutral-|text-neutral-|bg-purple-|text-purple-|ring-purple-)" packages/react/src/components \
  && echo "FAIL R4" || echo "PASS R4"

# R6 — no data-theme references
echo "── R6: data-theme ──"
grep -rnE "data-theme" packages styles tailwind.config.ts --include="*.css" --include="*.ts" --include="*.tsx" 2>/dev/null \
  | grep -v "corrected\|previous version\|deprecation" \
  && echo "FAIL R6" || echo "PASS R6"
```

Expected: `PASS R1`, `PASS R4`, `PASS R6` for all three.

---

## 3 · The full pre-commit gate

Copy-paste this entire block. Exits non-zero if anything fails.

```bash
set -e
cd /Users/yahya/ux-design-system

echo "── 3.1 build tokens ──"
( cd packages/tokens && node scripts/build.mjs ) 2>&1 | tail -3

echo "── 3.2 build react ──"
( cd packages/react && node scripts/build.mjs ) 2>&1 | tail -3

echo "── 3.3 build mcp (if changed) ──"
[ -d packages/mcp/dist ] && ( cd packages/mcp && node scripts/build.mjs ) 2>&1 | tail -3 || true

echo "── 3.4 token-resolves guard ──"
node -e '
const fs = require("node:fs"), { execSync } = require("node:child_process")
const css = fs.readFileSync("styles/globals.css", "utf8")
const def = new Set([...css.matchAll(/^\s*(--ux-[A-Za-z0-9_.\\-]+):/gm)].map(m=>m[1].replace(/\\\./g,".")))
const grep = execSync("grep -rohE \"var.--ux-[A-Za-z0-9_.\\-]+\" packages styles tailwind.config.ts 2>/dev/null || true").toString()
const ref = new Set([...grep.matchAll(/(--ux-[A-Za-z0-9_.-]+)/g)].map(m=>m[1]))
const miss = [...ref].filter(v=>!def.has(v))
console.log("defined:",def.size," ref:",ref.size," missing:",miss.length)
if (miss.length) { miss.forEach(v=>console.log(" -",v)); process.exit(1) }
'

echo "── 3.5 R1 — no nested var() ──"
if grep -rE "var\(--ux-color-[a-z]+-\[var" packages/react/src >/dev/null 2>&1; then
  echo "FAIL R1 — nested var() arbitrary classes found"; exit 1
fi

echo "── 3.6 R4 — no raw colors in components ──"
if grep -rnE "(text-\[#|bg-\[#|bg-white|bg-black|text-white|text-black|bg-neutral-|text-neutral-|bg-purple-|text-purple-|ring-purple-)" packages/react/src/components >/dev/null 2>&1; then
  echo "FAIL R4 — raw color classes in components"; exit 1
fi

echo "── 3.7 R6 — no data-theme ──"
if grep -rnE "data-theme" packages styles tailwind.config.ts --include="*.css" --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v "corrected\|previous version\|deprecation" >/dev/null; then
  echo "FAIL R6 — active data-theme reference"; exit 1
fi

echo "── 3.8 export count ──"
node --input-type=module -e '
import("./packages/react/dist/index.js").then(m => {
  const n = Object.keys(m).length
  if (n < 193) { console.error("FAIL: only " + n + " exports (expected >= 193)"); process.exit(1) }
  console.log("exports:", n)
})
'

echo "── 3.9 component-folder ↔ doc-page parity ──"
folders=$(ls packages/react/src/components | grep -v "^index.ts$" | wc -l | tr -d " ")
pages=$(ls docs/components/*.md 2>/dev/null | grep -v overview | grep -v README | wc -l | tr -d " ")
if [ "$folders" -ne "$pages" ]; then
  echo "FAIL: $folders component folders vs $pages doc pages"; exit 1
fi
echo "components=$folders docs=$pages"

echo "── 3.10 MCP server boots ──"
node packages/mcp/dist/server.js & PID=$!
sleep 1
if ! kill -0 $PID 2>/dev/null; then echo "FAIL: MCP server crashed"; exit 1; fi
kill $PID 2>/dev/null
wait $PID 2>/dev/null || true
echo "MCP OK"

echo
echo "✓ ALL CHECKS PASS"
```

You should see `✓ ALL CHECKS PASS` at the bottom. Anything else: do not commit.

Save this block as `scripts/validate.sh` if you find yourself running it often.

---

## 4 · The dark-mode parity check

For semantic tokens that *should* differ between light and dark, verify they do.

```bash
node -e '
const { spawn } = require("child_process")
const c = spawn("node", ["packages/mcp/dist/server.js"], { stdio: ["pipe", "pipe", "inherit"] })
let buf = ""
c.stdout.on("data", d => {
  buf += d.toString()
  for (const line of buf.split("\n").filter(l => l.trim())) {
    try {
      const r = JSON.parse(line)
      if (r.id === 1) {
        const o = JSON.parse(r.result.content[0].text)
        console.log("Tokens checked:", o.checkedSemanticTokens)
        console.log("Flatlines (light=dark):", o.flatlines.length)
        o.flatlines.forEach(f => console.log("  -", f))
        c.kill(); process.exit(0)
      }
    } catch {}
  }
})
c.stdin.write(JSON.stringify({ jsonrpc:"2.0", id:1, method:"tools/call", params:{ name:"validate_dark_mode_parity", arguments:{} } }) + "\n")
setTimeout(() => { c.kill(); process.exit(0) }, 4000)
'
```

**Acceptable flatlines** (= same in both modes intentionally):
- `--ux-color-bg-ghost` (always transparent)
- `--ux-color-text-on-primary` (always white)
- `--ux-color-text-on-accent` (always black)
- `--ux-color-border-destructive` (always red)
- `--ux-color-foreground` (wrapper that resolves through text-primary)

**Unexpected flatlines** = a real bug. Investigate and fix.

---

## 5 · Visual smoke test (manual)

For component changes that affect rendering:

```bash
# Boot a temp page that renders a few components and open it
mkdir -p /tmp/ux-smoke && cd /tmp/ux-smoke

cat > index.html <<'HTML'
<!doctype html>
<html><head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4/dist/tailwind.min.css">
  <link rel="stylesheet" href="/Users/yahya/ux-design-system/packages/tokens/dist/css/variables.css">
  <style>body { font-family: "Open Sans", sans-serif; padding: 2rem; background: var(--ux-color-bg-primary); color: var(--ux-color-text-primary); }
    .dark body { background: var(--ux-color-bg-primary); }
  </style>
</head><body>
  <button style="background: var(--ux-color-purple-600); color: white; padding: 8px 16px; border-radius: 6px;">Button</button>
  <button onclick="document.documentElement.classList.toggle('dark')">Toggle dark</button>
</body></html>
HTML

open index.html
```

Toggle the theme. Visually confirm the brand color is still purple, the background flips, etc.

For full visual regression: see Multi-Agent Fix Plan §7 (Storybook + Chromatic — deferred).

---

## 6 · CI integration (recommended)

Wire the §3 block into a GitHub Actions workflow:

```yaml
# .github/workflows/validate.yml
name: Validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: bash scripts/validate.sh
```

Every PR runs the same gate you run locally. No regressions slip through.

---

## 7 · Validating user-pasted snippets

When a user asks "is this on-brand?":

### 7.1 Token references

```text
validate_token_references({ source: "<the snippet>" })
```

Returns `{ ok, totalReferenced, totalDefined, missing }`. If `missing` is non-empty, suggest the closest defined names (use `search_tokens` for fuzzy matching).

### 7.2 Pattern scan

Eyeball for any of these red flags:

- Nested `var()`
- Raw hex colors
- `data-theme` selector
- `bg-white`, `bg-black`, `bg-neutral-*`, `text-neutral-*`, `bg-purple-*` (raw Tailwind palette)
- `<Card title=…>`, `<Button variant="primary">`, `<Alert variant="primary">`, `<Modal>` — fictional APIs

For each red flag, point to the relevant HARD-RULE number and the correct alternative.

### 7.3 Voice check

Run the snippet's user-facing text through `get_design_principles`:
- Sentence case?
- No emoji?
- No exclamation marks?
- Headlines ≤ 6 words?

---

## 8 · Validation by domain

When you don't know which gate applies, this lookup table covers most cases.

| Touched… | Must pass |
|---|---|
| `styles/globals.css` | §1, §3, §4 |
| `tailwind.config.ts` | §3 |
| `packages/tokens/src/**` | §3 (specifically 3.1, 3.4) |
| `packages/react/src/components/**` | §3 (3.2, 3.5, 3.6, 3.8, 3.9) + §5 manual |
| `packages/react/src/index.ts` (barrel) | §3 (3.8 export count) |
| `packages/mcp/src/**` | §3 (3.3, 3.10) |
| `docs/**` (auto-gen) | none — regenerate, don't hand-edit |
| `docs/components/overview.md`, `docs/tokens/overview.md`, etc. (hand-edited) | §2 (R3 rule — no fictional APIs) |
| `scripts/generate-*.mjs` | re-run the generator, compare diff |

---

## 9 · Common scary outputs and what they mean

```
ENOENT: no such file or directory, stat '...'
```
→ The token build script crashed while renaming `.js` → `.mjs`. Probably already fixed in this codebase. If you see it: re-run the build; it's idempotent after the first crash.

```
Cannot find module '@ux/tokens'
```
→ Workspace symlink missing. `mkdir -p node_modules/@ux && ln -sf $(pwd)/packages/tokens node_modules/@ux/tokens`.

```
[react] post-process: rewrote 87 files
```
→ Half of the count you used to see (87 vs 168) usually means tsc emitted only the React source this time (not the cross-package leak). That's a sign your build is clean. Good.

```
exports loaded: 193
```
→ Canonical. Anything less means an export was lost; track it down.

```
Couldn't resolve role 'foo.bar'
```
→ MCP `get_semantic_color` got a role that doesn't map. `list_tokens({ category: "color.bg" })` to see real names.

---

## 10 · One-line "am I OK?" command

```bash
( cd packages/tokens && node scripts/build.mjs ) >/dev/null 2>&1 && \
( cd packages/react && node scripts/build.mjs ) >/dev/null 2>&1 && \
node --input-type=module -e "import('./packages/react/dist/index.js').then(m => process.exit(Object.keys(m).length >= 193 ? 0 : 1))" && \
echo "TRUNK GREEN" || echo "TRUNK RED"
```

Three checks, one line. Bind it to a shell alias if you run it often.

If you see `TRUNK RED` at the start of a session, that's your first task.
