# Playbook — Tokens

Step-by-step procedure for adding, changing, or removing a design token. Every step has an **expected output** and a **failure recovery path**.

If you're new to the system, **read this entire file** before touching `styles/globals.css`.

---

## 0 · Decide which kind of change this is

There are four kinds. Pick one before you start.

| Kind | Example | Where you edit | Affects |
|---|---|---|---|
| **A.** Add a new primitive | New `--ux-color-purple-25` between 50 and existing 50 | `:root` in globals.css | Layer 1; downstream auto |
| **B.** Add a new semantic | New `--ux-color-bg-elevated-strong` | Both `:root` and `.dark` in globals.css | Layer 2 |
| **C.** Modify an existing token | Change `--ux-color-purple-600` from `#9333ea` to `#8b5cf6` | `:root` (and `.dark` if applicable) | EVERYTHING that references purple-600 |
| **D.** Remove a token | Drop `--ux-color-opacity-5` | `:root` and `.dark` | Anything referencing it (must be removed first) |

**Kind C is the most dangerous.** A brand-color change cascades into hundreds of UI surfaces. Always announce the change up front and check the result in light AND dark mode.

**Kind D is the second most dangerous.** Run the token-resolves guard *before* removing to confirm nothing references it.

---

## 1 · Pre-flight check (always do this first)

```bash
# Where am I?
cd /Users/yahya/ux-design-system
pwd

# Is the build green right now?
( cd packages/tokens && node scripts/build.mjs ) 2>&1 | tail -3
# Expected last line: [tokens] done.

# Is the guard green right now?
node scripts/check-tokens.mjs 2>/dev/null || \
node -e '
const fs=require("node:fs"),{execSync:e}=require("node:child_process")
const css=fs.readFileSync("styles/globals.css","utf8")
const def=new Set([...css.matchAll(/^\s*(--ux-[A-Za-z0-9_.\\-]+):/gm)].map(m=>m[1].replace(/\\\./g,".")))
const grep=e("grep -rohE \"var.--ux-[A-Za-z0-9_.\\-]+\" packages styles tailwind.config.ts 2>/dev/null || true").toString()
const ref=new Set([...grep.matchAll(/(--ux-[A-Za-z0-9_.-]+)/g)].map(m=>m[1]))
const miss=[...ref].filter(v=>!def.has(v))
console.log("defined:",def.size," ref:",ref.size," missing:",miss.length)
miss.forEach(v=>console.log("  -",v))
'
# Expected: "missing: 0"
```

**If either fails BEFORE your change**: the trunk is dirty. Don't add to the mess. Find the root cause first (or escalate to the user).

---

## 2 · Confirm the current state via MCP

Never assume. Always call.

```bash
# In your MCP client (Claude Desktop / Cursor / etc.):
get_token({ name: "<the-thing-you-want-to-change>" })
# OR
list_tokens({ category: "color.bg" })   # to see neighbours
```

Note the current value. You'll need it for the CHANGELOG.

---

## 3 · Kind A — Add a new primitive

### 3.1 Edit globals.css

Find the appropriate primitive section (in `:root`, the section labelled **LAYER 1: PRIMITIVE TOKENS**). Add your new variable in scale order.

```css
/* example: adding an in-between purple */
--ux-color-purple-25:  #fdfaff;
--ux-color-purple-50:  #faf5ff;
...
```

### 3.2 If it's a semantic primitive (status pair, accent shade), also add the `.dark` override

Even if the value is the same in both modes, declare it in `.dark` so the dark block stays an exhaustive override of `:root` (this is what the parity validator looks for).

### 3.3 Validate

```bash
# Token-resolves guard
node -e '<the one-liner from §1>'
# Expected: missing: 0

# Token rebuild
( cd packages/tokens && node scripts/build.mjs ) 2>&1 | tail -3
# Expected: [tokens] done.

# The new var appears in the built CSS
grep "purple-25" packages/tokens/dist/css/variables.css
# Expected: --ux-color-purple-25: #fdfaff;
```

### 3.4 Regenerate the reference

```bash
node scripts/generate-tokens-reference.mjs
# Expected: "Wrote .../docs/tokens/reference.md ... Variables in :root: <new total>"
```

Open `docs/tokens/reference.md` and confirm the new variable is in the appropriate table.

### 3.5 CHANGELOG

In the `## [Unreleased]` section, under `### Tokens`:

```markdown
- Added --ux-color-purple-25 (#fdfaff) for very-subtle purple tinted surfaces.
```

### 3.6 Verify via MCP

```text
get_token({ name: "purple-25" })
# Expected: { name: "--ux-color-purple-25", light: "#fdfaff", category: "color.purple", scale: "purple", step: "25" }
```

