/**
 * Token-related MCP tools.
 */
import { loadTokens, type Token, type TokenCategory, TOKEN_PREFIX } from "../data.js"

// ── shared types ────────────────────────────────────────────────────────────
type ToolResult = { content: Array<{ type: "text", text: string }> }
const json = (v: unknown): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(v, null, 2) }] })

// ── list_token_categories ───────────────────────────────────────────────────
export const list_token_categories = {
  name: "list_token_categories",
  description: "List every token category present in the design system (color.purple, spacing, radius, shadow, font.*, etc.).",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const cats = new Set<string>()
    for (const t of loadTokens()) cats.add(t.category)
    return json({ categories: [...cats].sort(), totalTokens: loadTokens().length })
  },
}

// ── list_tokens ─────────────────────────────────────────────────────────────
export const list_tokens = {
  name: "list_tokens",
  description: "List every CSS variable in the system, optionally filtered by category. Returns name + light value + dark override (if any).",
  inputSchema: {
    type: "object" as const,
    properties: {
      category: { type: "string", description: "Optional category filter (e.g. 'color.purple', 'spacing'). Use list_token_categories to see options." },
    },
  },
  handler: async (args: { category?: string }): Promise<ToolResult> => {
    let tokens: Token[] = loadTokens()
    if (args.category) tokens = tokens.filter(t => t.category === args.category)
    return json({ count: tokens.length, tokens })
  },
}

// ── get_token ───────────────────────────────────────────────────────────────
export const get_token = {
  name: "get_token",
  description: "Get one CSS variable by name. The token prefix (e.g. '--ux-' or '--ds-') is optional — just pass 'color-violet-500' or '--ds-color-violet-500'.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Variable name; the prefix is optional." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const target = args.name.startsWith(TOKEN_PREFIX)
      ? args.name
      : `${TOKEN_PREFIX}${args.name.replace(/^-+/, "")}`
    const t = loadTokens().find(x => x.name === target)
    return t ? json(t) : json({ error: `No token named ${target}` })
  },
}

// ── get_color_palette ───────────────────────────────────────────────────────
export const get_color_palette = {
  name: "get_color_palette",
  description: "Return one color palette as an ordered object {step: hex}. Use list_token_categories to see available palette names (e.g. 'violet', 'purple', 'neutral').",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Palette name, e.g. 'violet' or 'purple'. Use list_token_categories to discover names." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const category: TokenCategory = `color.${args.name}` as TokenCategory
    const palette = loadTokens().filter(t => t.category === category)
    const result: Record<string, string> = {}
    for (const t of palette) {
      const step = t.step ?? t.name.replace(`${TOKEN_PREFIX}color-${args.name}-`, "")
      result[step] = t.light
    }
    return json({ palette: args.name, count: palette.length, swatches: result })
  },
}

// ── get_semantic_color ──────────────────────────────────────────────────────
export const get_semantic_color = {
  name: "get_semantic_color",
  description: "Resolve a semantic color role (e.g. 'bg.primary', 'text.muted', 'border.focus', 'muted', 'accent', 'popover', 'card', 'primary', 'destructive') in light or dark mode.",
  inputSchema: {
    type: "object" as const,
    properties: {
      role: { type: "string", description: "Dot-separated role, e.g. 'bg.primary' or 'text.muted'." },
      mode: { type: "string", enum: ["light", "dark"], description: "Defaults to 'light'." },
    },
    required: ["role"],
  },
  handler: async (args: { role: string, mode?: string }): Promise<ToolResult> => {
    const mode = args.mode ?? "light"
    const candidates = [
      `${TOKEN_PREFIX}color-${args.role.replace(/\./g, "-")}`,
      `${TOKEN_PREFIX}color-${args.role.split(".").pop()}`,
    ]
    const tokens = loadTokens()
    let t: Token | undefined
    for (const c of candidates) {
      t = tokens.find(x => x.name === c)
      if (t) break
    }
    if (!t) return json({ error: `Couldn't resolve role '${args.role}'.` })
    const value = mode === "dark" ? (t.dark ?? t.light) : t.light
    return json({ name: t.name, mode, value, lightValue: t.light, darkValue: t.dark ?? "(inherits light)" })
  },
}

// ── get_dark_mode_overrides ─────────────────────────────────────────────────
export const get_dark_mode_overrides = {
  name: "get_dark_mode_overrides",
  description: "List every CSS variable that has a distinct value in .dark vs :root.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const flips = loadTokens().filter(t => t.dark && t.dark !== t.light).map(t => ({
      name: t.name, light: t.light, dark: t.dark!,
    }))
    return json({ count: flips.length, overrides: flips })
  },
}

// ── get_typography_scale ────────────────────────────────────────────────────
export const get_typography_scale = {
  name: "get_typography_scale",
  description: "Return all typography tokens (families, sizes, weights, line-heights, letter-spacings).",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const tokens = loadTokens()
    const out = {
      families:        tokens.filter(t => t.category === "font.family").map(({ name, light }) => ({ name, value: light })),
      sizes:           tokens.filter(t => t.category === "font.size").map(({ name, light }) => ({ name, value: light })),
      weights:         tokens.filter(t => t.category === "font.weight").map(({ name, light }) => ({ name, value: light })),
      lineHeights:     tokens.filter(t => t.category === "line-height").map(({ name, light }) => ({ name, value: light })),
      letterSpacings:  tokens.filter(t => t.category === "letter-spacing").map(({ name, light }) => ({ name, value: light })),
    }
    return json(out)
  },
}

// ── get_spacing_scale ───────────────────────────────────────────────────────
export const get_spacing_scale = {
  name: "get_spacing_scale",
  description: "Return every spacing token in order.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const tokens = loadTokens().filter(t => t.category === "spacing").map(({ name, light }) => ({ name, value: light }))
    return json({ count: tokens.length, scale: tokens })
  },
}

// ── get_radius_scale ────────────────────────────────────────────────────────
export const get_radius_scale = {
  name: "get_radius_scale",
  description: "Return every radius token.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const tokens = loadTokens().filter(t => t.category === "radius").map(({ name, light }) => ({ name, value: light }))
    return json({ count: tokens.length, scale: tokens })
  },
}

// ── get_shadow_scale ────────────────────────────────────────────────────────
export const get_shadow_scale = {
  name: "get_shadow_scale",
  description: "Return every shadow token (drop-shadow strings).",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const tokens = loadTokens().filter(t => t.category === "shadow").map(({ name, light }) => ({ name, value: light }))
    return json({ count: tokens.length, scale: tokens })
  },
}

// ── search_tokens ───────────────────────────────────────────────────────────
export const search_tokens = {
  name: "search_tokens",
  description: "Substring search across token names and values.",
  inputSchema: {
    type: "object" as const,
    properties: { query: { type: "string" } },
    required: ["query"],
  },
  handler: async (args: { query: string }): Promise<ToolResult> => {
    const q = args.query.toLowerCase()
    const matches = loadTokens().filter(t =>
      t.name.toLowerCase().includes(q) || t.light.toLowerCase().includes(q) || (t.dark || "").toLowerCase().includes(q)
    )
    return json({ query: args.query, count: matches.length, matches })
  },
}

export const tokenTools = [
  list_token_categories, list_tokens, get_token, get_color_palette, get_semantic_color,
  get_dark_mode_overrides, get_typography_scale, get_spacing_scale, get_radius_scale,
  get_shadow_scale, search_tokens,
]
