/**
 * Composition tools — Layer 4 of the architecture.
 *
 * These tools let an AI client turn a high-level prompt into a complete TSX
 * page by composing Layer-3 templates that internally use Layer-2 blocks.
 *
 * The output is a string of TSX. The AI client writes it to a file. The MCP
 * server itself never touches the filesystem.
 */

type ToolResult = { content: Array<{ type: "text", text: string }> }
const json = (v: unknown): ToolResult => ({ content: [{ type: "text", text: JSON.stringify(v, null, 2) }] })
const text = (s: string): ToolResult => ({ content: [{ type: "text", text: s }] })

// ─── Registry of blocks ─────────────────────────────────────────────────────
const BLOCKS = [
  {
    name: "AppShell",
    description: "Top-level page frame: header + optional sidebar + scrollable main. Wraps every other block.",
    examplePrompt: "Frame the page with a header and a left sidebar.",
    propSchema: {
      header: { type: "object", description: "HeaderProps — see Header block." },
      sidebar: { type: "object", description: "SidebarProps — see Sidebar block." },
      noSidebar: { type: "boolean", description: "If true, hide sidebar even if provided." },
    },
  },
  {
    name: "Header",
    description: "Sticky top bar with brand, optional nav links, optional user menu.",
    examplePrompt: "Add a header with brand 'Acme', nav links to Docs/Pricing, and a user menu.",
    propSchema: {
      brand: { type: "string" },
      brandIcon: { type: "string", description: "Lucide icon name (e.g. 'Sparkles')." },
      navItems: { type: "array", items: { type: "object", properties: { label: "string", href: "string", active: "boolean?" } } },
      user: {
        type: "object",
        properties: { name: "string", email: "string?", avatar: "string?", menu: "array of {label, icon?, href?, destructive?}" },
      },
    },
  },
  {
    name: "Sidebar",
    description: "Left-rail navigation with grouped, icon-bearing items. Optional footer slot.",
    examplePrompt: "Sidebar with sections: 'Main' (Overview, Customers, Billing), 'Settings' (Team, Tokens).",
    propSchema: {
      sections: {
        type: "array",
        items: { heading: "string?", items: "array of {icon?, label, href, active?, badge?}" },
        required: true,
      },
      width: { type: "number", description: "Pixels. Default 240." },
    },
  },
  {
    name: "PageHeader",
    description: "Page-level title row: breadcrumbs, title, optional badge, description, and primary/secondary actions.",
    examplePrompt: "Page title 'Customers' with description and a 'New customer' primary action.",
    propSchema: {
      title: { type: "string", required: true },
      description: { type: "string" },
      badge: { type: "object", properties: { label: "string", variant: "default|secondary|success|warning|error|info|purple|outline" } },
      breadcrumbs: { type: "array", items: "{label, href?}" },
      actions: { type: "array", items: "{label, icon?, variant?, href?}" },
    },
  },
  {
    name: "StatsRow",
    description: "Responsive grid of KPI cards (label, value, optional delta, icon).",
    examplePrompt: "Four KPI cards: MRR, active users, churn, trials.",
    propSchema: {
      stats: { type: "array", required: true, items: "{label, value, delta?, positive?, icon?, description?}" },
      cols: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
    },
  },
] as const

