/**
 * Data loader — reads the design system at startup from:
 *   - styles/globals.css           (token primitives, semantic aliases, .dark overrides)
 *   - packages/react/src/components/<Name>/<Name>.tsx
 *                                  (component variants, source code)
 *   - packages/react/src/index.ts  (the barrel — which exports are public)
 *
 * The repo root is auto-discovered: walk up from the running file until we
 * see styles/globals.css. Override via UX_DS_ROOT env var.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

// ─── Locate the repo root ────────────────────────────────────────────────────
function findRoot(): string {
  if (process.env.UX_DS_ROOT) return resolve(process.env.UX_DS_ROOT)

  // Next.js (and other bundlers) may produce non-file:// import.meta.url values
  // (e.g. webpack://...). Use process.cwd() as the primary fallback so the MCP
  // works when run inside a Next.js App Router API route.
  if (existsSync(join(process.cwd(), "styles", "globals.css"))) {
    return process.cwd()
  }

  // Walk up from the compiled file — works for the standalone stdio server and
  // for globally-installed npx usage.
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    let cur = here
    for (let i = 0; i < 12; i++) {
      if (existsSync(join(cur, "styles", "globals.css"))) return cur
      const parent = dirname(cur)
      if (parent === cur) break
      cur = parent
    }
  } catch {
    // fileURLToPath throws when import.meta.url is not a file:// URL (bundlers).
    // We already tried process.cwd() above; fall through to the error below.
  }

  throw new Error(
    "Could not locate the UX Design System repo (expected styles/globals.css). " +
    "Set UX_DS_ROOT=/path/to/ux-design-system in your environment."
  )
}

export const REPO_ROOT = findRoot()
const GLOBALS_CSS = join(REPO_ROOT, "styles", "globals.css")

// UX_DS_COMPONENTS_DIR lets you point the MCP at a flat component directory
// (e.g. packages/brand-ds/src/components) instead of the default nested path.
// Useful when your design system lives in a single package rather than the
// packages/react sub-package layout.
const COMPONENTS_DIR = process.env.UX_DS_COMPONENTS_DIR
  ? resolve(process.env.UX_DS_COMPONENTS_DIR)
  : join(REPO_ROOT, "packages", "react", "src", "components")

const REACT_BARREL = join(REPO_ROOT, "packages", "react", "src", "index.ts")

// ─── Token prefix ─────────────────────────────────────────────────────────────
// Set UX_DS_TOKEN_PREFIX to match your globals.css variable namespace.
// Must end with "-".  Examples:  "--ux-"  (default)   "--ds-"  (brand-ds)
export const TOKEN_PREFIX = (() => {
  const raw = process.env.UX_DS_TOKEN_PREFIX ?? "--ux-"
  return raw.endsWith("-") ? raw : raw + "-"
})()
// Escaped prefix ready for use in new RegExp(…)
const P = TOKEN_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// ─── Token model ─────────────────────────────────────────────────────────────
export interface Token {
  name: string                       // e.g. "--ux-color-purple-600"
  light: string                      // resolved/raw value in :root
  dark?: string                      // value in .dark, if overridden
  category: TokenCategory
  scale?: string                     // e.g. "purple" within "color"
  step?: string                      // e.g. "600" within "purple"
}

// Open string type — palette names are dynamic (e.g. "color.violet" for brand-ds,
// "color.purple" for the original UX system, "color.blue" for your own fork, etc.)
export type TokenCategory = string

function categorize(name: string): TokenCategory {
  // Strip the prefix so all patterns below are prefix-agnostic.
  // e.g.  "--ux-color-purple-600"  →  "color-purple-600"
  //       "--ds-color-violet-500"  →  "color-violet-500"
  const n = name.startsWith(TOKEN_PREFIX) ? name.slice(TOKEN_PREFIX.length) : name

  // Status-semantic must be checked before plain status (more specific pattern first)
  if (/^color-status-(success|warning|error|info)-(bg|fg)$/.test(n)) return "color.status-semantic"
  if (/^color-status-(success|warning|error|info)(-light)?$/.test(n)) return "color.status"
  if (/^color-opacity-/.test(n))  return "color.opacity"
  if (/^color-bg-/.test(n))       return "color.bg"
  if (/^color-text-/.test(n))     return "color.text"
  if (/^color-border-/.test(n))   return "color.border"
  // Shadcn-compat semantic surface tokens
  if (/^color-(muted|popover|card|input|ring|foreground)(-foreground)?$/.test(n)) return "color.shadcn"
  // Brand semantic tokens
  if (/^color-(primary|secondary|destructive)(-foreground)?$/.test(n)) return "color.brand"
  // Primitive palette scales: color-{name}-{step}  (handles any palette: purple, violet, blue…)
  const palette = n.match(/^color-([a-z]+)-\d+$/)
  if (palette) return `color.${palette[1]}`
  // Catch-all for any remaining color-* (e.g. color-accent-primary)
  if (/^color-/.test(n))          return "color.accent"
  if (/^spacing-/.test(n))        return "spacing"
  if (/^radius-/.test(n))         return "radius"
  if (/^shadow-/.test(n))         return "shadow"
  if (/^z-index-/.test(n))        return "z-index"
  if (/^transition-/.test(n))     return "transition"
  if (/^font-family-/.test(n))    return "font.family"
  if (/^font-size-/.test(n))      return "font.size"
  if (/^font-weight-/.test(n))    return "font.weight"
  if (/^line-height-/.test(n))    return "line-height"
  if (/^letter-spacing-/.test(n)) return "letter-spacing"
  return "component"
}

// ─── Parse globals.css ───────────────────────────────────────────────────────
/**
 * Find a CSS block by selector (e.g. ":root" or ".dark") and return its body,
 * walking braces to handle nested rules and comments correctly. Skips matches
 * inside /* … *\/ comments and string literals.
 */
