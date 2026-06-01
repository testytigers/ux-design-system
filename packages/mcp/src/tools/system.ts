/**
 * System-level + validation MCP tools.
 */
import { loadTokens, brandSummary, TOKEN_PREFIX } from "../data.js"

type ToolResult = { content: Array<{ type: "text", text: string }> }
const json = (v: unknown): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(v, null, 2) }] })

// ── get_brand_summary ───────────────────────────────────────────────────────
export const get_brand_summary = {
  name: "get_brand_summary",
  description: "One-shot summary of brand identity: primary color, fonts, density, geometry, dark-mode mechanic, copy voice, hard rules.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => json(brandSummary()),
}

// ── get_design_principles ───────────────────────────────────────────────────
export const get_design_principles = {
  name: "get_design_principles",
  description: "Returns voice/tone/UI-copy guidance: sentence case, no emoji, no exclamation marks, error wording rules, empty-state guidance.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => json({
    voice: [
      "Direct, technical, product-engineering-flavored.",
      "First-person plural ('we') is fine; first-person singular ('I') is rare.",
      "Treat the reader as a peer.",
    ],
    casing: "Sentence case everywhere — buttons, headings, alert titles, table headers.",
    rules: {
      noEmoji: "Use Lucide icons instead.",
      noExclamationMarks: "Status messages are matter-of-fact ('Saved', 'Couldn't save', 'Heads up').",
      noSerifFonts: "Headings: Roboto Mono. Body: Open Sans. Code: JetBrains Mono.",
      noRawHexInComponents: "Always bind to var(--ux-*) tokens.",
      sentenceCase: "Always.",
    },
    length: {
      headlines: "≤ 6 words",
      buttonCopy: "1–2 words ('Save changes', 'Delete project')",
      descriptions: "≤ 1 sentence on cards and dialogs",
    },
    errorAndEmptyStates: {
      errorsNameTheFailure: "'Couldn't save — network error', NOT 'You entered the wrong thing'.",
      emptyStates: "Acknowledge the absence; offer the next action. Never apologize.",
    },
    examples: [
      "Build with purpose.  (hero)",
      "Manage your team's design tokens and theme overrides.  (card description)",
      "Token drift detected between Figma and code.  (warning)",
      "Your design tokens were synced 2s ago.  (toast description)",
    ],
  }),
}

// ── validate_token_references ───────────────────────────────────────────────
export const validate_token_references = {
  name: "validate_token_references",
  description: "Given a CSS/HTML/TSX snippet, find every var(--ux-*) reference and report any that don't resolve to a defined token. Returns { ok, total, missing[] }.",
  inputSchema: {
    type: "object" as const,
    properties: { source: { type: "string", description: "Source text to scan." } },
    required: ["source"],
  },
  handler: async (args: { source: string }): Promise<ToolResult> => {
    const defined = new Set(loadTokens().map(t => t.name))
    const referenced = new Set<string>()
    const P = TOKEN_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const varRe = new RegExp(`var\\((${P}[A-Za-z0-9_.-]+)`, "g")
    for (const m of args.source.matchAll(varRe)) referenced.add(m[1])
    const missing = [...referenced].filter(r => !defined.has(r)).sort()
    return json({
      ok: missing.length === 0,
      totalReferenced: referenced.size,
      totalDefined: defined.size,
      missing,
    })
  },
}

// ── validate_dark_mode_parity ───────────────────────────────────────────────
export const validate_dark_mode_parity = {
  name: "validate_dark_mode_parity",
  description: "Sanity-check: every semantic token (color.bg.*, color.text.*, color.border.*, color.muted, color.accent, color.popover, color.card, color.input, color.ring, color.foreground) should have a distinct dark-mode value. Returns any that flatline.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => {
    const semantic = loadTokens().filter(t =>
      t.category === "color.bg" || t.category === "color.text" ||
      t.category === "color.border" || t.category === "color.shadcn"
    )
    const flatlines = semantic.filter(t => !t.dark || t.dark === t.light).map(t => t.name)
    return json({
      ok: flatlines.length === 0,
      checkedSemanticTokens: semantic.length,
      flatlines,
      note: "Tokens listed in 'flatlines' have the same value in both modes — that's intentional for foreground-on-coloured-surface pairs (text-on-primary, text-on-accent) but a bug for backgrounds/borders.",
    })
  },
}

export const systemTools = [
  get_brand_summary, get_design_principles, validate_token_references, validate_dark_mode_parity,
]