If the MCP response doesn't match what you wrote: stop, the data loader regex isn't matching your variable. Check spelling, check that you didn't put it inside a `@layer` you didn't intend, check that it isn't commented out.

---

## 4 · Kind B — Add a new semantic alias

### 4.1 Decide the light and dark values

Semantic aliases ALWAYS bind to a primitive — never raw hex. Pick from the existing palette.

```css
/* example: new emphasised-card surface */
--ux-color-card-emphasis: var(--ux-color-neutral-50);
```

### 4.2 Add to BOTH `:root` AND `.dark`

This is the most common Hermes failure mode. The Hermes-original shipped multiple "semantic" tokens that only existed in `.dark`, breaking light mode. Always:

```css
/* in :root */
--ux-color-card-emphasis: var(--ux-color-neutral-50);

/* in .dark */
--ux-color-card-emphasis: var(--ux-color-neutral-800);
```

### 4.3 If this is a Tailwind-consumable token, also update `tailwind.config.ts`

The Tailwind theme reads selected semantic tokens and exposes them as theme keys. If your new token should be usable as e.g. `bg-card-emphasis`, add to `tailwind.config.ts`:

```ts
colors: {
  ...,
  "card-emphasis": "var(--ux-color-card-emphasis)",
}
```

Otherwise the token exists but isn't reachable from a component className.

### 4.4 Validate (same as §3.3)

Plus this extra check:

```bash
# Confirm dark mode actually flips the new var
node -e '
const { spawn } = require("child_process")
const c = spawn("node", ["packages/mcp/dist/server.js"], { stdio: ["pipe", "pipe", "inherit"] })
c.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call",
  params: { name: "get_semantic_color", arguments: { role: "card-emphasis", mode: "dark" } } }) + "\n")
c.stdout.on("data", d => { console.log(d.toString()); c.kill() })
setTimeout(() => c.kill(), 3000)
'
# Expected: darkValue is your dark-mode value, not "(inherits light)".
```

### 4.5 CHANGELOG, regenerate reference, done (same as §3.4–3.6).

---

## 5 · Kind C — Modify an existing token

### 5.1 Announce the change first

If this is a brand color, a focus ring, or any token used by many components, tell the user **before** you change it:

> "I'm about to change `--ux-color-purple-600` from `#9333ea` to `#8b5cf6`. This will visibly shift every primary button, every active focus ring in light mode, every link, and every secondary surface in dark mode. Confirm?"

### 5.2 Make the change

```css
/* before */
--ux-color-purple-600: #9333ea;
/* after */
--ux-color-purple-600: #8b5cf6;
```

### 5.3 Validate AND visually inspect

```bash
# guards run
( cd packages/tokens && node scripts/build.mjs ) 2>&1 | tail -3
( cd packages/react && node scripts/build.mjs ) 2>&1 | tail -3
# token-resolves guard (still 0 missing)

# render check — boot a preview, or
node --input-type=module -e '
import { renderToString } from "react-dom/server"
import * as React from "react"
import { Button } from "./packages/react/dist/index.js"
console.log(renderToString(React.createElement(Button, {}, "Button")))
' | grep -o "bg-primary"
# Expected: "bg-primary" — the class binding is still correct; the actual color comes from the var.
```

### 5.4 CHANGELOG must spell out the visual impact

```markdown
### Tokens
- **Brand color changed**: --ux-color-purple-600 from #9333ea → #8b5cf6.
  Visible everywhere `bg-primary`, `text-primary`, `text-link`, secondary-foreground render.
  Dark mode unaffected (purple-600 is the same in both modes).
```

---

## 6 · Kind D — Remove a token

### 6.1 Run the token-resolves guard backwards

You need to know what references the token before you remove it.

```bash
# What references --ux-color-opacity-5 ?
grep -rn "ux-color-opacity-5" packages styles tailwind.config.ts docs --include="*.css" --include="*.ts" --include="*.tsx" --include="*.md" 2>/dev/null
```

If anything is listed: **migrate those callers first.** Removing the token before its callers leaves the build green but with unresolved `var()` references — they'll silently fall back to no-color.

### 6.2 Remove from BOTH `:root` AND `.dark`

If you remove from `:root` but leave a `.dark` override, the dark block now overrides a non-existent var — confusing, harmless, but messy.

### 6.3 Validate, regenerate reference, CHANGELOG (same as §3.3–3.6)

The CHANGELOG entry should explain why:

```markdown
### Tokens
- Removed --ux-color-opacity-5 through --ux-color-opacity-40. Black-on-* overlays at low opacity are
  better expressed via `bg-foreground/[5..40]` Tailwind opacity modifiers; the named tokens were
  rarely used and confusing. Migration: replace `var(--ux-color-opacity-20)` with
  `rgb(var(--ux-color-foreground-channel) / 0.2)` or `bg-foreground/20`.
```