function extractBlock(css: string, selector: string): Record<string, string> {
  // Strip comments first so they don't shadow real selectors.
  const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, "")
  // Find an at-start-of-line (or after whitespace/{) selector followed by `{`.
  const sigil = new RegExp(`(^|[\\s\\}])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{`, "m")
  const m = cleaned.match(sigil)
  if (!m) return {}
  const start = m.index! + m[0].length
  let depth = 1, i = start
  while (i < cleaned.length && depth > 0) {
    const ch = cleaned[i]
    if (ch === "{") depth++
    else if (ch === "}") depth--
    if (depth === 0) break
    i++
  }
  const body = cleaned.slice(start, i)
  const out: Record<string, string> = {}
  // Match only variables that start with TOKEN_PREFIX so we skip framework-level
  // vars like --tw-* or --radix-* that may also appear in the file.
  const tokenVarRe = new RegExp(`(?:^|\\s)(${P}[A-Za-z0-9_.\\\-]+)\\s*:\\s*([^;]+);`, "gm")
  for (const v of body.matchAll(tokenVarRe)) {
    out[v[1].replace(/\\\./g, ".")] = v[2].trim()
  }
  return out
}

let tokensCache: Token[] | null = null
export function loadTokens(): Token[] {
  if (tokensCache) return tokensCache
  const css = readFileSync(GLOBALS_CSS, "utf8")
  const root = extractBlock(css, ":root")
  const dark = extractBlock(css, ".dark")
  const tokens: Token[] = Object.entries(root).map(([name, light]) => {
    const t: Token = { name, light, category: categorize(name) }
    if (dark[name] && dark[name] !== light) t.dark = dark[name]
    // Extract palette name + step for primitive color tokens (e.g. violet-500, purple-600)
    const m = name.match(new RegExp(`^${P}color-([\\w]+)-(\\d+)$`))
    if (m) { t.scale = m[1]; t.step = m[2] }
    return t
  })
  return (tokensCache = tokens)
}

// ─── Component model ─────────────────────────────────────────────────────────
export interface ComponentInfo {
  name: string                         // PascalCase, matches directory
  slug: string                         // lowercase / kebab for doc links
  category: ComponentCategory
  description: string
  exports: string[]                    // every named export from the file
  variants: Record<string, string[]>   // CVA `variants: { foo: { … }, … }`
  defaults: Record<string, string>     // CVA `defaultVariants: { foo: "bar" }`
  hasAsChild: boolean
  hasInsetProp: boolean
  hasSideProp: boolean                 // e.g. Sheet
  hasOrientationProp: boolean          // e.g. Carousel
  sourcePath: string                   // relative path
  source: string                       // the .tsx source
}

export type ComponentCategory =
  | "input" | "display" | "overlay" | "navigation" | "data" | "layout" | "feedback"

