# Composition MCP — building pages in seconds

The dream: type a sentence, get a full app page back. This document describes the architecture that makes that possible, the layers involved, the contracts between layers, and the path to extending the system.

It's both a vision doc (where we're going) and a working v0 (what's already shipped).

---

## 1 · The vision

> "Build me a settings page with three sections: profile, notifications, billing. Add a sidebar."

→ AI calls `compose_page({ template: "settings", props: {…} })`
→ MCP returns a complete `.tsx` file
→ AI writes it to your project
→ It builds, it runs, it's on-brand by construction

The user doesn't write JSX. The AI doesn't invent JSX. The MCP doesn't render anything — it returns a string of TSX that is guaranteed correct because it's assembled from typed, pre-validated pieces.

---

## 2 · The four-layer architecture

```
┌──────────────────────────────────────────────────────────┐
│ Layer 4 — COMPOSITION TOOLS  (MCP server)                │
│   compose_page({ template, props })  →  full .tsx       │
│   list_blocks / list_templates / get_block               │
└──────────────────────────────────────────────────────────┘
                            ▲ called by AI
┌──────────────────────────────────────────────────────────┐
│ Layer 3 — TEMPLATES  (packages/react/src/templates/)     │
│   DashboardTemplate, SettingsTemplate, OnboardingTemplate,│
│   FormPageTemplate, ReportTemplate                       │
└──────────────────────────────────────────────────────────┘
                            ▲ slot props
┌──────────────────────────────────────────────────────────┐
│ Layer 2 — BLOCKS  (packages/react/src/blocks/)           │
│   AppShell, Header, Sidebar, PageHeader, StatsRow,       │
│   DataTable, FormSection, Stepper, EmptyState            │
└──────────────────────────────────────────────────────────┘
                            ▲ composed of
┌──────────────────────────────────────────────────────────┐
│ Layer 1 — COMPONENTS  (packages/react/src/components/)   │
│   Button, Card, Input, Table, … (40 already shipped)     │
└──────────────────────────────────────────────────────────┘
```

The boundaries:

| Layer | What it does | What it knows | What it doesn't know |
|---|---|---|---|
| 4 — Tools | Serialises a template invocation as TSX | Templates, their prop schemas | What blocks/components exist (delegated) |
| 3 — Templates | Assembles 2–8 blocks into a page | Block APIs, page-level layout (grid, scroll, padding) | Brand voice, individual component variants |
| 2 — Blocks | Solves one recurring layout problem | Component APIs, design rules (focus rings, density) | Page context |
| 1 — Components | Renders one primitive UI affordance | Tokens, Radix primitives | Anything above them |

**Why these layers:** each layer talks only to the one below. A change to Button doesn't ripple into templates. A new template doesn't require new blocks. The AI can extend any layer without breaking the rest.

---

## 3 · The blocks (v0 catalog)

| Block | Solves | Composed of |
|---|---|---|
| `AppShell` | Header + sidebar + scrollable content area | `Header` + `Sidebar` + `<main>` |
| `Header` | Top bar with brand, optional nav, optional user menu | `Avatar`, `DropdownMenu`, `Button` |
| `Sidebar` | Left rail with grouped navigation items | `Button` (ghost variant), `Separator` |
| `PageHeader` | Page title + description + action buttons | `Button`, optional `Badge` |
| `StatsRow` | 2–6 KPI cards in a responsive grid | `Card` + `CardHeader/Title/Description` |
| `DataTable` | Searchable table with toolbar and pagination | `Input`, `Table*`, `Pagination`, `Badge` |
| `FormSection` | Titled form group with description + fields + actions | `Card`, `Form*`, `Input`, `Switch`, `Button` |
| `Stepper` | Multi-step wizard with progress | `Card`, `Progress`, `Button` |
| `EmptyState` | "Nothing here yet" placeholder with CTA | `Card`, icon, `Button` |
| `ReportCard` | Chart + heading + meta | `Card`, `Charts/*` |

Roadmap (v1+): `CommandBar`, `FilterPanel`, `Inbox`, `Calendar`, `Kanban`, `Timeline`, `PricingTable`, `Hero`.

### Block design rules

1. **Each block lives in `packages/react/src/blocks/<Name>/<Name>.tsx`.** Same layout convention as components.
2. **Each block is a single default export** plus a typed Props interface.
3. **Blocks consume Layer-1 components only.** Never reach into another block (composition is the template's job).
4. **Token-only styling.** No raw hex, no Tailwind palette classes — Tailwind theme keys only. (HARD-RULES R1, R4 apply.)
5. **Server-rendering safe.** Use `"use client"` only when the block contains state. Templates can be SSR-pure.
6. **Lucide icons by name.** The Props interface accepts `icon?: string` (the lucide export name); the block resolves it. This lets the MCP serialise icon choices as plain strings.

---

## 4 · The templates (v0 catalog)

| Template | What it produces | Props |
|---|---|---|
| `DashboardTemplate` | AppShell + PageHeader + StatsRow + 1–2 ReportCards / DataTable | `title, description, stats[], primaryAction, content[]` |
| `SettingsTemplate` | AppShell + PageHeader + N × FormSection | `title, sections[]` |
| `OnboardingTemplate` | Centred Stepper page (no AppShell) | `steps[], onComplete` |
| `FormPageTemplate` | AppShell + PageHeader + single FormSection | `title, fields[], submitLabel` |
| `ReportTemplate` | AppShell + PageHeader + multiple ReportCards | `title, reports[]` |
| `TableViewTemplate` | AppShell + PageHeader + DataTable | `title, columns[], rows[], actions[]` |

### Template design rules

1. **Templates are pure layout.** No fetching, no client state, no business logic.
2. **Templates accept a `slots?: { … }` escape hatch** for one-off custom JSX between blocks.
3. **Templates accept the AppShell's `header` and `sidebar` props** so the same shell appears across pages.
4. **Templates output complete pages** — they own the `<html>`-level concerns like full-viewport height, scroll behaviour, page padding.

---

## 5 · The composition tools (Layer 4)

Live in `packages/mcp/src/tools/composition.ts`. Registered in `server.ts`.

### `list_blocks`

```text
list_blocks() → {
  count: number,
  blocks: Array<{
    name: string,         // "AppShell" | "Header" | …
    description: string,
    propSchema: object,   // JSON-schema for the block's props
    examplePrompt: string // a sentence that would trigger this block
  }>
}
```

### `get_block(name)`

```text
get_block({ name: "Sidebar" }) → {
  name, description, propSchema, source (the TSX),
  example: { props: {…}, generatedTsx: "…" }   // a known-good invocation
}
```

### `list_templates`

```text
list_templates() → {
  count, templates: Array<{ name, description, propSchema, examplePrompt }>
}
```

### `compose_page` — the headline tool

```text
compose_page({
  template: "dashboard" | "settings" | "form" | "onboarding" | "report" | "table",
  props: { … template-specific … },
  appShell?: {
    header?: { brand?: string, navItems?: [], user?: { name, avatar?, menu?: [] } },
    sidebar?: { sections: [{ heading?, items: [{ icon?, label, href, active? }] }] }
  },
  imports?: string[]   // optional extra named imports the consumer will need
}) → {
  filename: string,           // suggested file name
  tsx: string,                // the full .tsx file content
  warnings: string[]          // anything the tool couldn't perfectly satisfy
}
```

The returned `tsx` is a complete file: imports, exports, the JSX tree, with all icons resolved and all tokens via theme keys. The AI can paste it into the user's project directly.

### `compose_app` (roadmap, v1)

```text
compose_app({
  name: "Acme Studio",
  pages: [
    { route: "/", template: "dashboard", props: {…} },
    { route: "/settings", template: "settings", props: {…} },
    …
  ],
  appShell: { header: {…}, sidebar: {…} },   // shared across all pages
  router: "next-app" | "next-pages" | "react-router"
}) → {
  files: Array<{ path: string, content: string }>,   // every file to write
  instructions: string[]                              // post-write steps (install deps, etc.)
}
```

This is the "build a full app in one prompt" tool. Templates plug in per-page; the AppShell is shared. v1 ships after v0 templates stabilise.

---

## 6 · The data flow — a worked example

User prompt: **"Build me an analytics dashboard. KPIs: MRR, active users, churn. Sidebar with Overview, Customers, Settings."**

Step-by-step:

```text
1. AI (Claude Desktop, Cursor, etc.) sees the request.

2. AI calls list_templates() to discover available pages.
   ← { templates: [{ name: "DashboardTemplate", … }, …] }

3. AI picks "dashboard". To know the prop shape:
   AI calls get_template({ name: "DashboardTemplate" })
   ← { propSchema: { stats: array of { label, value, delta? }, … } }

4. AI calls compose_page({
     template: "dashboard",
     props: {
       title: "Analytics",
       description: "Last 30 days",
       stats: [
         { label: "MRR", value: "$48,210", delta: "+12.4%" },
         { label: "Active users", value: "12,840", delta: "+3.1%" },
         { label: "Churn", value: "2.1%", delta: "-0.4%" }
       ]
     },
     appShell: {
       header: { brand: "Acme" },
       sidebar: { sections: [{ items: [
         { icon: "LayoutDashboard", label: "Overview", href: "/", active: true },
         { icon: "Users", label: "Customers", href: "/customers" },
         { icon: "Settings", label: "Settings", href: "/settings" }
       ]}]}
     }
   })

5. MCP returns:
   {
     filename: "app/analytics/page.tsx",
     tsx: "<… complete TSX file …>",
     warnings: []
   }

6. AI writes the TSX file. Done. The page runs on first build.
```

The user typed one sentence. The AI made 2–3 MCP calls. A page exists.

---

## 7 · Why this works (the contract)

For the magic to hold, several things must stay true:

### 7.1 Blocks never reference each other

If `Sidebar` depended on `PageHeader`, composing them in arbitrary orders would break. Blocks are leaves of a tree whose root is a template.

### 7.2 Templates never embed business logic

A template is a `function Template(props): JSX`. No `useState`, no fetching, no auth checks. The user's pages can wrap a template in those concerns; the template itself stays pure.

### 7.3 Every block prop is JSON-serialisable

That means: strings, numbers, booleans, arrays, plain objects. Lucide icons become strings (`"LayoutDashboard"`) and resolve client-side. Click handlers are passed as **strings** in the MCP world and rewritten by the AI to real functions when it writes the file.

Why: the MCP server returns JSON. If a prop needs a function, the server emits the prop as a placeholder string and the AI replaces it after.

### 7.4 Every prop has a sensible default

`compose_page({ template: "dashboard", props: { title: "Hello" } })` must produce a valid page. The template fills in: empty stats row, default sidebar, no actions. The AI can pass partial props and trust the template.

### 7.5 The output passes the validation gate

After `compose_page` returns, run:

```bash
# Will every var(--ux-*) in the generated tsx resolve?
echo "$tsx" | node -e '/* token-resolves on stdin */'
```

The MCP tool itself runs this check internally. If a generated file would fail, the tool returns `warnings: [...]` instead of a broken file.

---

## 8 · How to add a new block

Procedure (full version in [skills/hermes/PLAYBOOK-components.md](../skills/hermes/PLAYBOOK-components.md), adapted for blocks):

1. Pick a block from the roadmap or propose a new one.
2. Write `packages/react/src/blocks/<Name>/<Name>.tsx` — a single component, typed Props, token-only styling.
3. Add `packages/react/src/blocks/<Name>/index.ts` to re-export.
4. Append to `packages/react/src/blocks/index.ts` (barrel).
5. Export from `packages/react/src/index.ts` (public barrel).
6. Add an entry to the `BLOCKS` registry in `packages/mcp/src/tools/composition.ts` with: name, description, propSchema (JSON Schema), examplePrompt.
7. Rebuild MCP. Test via `list_blocks` and `get_block`.
8. Update this doc's §3 table.

---

## 9 · How to add a new template

1. Identify which existing blocks cover the layout. If a block doesn't exist, add it first.
2. Write `packages/react/src/templates/<Name>Template.tsx`. Pure layout, no logic.
3. Add to barrels and to the `TEMPLATES` registry in composition.ts with prop schema and example.
4. Test by calling `compose_page` with example props.
5. Update §4 of this doc.

---

## 10 · How `compose_page` actually serialises TSX

Roughly:

```ts
function composeTsx(template, props, appShell): string {
  const imports = collectImports(template, appShell)
  const tree = buildJSXTree(template, props, appShell)
  return [
    `"use client"`,
    ``,
    `import * as React from "react"`,
    importLines(imports),
    ``,
    `export default function Page() {`,
    `  return (`,
    indent(tree.toString(), 4),
    `  )`,
    `}`,
  ].join("\n")
}
```

The interesting work is `buildJSXTree` — it walks the template's slot tree, substitutes prop values into the right places, and emits well-formed JSX (with `{…}` braces around expressions, double-quoted string attrs, etc.).

The output is **plain TSX, not HTML**. It assumes the consumer has `@ux/react` installed.

---

## 11 · What the MCP does NOT do

To avoid scope creep, here are explicit non-goals for the composition layer:

- **No styling decisions at runtime.** All design choices live in tokens + components. The composition layer just slots existing pieces.
- **No business logic.** Templates are pure. Data fetching, mutations, validation, auth — the AI generates that around the template, not inside.
- **No image generation.** If a template needs an illustration, it leaves a placeholder; the user's image pipeline fills it.
- **No file-system writes.** `compose_page` returns a string. Writing it to disk is the AI's job (and is auditable).
- **No state.** The MCP server is stateless across calls. Two calls with the same args return the same TSX.

---

## 12 · Roadmap

| Phase | Adds |
|---|---|
| **v0 (now)** | 4 blocks (AppShell, Header, Sidebar, PageHeader, StatsRow), 1 template (DashboardTemplate), 4 MCP tools (list_blocks, get_block, list_templates, compose_page) |
| **v0.1** | DataTable, FormSection, Stepper blocks; SettingsTemplate, FormPageTemplate, OnboardingTemplate |
| **v0.2** | ReportTemplate, TableViewTemplate; EmptyState, ReportCard blocks |
| **v1** | `compose_app` (multi-page), `update_app` (diff against an existing app and propose changes), `get_block_example` returns rendered HTML preview |
| **v1.5** | Block authoring tools — propose-block-from-screenshot |

---

## 13 · The contract with the AI consumer

When you wire this MCP to Claude Desktop / Cursor / Continue, train the user (or include in the skill's system prompt) that:

- "Build me a [kind] page" → call `compose_page` first
- "Show me what blocks are available" → call `list_blocks`
- "What goes in a dashboard" → call `get_template({ name: "DashboardTemplate" })`
- "Add a sidebar with X" → call `get_block({ name: "Sidebar" })`, set props, then call `compose_page` again

The MCP makes it cheaper for the AI to do the right thing than to invent. That's the entire trick.

---

## 14 · Worked end-to-end example

See [examples/dashboard-page.tsx](../examples/dashboard-page.tsx) for a complete generated output.

The MCP call that produced it:

```ts
compose_page({
  template: "dashboard",
  props: {
    title: "Analytics",
    description: "Real-time metrics for the last 30 days",
    stats: [
      { label: "MRR",          value: "$48,210", delta: "+12.4%", positive: true },
      { label: "Active users", value: "12,840",  delta: "+3.1%",  positive: true },
      { label: "Churn",        value: "2.1%",    delta: "-0.4%",  positive: true },
      { label: "Trials",       value: "284",     delta: "+22",    positive: true },
    ],
    primaryAction: { label: "Export", icon: "Download" },
  },
  appShell: {
    header: { brand: "Acme" },
    sidebar: { sections: [{
      items: [
        { icon: "LayoutDashboard", label: "Overview",   href: "/",          active: true },
        { icon: "Users",           label: "Customers",  href: "/customers" },
        { icon: "Receipt",         label: "Billing",    href: "/billing"   },
        { icon: "Settings",        label: "Settings",   href: "/settings"  },
      ]
    }]}
  }
})
```

Result: a TSX file you drop into `app/analytics/page.tsx`. It renders an on-brand, accessible, dark-mode-aware dashboard the first time you load it.

That's the dream. v0 ships the path to it; subsequent versions widen it.
