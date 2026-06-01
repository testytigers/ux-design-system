/**
 * Component-related MCP tools.
 */
import { loadComponents, type ComponentInfo } from "../data.js"

type ToolResult = { content: Array<{ type: "text", text: string }> }
const json = (v: unknown): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(v, null, 2) }] })
const text = (s: string): ToolResult => ({ content: [{ type: "text", text: s }] })

function summarize(c: ComponentInfo) {
  return {
    name: c.name, slug: c.slug, category: c.category, description: c.description,
    exports: c.exports, variants: c.variants, defaults: c.defaults,
    flags: {
      asChild: c.hasAsChild,
      inset: c.hasInsetProp,
      side: c.hasSideProp,
      orientation: c.hasOrientationProp,
    },
    sourcePath: c.sourcePath,
  }
}

// ── list_components ─────────────────────────────────────────────────────────
export const list_components = {
  name: "list_components",
  description: "List every component in @ux/react with its category and one-line description.",
  inputSchema: {
    type: "object" as const,
    properties: {
      category: { type: "string", enum: ["input", "display", "overlay", "navigation", "data", "layout", "feedback"], description: "Optional category filter." },
    },
  },
  handler: async (args: { category?: string }): Promise<ToolResult> => {
    let comps = loadComponents()
    if (args.category) comps = comps.filter(c => c.category === args.category)
    return json({
      count: comps.length,
      components: comps.map(c => ({ name: c.name, category: c.category, description: c.description })),
    })
  },
}

// ── get_component ───────────────────────────────────────────────────────────
export const get_component = {
  name: "get_component",
  description: "Get full metadata for one component: exports, CVA variants & defaults, prop flags (asChild/inset/side/orientation), source path.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Component name (PascalCase), e.g. 'Button', 'Dialog', 'Sheet'." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const c = loadComponents().find(x => x.name.toLowerCase() === args.name.toLowerCase())
    if (!c) return json({ error: `No component named '${args.name}'. Try list_components.` })
    return json(summarize(c))
  },
}

// ── get_component_source ────────────────────────────────────────────────────
export const get_component_source = {
  name: "get_component_source",
  description: "Get the full TSX source code of a component. Useful when an AI needs to adapt or fork a component.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Component name (PascalCase)." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const c = loadComponents().find(x => x.name.toLowerCase() === args.name.toLowerCase())
    if (!c) return text(`No component named '${args.name}'.`)
    return text(c.source)
  },
}

// ── get_component_variants ──────────────────────────────────────────────────
export const get_component_variants = {
  name: "get_component_variants",
  description: "Return just the variant matrix (CVA variants + defaults) for one component. Lighter than get_component when you only need the API shape.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string" } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const c = loadComponents().find(x => x.name.toLowerCase() === args.name.toLowerCase())
    if (!c) return json({ error: `No component named '${args.name}'.` })
    return json({ name: c.name, variants: c.variants, defaults: c.defaults })
  },
}

// ── search_components ───────────────────────────────────────────────────────
export const search_components = {
  name: "search_components",
  description: "Substring search across component names, descriptions, and exports.",
  inputSchema: {
    type: "object" as const,
    properties: { query: { type: "string" } },
    required: ["query"],
  },
  handler: async (args: { query: string }): Promise<ToolResult> => {
    const q = args.query.toLowerCase()
    const matches = loadComponents().filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.exports.some(e => e.toLowerCase().includes(q))
    )
    return json({
      query: args.query,
      count: matches.length,
      matches: matches.map(c => ({ name: c.name, category: c.category, description: c.description, exports: c.exports })),
    })
  },
}

export const componentTools = [
  list_components, get_component, get_component_source, get_component_variants, search_components,
]