const CATEGORY: Record<string, ComponentCategory> = {
  Button: "input", Input: "input", Textarea: "input", Label: "input",
  Checkbox: "input", RadioGroup: "input", Select: "input", Switch: "input",
  Slider: "input", InputOtp: "input", Form: "input", Toggle: "input",

  Card: "display", Badge: "display", Alert: "feedback", Avatar: "display",
  Skeleton: "feedback", Separator: "display", AspectRatio: "display",
  Progress: "feedback",

  Dialog: "overlay", Sheet: "overlay", Popover: "overlay", HoverCard: "overlay",
  Tooltip: "overlay", DropdownMenu: "overlay", ContextMenu: "overlay",
  Toast: "feedback",

  Tabs: "navigation", Accordion: "navigation", NavigationMenu: "navigation",
  Menubar: "navigation", Pagination: "navigation",

  Table: "data", Calendar: "data", Charts: "data", Carousel: "data", Command: "data",
  Resizable: "layout", ScrollArea: "layout",
}

const DESCRIPTION: Record<string, string> = {
  Accordion:      "One-or-many expandable sections (Radix Accordion).",
  Alert:          "Inline informational/success/warning/error/info message.",
  AspectRatio:    "Lock content to a fixed aspect ratio.",
  Avatar:         "User avatar with image and graceful fallback.",
  Badge:          "Compact label for status, tag, and counts.",
  Button:         "The primary interactive element. 6 variants × 4 sizes × asChild.",
  Calendar:       "Date picker (react-day-picker v9).",
  Card:           "Compound surface for grouped content.",
  Carousel:       "Horizontal/vertical carousel (embla).",
  Charts:         "Recharts wrappers with token-styled tooltip + legend.",
  Checkbox:       "Two-state checkbox (Radix Checkbox).",
  Command:        "⌘K-style command palette (cmdk).",
  ContextMenu:    "Right-click menu.",
  Dialog:         "Modal dialog (Radix Dialog).",
  DropdownMenu:   "Click-triggered menu (Radix DropdownMenu).",
  Form:           "react-hook-form integration: Form/FormField/FormControl/FormMessage/useFormField.",
  HoverCard:      "Hover-triggered floating panel.",
  Input:          "Single-line text input.",
  InputOtp:       "OTP / 2FA input (input-otp).",
  Label:          "Form label (Radix Label).",
  Menubar:        "Application menu bar.",
  NavigationMenu: "Mega-menu navigation.",
  Pagination:     "Pagination primitives.",
  Popover:        "Click-triggered floating panel.",
  Progress:       "Determinate progress bar.",
  RadioGroup:     "Radio button group (Radix RadioGroup).",
  Resizable:      "Resizable split panels (react-resizable-panels).",
  ScrollArea:     "Custom scrollbars (Radix ScrollArea).",
  Select:         "Dropdown select (Radix Select).",
  Separator:      "Horizontal or vertical divider.",
  Sheet:          "Side-drawer dialog with `side` prop.",
  Skeleton:       "Shimmer loading placeholder.",
  Slider:         "Range slider (Radix Slider).",
  Switch:         "Two-state toggle (Radix Switch).",
  Table:          "Semantic HTML table primitives.",
  Tabs:           "Tabbed navigation (Radix Tabs).",
  Textarea:       "Multi-line text input.",
  Toast:          "Notifications (Radix Toast).",
  Toggle:         "Single binary button (Radix Toggle).",
  Tooltip:        "Hover/focus tooltip.",
}