---

## 7 · Special cases

### 7.1 Channel-form tokens (rgb triplets)

If you want `bg-primary/50` (50% opacity) to work, the underlying color must be stored as `R G B` triplets, not hex:

```css
/* hex form — opacity modifiers DON'T compose */
--ux-color-purple-600: #9333ea;
/* channel form — opacity modifiers DO compose */
--ux-color-purple-600: 147 51 234;
/* Tailwind config uses rgb(var(--ux-color-purple-600) / <alpha-value>) */
```

Switching the entire palette to channel form is a deliberate migration tracked in the Multi-Agent Fix Plan §4.2. Don't do it ad-hoc. If you need an opacity-mod-capable token, ask first.

### 7.2 Spacing scale

Spacing follows Tailwind's convention: `--ux-spacing-N` where N is the index (1, 2, 2.5, 3, …). When you add an in-between like `--ux-spacing-2.5`, you must escape the dot in CSS:

```css
--ux-spacing-2\.5: 0.625rem;
```

The parser will normalise `2\.5` → `2.5` automatically. Don't try to fix this by hand.

### 7.3 Dark-mode flatlines (intentional same-in-both-modes)

Some semantic tokens deliberately have the same value in light and dark:

- `--ux-color-bg-ghost` (transparent — always)
- `--ux-color-text-on-primary` (white text on the purple-600 brand — always)
- `--ux-color-text-on-accent` (black text on the pink accent — always)
- `--ux-color-border-destructive` (destructive red — always)

These pass the parity check by intent. If you add a similar token, make sure your CHANGELOG note explains why it doesn't flip.

---

## 8 · Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Token guard reports your new var as missing | Typo or wrong section | Re-grep the var, find the typo |
| Reference doc doesn't list the new var | Generator ran before you saved | Save, re-run `node scripts/generate-tokens-reference.mjs` |
| Dark mode doesn't flip the new color | Added to `:root` only, missed `.dark` | Add to `.dark` too |
| `bg-newtoken` Tailwind class doesn't render | Forgot the `tailwind.config.ts` entry | Add the theme.extend.colors mapping |
| MCP returns `(inherits light)` for dark mode | `.dark` value matches `:root` value | Either intentional (see 7.3) or you typed the same value twice |

---

## 9 · Definition of done for a token change

- [ ] `globals.css` edited (both `:root` and `.dark` where applicable)
- [ ] Token-resolves guard reports `missing: 0`
- [ ] Tokens package builds (`[tokens] done.`)
- [ ] `docs/tokens/reference.md` regenerated and shows your change
- [ ] `tailwind.config.ts` updated if the token is Tailwind-exposable
- [ ] `CHANGELOG.md` updated under `## [Unreleased]` → `### Tokens`
- [ ] MCP `get_token` (or `get_semantic_color`) returns your new value
- [ ] If brand-color change: visually verified at least one button rendered in both modes

Only when ALL boxes are checked: tell the user "done".

---

## 10 · Worked example — adding `--ux-color-bg-glass`

A semi-transparent glass surface. Let's add it.

```css
/* in :root */
--ux-color-bg-glass: rgba(255, 255, 255, 0.7);

/* in .dark */
--ux-color-bg-glass: rgba(9, 9, 11, 0.7);
```

Then `tailwind.config.ts`:

```ts
colors: {
  ...,
  glass: "var(--ux-color-bg-glass)",
}
```

Validate:

```bash
( cd packages/tokens && node scripts/build.mjs ) 2>&1 | tail -3
# [tokens] done.

node -e '... token-resolves guard ...'
# defined: 178  ref: 60  missing: 0

node scripts/generate-tokens-reference.mjs
# Wrote .../docs/tokens/reference.md ...

grep glass packages/tokens/dist/css/variables.css
# --ux-color-bg-glass: rgba(255, 255, 255, 0.7);
# --ux-color-bg-glass: rgba(9, 9, 11, 0.7);
```

CHANGELOG:

```markdown
### Tokens
- Added --ux-color-bg-glass — semi-transparent surface for overlay/glassmorphism
  treatments. Light: rgba(255,255,255,0.7). Dark: rgba(9,9,11,0.7). Tailwind exposed as `bg-glass`.
```

Verify via MCP:

```text
get_token({ name: "bg-glass" })
# { name: "--ux-color-bg-glass", light: "rgba(255, 255, 255, 0.7)", dark: "rgba(9, 9, 11, 0.7)", category: "color.bg" }
```

Done.