// ─── Registry of templates ──────────────────────────────────────────────────
const TEMPLATES = [
  {
    name: "DashboardTemplate",
    slug: "dashboard",
    status: "v0",
    description: "App-shell page with PageHeader, StatsRow, and a slot for charts/tables below.",
    examplePrompt: "Build me an analytics dashboard with KPIs for MRR, active users, churn.",
    propSchema: {
      title: { type: "string", required: true },
      description: { type: "string" },
      stats: { type: "array", items: "Stat" },
      statsCols: { type: "integer", enum: [1, 2, 3, 4, 5, 6] },
      actions: { type: "array" },
      breadcrumbs: { type: "array" },
      appShell: { type: "object", description: "{ header, sidebar, noSidebar? }" },
    },
  },
  {
    name: "SettingsTemplate",
    slug: "settings",
    status: "roadmap-v0.1",
    description: "App-shell page with N FormSection blocks for grouped configuration. Stubbed — uses DashboardTemplate as a fallback in v0.",
    examplePrompt: "Settings page with profile, notifications, and billing sections.",
    propSchema: {
      title: { type: "string", required: true },
      sections: { type: "array", description: "[{ title, description, fields: [{name, label, type, required?, defaultValue?, helper?}] }]" },
      appShell: { type: "object" },
    },
  },
  {
    name: "FormPageTemplate",
    slug: "form",
    status: "roadmap-v0.1",
    description: "App-shell page with a single FormSection. Stubbed — uses DashboardTemplate as a fallback in v0.",
    examplePrompt: "New-customer form with name, email, plan select.",
    propSchema: {
      title: { type: "string", required: true },
      fields: { type: "array" },
      submitLabel: { type: "string" },
      appShell: { type: "object" },
    },
  },
  {
    name: "OnboardingTemplate",
    slug: "onboarding",
    status: "roadmap-v0.1",
    description: "Centered Stepper page (no AppShell). Stubbed in v0.",
    examplePrompt: "3-step onboarding: welcome, connect, finish.",
    propSchema: {
      steps: { type: "array", description: "[{ title, description, body? }]" },
    },
  },
  {
    name: "ReportTemplate",
    slug: "report",
    status: "roadmap-v0.2",
    description: "App-shell page with multiple ReportCard blocks. Stubbed in v0.",
    examplePrompt: "Revenue report with monthly chart, quarterly chart, top customers table.",
    propSchema: { title: "string", reports: "array" },
  },
  {
    name: "TableViewTemplate",
    slug: "table",
    status: "roadmap-v0.2",
    description: "App-shell page with a single DataTable. Stubbed in v0.",
    examplePrompt: "Customers table with sortable columns and a 'New customer' action.",
    propSchema: { title: "string", columns: "array", rows: "array" },
  },
] as const

// ─── Tools ──────────────────────────────────────────────────────────────────
export const list_blocks = {
  name: "list_blocks",
  description: "List every composition block available in @ux/react. Returns name, description, prop schema, and a sample prompt.",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => json({ count: BLOCKS.length, blocks: BLOCKS }),
}

export const get_block = {
  name: "get_block",
  description: "Fetch one block's metadata: prop schema and example prompt. Use this before calling compose_page so you know which props to pass.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Block name (PascalCase): AppShell, Header, Sidebar, PageHeader, StatsRow." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const b = BLOCKS.find(x => x.name.toLowerCase() === args.name.toLowerCase())
    return b ? json(b) : json({ error: `No block named '${args.name}'. Try list_blocks.` })
  },
}

export const list_templates = {
  name: "list_templates",
  description: "List page templates available for compose_page. Each entry shows: slug (use this as the `template` arg), description, prop schema, status (v0 / roadmap).",
  inputSchema: { type: "object" as const, properties: {} },
  handler: async (): Promise<ToolResult> => json({ count: TEMPLATES.length, templates: TEMPLATES }),
}

// ─── compose_page — the headline tool ───────────────────────────────────────
type ComposeArgs = {
  template: string
  props?: Record<string, unknown>
  appShell?: Record<string, unknown>
  filename?: string
}

function indent(s: string, n: number) {
  const pad = " ".repeat(n)
  return s.split("\n").map(line => (line.length ? pad + line : line)).join("\n")
}

function literal(v: unknown): string {
  if (v === undefined) return "undefined"
  if (v === null) return "null"
  if (typeof v === "string") return JSON.stringify(v)
  if (typeof v === "number" || typeof v === "boolean") return String(v)
  if (Array.isArray(v)) return "[\n" + v.map(item => indent(literal(item), 2)).join(",\n") + "\n]"
  if (typeof v === "object") {
    const o = v as Record<string, unknown>
    const entries = Object.entries(o).filter(([, val]) => val !== undefined)
    if (entries.length === 0) return "{}"
    return "{\n" + entries.map(([k, val]) => `  ${JSON.stringify(k)}: ${indent(literal(val), 2).trim()}`).join(",\n") + "\n}"
  }
  return JSON.stringify(v)
}