// CVA `variants: { … }` block parser. Returns shape { variantName: [values] }.
function parseVariants(src: string): { variants: Record<string, string[]>, defaults: Record<string, string> } {
  const variants: Record<string, string[]> = {}
  const defaults: Record<string, string> = {}
  const cvaIdx = src.indexOf("cva(")
  if (cvaIdx < 0) return { variants, defaults }
  const varHead = src.slice(cvaIdx).match(/variants\s*:\s*\{/)
  if (varHead) {
    const start = cvaIdx + varHead.index! + varHead[0].length
    let depth = 1, i = start
    while (i < src.length && depth > 0) {
      if (src[i] === "{") depth++
      else if (src[i] === "}") depth--
      if (depth === 0) break
      i++
    }
    const block = src.slice(start, i)
    let j = 0
    while (j < block.length) {
      const head = block.slice(j).match(/(\w+)\s*:\s*\{/)
      if (!head) break
      const groupName = head[1]
      const gStart = j + head.index! + head[0].length
      let gd = 1, k = gStart
      while (k < block.length && gd > 0) {
        if (block[k] === "{") gd++
        else if (block[k] === "}") gd--
        if (gd === 0) break
        k++
      }
      const body = block.slice(gStart, k)
      const keys: string[] = []
      for (const m of body.matchAll(/^\s*(\w+)\s*:/gm)) keys.push(m[1])
      variants[groupName] = keys
      j = k + 1
    }
  }
  const defHead = src.slice(cvaIdx).match(/defaultVariants\s*:\s*\{([^}]*)\}/)
  if (defHead) {
    for (const m of defHead[1].matchAll(/(\w+)\s*:\s*["'](\w+)["']/g)) defaults[m[1]] = m[2]
  }
  return { variants, defaults }
}

function listExports(src: string): string[] {
  const out = new Set<string>()
  for (const m of src.matchAll(/^export\s+(?:const|function|class|interface|type)\s+(\w+)/gm)) out.add(m[1])
  for (const m of src.matchAll(/^export\s*\{([^}]+)\}/gm)) {
    for (const piece of m[1].split(",")) {
      const t = piece.trim().replace(/^type\s+/, "")
      if (!t) continue
      const [, alias] = t.split(/\s+as\s+/)
      const n = (alias || t).replace(/^type\s+/, "").trim()
      if (/^[A-Za-z_$][\w$]*$/.test(n)) out.add(n)
    }
  }
  return [...out].sort()
}

let componentsCache: ComponentInfo[] | null = null
export function loadComponents(): ComponentInfo[] {
  if (componentsCache) return componentsCache
  const dirs = readdirSync(COMPONENTS_DIR).filter(e => {
    const p = join(COMPONENTS_DIR, e)
    return statSync(p).isDirectory()
  })
  const out: ComponentInfo[] = []
  for (const name of dirs) {
    const tsxPath = join(COMPONENTS_DIR, name, `${name}.tsx`)
    if (!existsSync(tsxPath)) continue
    const source = readFileSync(tsxPath, "utf8")
    const { variants, defaults } = parseVariants(source)
    out.push({
      name,
      slug: slugOf(name),
      category: CATEGORY[name] || "display",
      description: DESCRIPTION[name] || `${name} component`,
      exports: listExports(source),
      variants,
      defaults,
      hasAsChild: /\basChild\b/.test(source),
      hasInsetProp: /\binset\?\s*:\s*boolean/.test(source) || /\{[^}]*inset\b/.test(source),
      hasSideProp: /\bside\?\s*:\s*"\w+"/.test(source),
      hasOrientationProp: /\borientation\b/.test(source),
      // Make sourcePath relative to REPO_ROOT when possible, otherwise keep absolute.
      sourcePath: (() => {
        const abs = join(COMPONENTS_DIR, name, `${name}.tsx`)
        return abs.startsWith(REPO_ROOT + "/")
          ? abs.slice(REPO_ROOT.length + 1)
          : abs
      })(),
      source,
    })
  }
  return (componentsCache = out.sort((a, b) => a.name.localeCompare(b.name)))
}

function slugOf(name: string): string {
  // PascalCase → kebab-case for matching the docs/components/*.md files
  const map: Record<string, string> = {
    AspectRatio: "aspect-ratio", ContextMenu: "context-menu",
    DropdownMenu: "dropdown-menu", HoverCard: "hover-card",
    InputOtp: "input-otp", NavigationMenu: "navigation-menu",
    RadioGroup: "radio-group", ScrollArea: "scroll-area",
  }
  return map[name] || name.toLowerCase()
}

// ─── Brand / design principles (constant — read from the canonical docs) ────
export function brandSummary() {
  return {
    name: "UX Design System",
    brandColor: { hex: "#9333ea", token: "purple-600" },
    fonts: {
      headings: "Roboto Mono",
      body: "Open Sans",
      code: "JetBrains Mono",
    },
    density: { base: "16px", lineHeight: 1.5, grid: "4px" },
    geometry: { defaultRadius: "0.5rem (8px)", pillRadius: "9999px" },
    darkMode: { mechanism: "class-based (`.dark` on <html>)", trigger: "Tailwind darkMode: ['class']" },
    palettes: ["purple (50–950)", "neutral (0–950)", "status (success/warning/error/info)", "accent (pink)"],
    voice: [
      "Sentence case for all UI copy",
      "No emoji, no exclamation marks",
      "Declarative; errors name the failure, not the user",
      "Headlines ≤ 6 words; button copy 1–2 words",
    ],
    hardRules: [
      "No raw hex colors in components — always var(--ux-*)",
      "No serif fonts (headings are Roboto Mono monospace)",
      "2px focus rings on every interactive element",
      "No gradient backgrounds in product chrome",
    ],
  } as const
}