function composeDashboard(props: Record<string, unknown>, appShell?: Record<string, unknown>): string {
  const componentName = "DashboardPage"
  const propsLiteral = literal({ ...props, appShell })
  return [
    `"use client"`,
    ``,
    `import * as React from "react"`,
    `import { DashboardTemplate } from "@ux/react"`,
    ``,
    `export default function ${componentName}() {`,
    `  return (`,
    `    <DashboardTemplate`,
    `      {...${indent(propsLiteral, 6).trim()}}`,
    `    />`,
    `  )`,
    `}`,
    ``,
  ].join("\n")
}

function composeFallback(template: string, props: Record<string, unknown>, appShell?: Record<string, unknown>): string {
  // v0 fallback: route every "roadmap" template through DashboardTemplate
  // but preserve the props so a future version can swap implementations.
  return [
    `"use client"`,
    `// NOTE: The '${template}' template is on the roadmap; v0 renders via DashboardTemplate.`,
    `// Track: docs/composition-mcp.md §12.`,
    ``,
    `import * as React from "react"`,
    `import { DashboardTemplate } from "@ux/react"`,
    ``,
    `export default function Page() {`,
    `  return (`,
    `    <DashboardTemplate`,
    `      {...${indent(literal({ ...props, appShell }), 6).trim()}}`,
    `    />`,
    `  )`,
    `}`,
    ``,
  ].join("\n")
}

export const compose_page = {
  name: "compose_page",
  description:
    "Compose a full TSX page from a template + props + optional AppShell. Returns { filename, tsx, warnings }. " +
    "Templates available: dashboard (v0), settings/form/onboarding/report/table (v0 fallback to dashboard). " +
    "Use list_templates to see prop schemas before calling.",
  inputSchema: {
    type: "object" as const,
    properties: {
      template: {
        type: "string",
        description: "Template slug. One of: dashboard, settings, form, onboarding, report, table.",
      },
      props: {
        type: "object",
        description: "Template-specific props. Run list_templates to see the schema for each template.",
      },
      appShell: {
        type: "object",
        description: "{ header?: HeaderProps, sidebar?: SidebarProps, noSidebar?: boolean }",
      },
      filename: {
        type: "string",
        description: "Optional suggested filename (e.g. 'app/dashboard/page.tsx').",
      },
    },
    required: ["template"],
  },
  handler: async (args: ComposeArgs): Promise<ToolResult> => {
    const props = args.props ?? {}
    const appShell = args.appShell
    const warnings: string[] = []

    const tmpl = TEMPLATES.find(t => t.slug === args.template || t.name.toLowerCase() === args.template.toLowerCase())
    if (!tmpl) {
      return json({ error: `Unknown template '${args.template}'. Try list_templates.` })
    }

    let tsx: string
    if (tmpl.slug === "dashboard") {
      tsx = composeDashboard(props, appShell)
    } else {
      tsx = composeFallback(tmpl.slug, props, appShell)
      warnings.push(
        `Template '${tmpl.slug}' is ${tmpl.status}; v0 emits a DashboardTemplate fallback. ` +
        `The page will render but won't match the eventual ${tmpl.name} layout. ` +
        `Track docs/composition-mcp.md §12 for the upgrade.`
      )
    }

    if (!props || !("title" in props)) {
      warnings.push("`title` was not provided; the page will render with no heading.")
    }

    const filename = args.filename ?? `app/${tmpl.slug}/page.tsx`
    return json({ filename, tsx, warnings })
  },
}

export const get_template = {
  name: "get_template",
  description: "Return one template's metadata (status, description, prop schema, example prompt). Use this BEFORE calling compose_page so you know what to pass.",
  inputSchema: {
    type: "object" as const,
    properties: { name: { type: "string", description: "Template name (PascalCase) or slug." } },
    required: ["name"],
  },
  handler: async (args: { name: string }): Promise<ToolResult> => {
    const t = TEMPLATES.find(x =>
      x.name.toLowerCase() === args.name.toLowerCase() ||
      x.slug.toLowerCase() === args.name.toLowerCase()
    )
    return t ? json(t) : json({ error: `No template named '${args.name}'. Try list_templates.` })
  },
}

export const compositionTools = [list_blocks, get_block, list_templates, get_template, compose_page]
