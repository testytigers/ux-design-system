# @brand/ds — Agent Reference

This document is the authoritative guide for AI agents generating UI with `@brand/ds`. Read this before writing any JSX. It is intentionally verbose — every ambiguity an agent typically hits is addressed explicitly.

---

## 1 · What this package is

`@brand/ds` is a **forked design system** derived from `@ux/react`. It uses the same 40 Radix-based components but replaces the purple brand with a **violet palette centred on `#8774e1`** and introduces a **Hotjar-inspired app shell** (sidebar + topbar + page header + content area).

Key differences from `@ux/react`:

| | `@ux/react` | `@brand/ds` |
|---|---|---|
| Token prefix | `--ux-*` | `--ds-*` |
| Brand color | `#9333ea` (purple-600) | `#8774e1` (violet-500) |
| Palette name | `purple` | `violet` |
| Focus ring | violet-500 | violet-400 |
| Layout components | None | AppShell, Sidebar, TopBar, PageHeader, ContentArea |
| Package name | `@ux/react` | `@brand/ds` |
| MCP token prefix env | `--ux-` | `--ds-` |

---

## 2 · Hard rules — never break these

1. **Never use raw hex colours.** Always use a CSS variable via a Tailwind utility (`bg-primary`, `text-muted-foreground`, etc.) or `var(--ds-*)` directly.
2. **Never use `data-theme="dark"`.** Dark mode is class-based: toggle `dark` on `<html>`.
3. **Never invent colour names.** The palette is `violet-{50..950}` and `neutral-{0..950}`. There is no `blue`, `green`, or `purple` scale.
4. **Font stack is fixed.** Headings use `font-heading` (Roboto Mono). Body uses the default (`font-body`, Open Sans). Never override with `font-sans` or `font-mono` inside components.
5. **Components are compound, not monolithic.** `Card` has no `title` prop. Use `CardHeader > CardTitle`. The same applies to Dialog, Sheet, Table, etc.
6. **`"use client"` only on interactive components.** `AppShell` and `Sidebar` require it. Static layout wrappers (TopBar, PageHeader, ContentArea) do not.
7. **No gradient backgrounds** in product chrome or layout shells.
8. **2 px focus rings everywhere.** The `ring` Tailwind key resolves to `--ds-color-ring` (violet-400). Do not override it.

---

## 3 · Install + setup

```bash
# from the monorepo root
pnpm install   # brand-ds is already in packages/*
```

**In a Next.js app that consumes it:**

```css
/* globals.css */
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Roboto+Mono:wght@400;500;600;700&display=swap");

/* inline the token file directly — no separate @ux/tokens dep */
```

```ts
// tailwind.config.ts — use the one in packages/brand-ds/tailwind.config.ts
// The critical lines are:
content: [
  "./src/**/*.{ts,tsx}",
  "../../packages/brand-ds/src/**/*.{ts,tsx}", // ← scan the DS source
],
```

Dark mode:
```ts
// app/layout.tsx
<html lang="en" className={isDark ? "dark" : ""}>
```

---

## 4 · Token reference

### Violet palette (brand primitive)

| Token | Value | Tailwind |
|---|---|---|
| `--ds-color-violet-50` | `#f6f4ff` | `primary-50` |
| `--ds-color-violet-100` | `#ece8ff` | `primary-100` |
| `--ds-color-violet-200` | `#d9d1ff` | `primary-200` |
| `--ds-color-violet-300` | `#bcb0f7` | `primary-300` |
| `--ds-color-violet-400` | `#a392ee` | `primary-400` |
| **`--ds-color-violet-500`** | **`#8774e1`** | **`primary` / `primary-500`** |
| `--ds-color-violet-600` | `#6e5bcb` | `primary-600` |
| `--ds-color-violet-700` | `#5242a9` | `primary-700` |
| `--ds-color-violet-800` | `#3c2e87` | `primary-800` |
| `--ds-color-violet-900` | `#291e61` | `primary-900` |
| `--ds-color-violet-950` | `#1a133f` | `primary-950` |

### Semantic Tailwind keys → CSS vars (light mode)

| Tailwind key | CSS variable | Purpose |
|---|---|---|
| `bg-background` | `--ds-color-bg-primary` | Page background |
| `bg-card` | `--ds-color-card` | Card / panel surface |
| `bg-muted` | `--ds-color-muted` | Subtle backgrounds |
| `bg-accent` | `--ds-color-accent` | Hover state fill |
| `bg-primary` | `--ds-color-primary` | Brand CTA background |
| `text-foreground` | `--ds-color-foreground` | Primary text |
| `text-muted-foreground` | `--ds-color-muted-foreground` | Dimmed/secondary text |
| `text-primary-foreground` | `--ds-color-primary-foreground` | Text on brand bg |
| `border-border` | `--ds-color-border-default` | Default dividers |
| `ring-ring` | `--ds-color-ring` | Focus ring (violet-400) |

All semantic keys flip automatically under `.dark`.

---

## 5 · Layout system

The layout components are the most important addition over `@ux/react`. They compose a full app shell in the style of Hotjar / analytics dashboards.

### Component tree

```
AppShell                         — outer frame, manages collapsed state
├── AppShellSidebar              — left rail, animates width on collapse
│   └── Sidebar                 — content wrapper for the rail
│       ├── SidebarLogo         — logo / brand lockup slot
│       ├── SidebarNav          — scrollable nav area
│       │   ├── SidebarNavSection  — optional group label
│       │   └── SidebarNavItem  — single nav link (icon + label + badge)
│       └── SidebarFooter       — bottom slot
│           ├── SidebarPromo    — dismissable promo strip (hides when collapsed)
│           └── SidebarCollapseToggle  — toggles collapsed state
└── AppShellMain                — fills remaining width
    ├── TopBar                  — sticky 56 px header
    │   ├── TopBarBrand         — logo slot (left)
    │   ├── TopBarCenter        — site selector / central area
    │   │   └── TopBarStatusBadge  — "Trial pending" style pill
    │   ├── TopBarDivider       — 1 px vertical rule
    │   ├── TopBarIconButton    — notification bell, help, etc.
    │   └── TopBarAvatar        — user avatar button (right)
    ├── PageHeader              — per-page title/navigation strip
    │   ├── PageHeaderTitleRow  — title + description + actions row
    │   │   ├── PageHeaderTitle
    │   │   ├── PageHeaderDescription
    │   │   └── PageHeaderActions  — right-aligned buttons
    │   ├── PageHeaderTabs      — scrollable tab strip
    │   │   └── PageHeaderTab   — individual tab (underline indicator)
    │   └── PageHeaderFilters   — date picker + filter buttons row
    └── ContentArea             — scrollable main body
        ├── MetricsRow          — auto-column KPI strip
        │   └── MetricCard      — label + value + delta + trend slot
        ├── DashboardGrid       — 1–4 col responsive grid
        └── Widget              — dashboard panel card
            ├── WidgetHeader    — title + actions row
            ├── WidgetBody      — padded content
            └── WidgetFooter    — optional bottom strip
```

### AppShell props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `sidebarWidth` | `number` | `200` | Expanded sidebar width in px |
| `collapsedWidth` | `number` | `56` | Icon-only sidebar width in px |
| `collapsed` | `boolean` | — | Controlled |
| `defaultCollapsed` | `boolean` | `false` | Uncontrolled |
| `onCollapsedChange` | `(v: boolean) => void` | — | |

### SidebarNavItem props

| Prop | Type | Notes |
|---|---|---|
| `icon` | `ReactNode` | Use a 16×16 Lucide icon |
| `label` | `string` | Hidden when collapsed; shown as `title` tooltip |
| `active` | `boolean` | `bg-primary/10 text-primary` style |
| `badge` | `string \| number` | Count pill, hidden when collapsed |
| `href` | `string` | Renders as `<a>` instead of `<button>` |

### TopBarStatusBadge variants

`"trial"` (amber) · `"active"` (green) · `"warning"` (orange) · `"error"` (red)

### ContentArea padding prop

`"none"` · `"sm"` (px-4 py-4) · `"md"` (px-6 py-5, default) · `"lg"` (px-8 py-6)

### DashboardGrid cols prop

`1` · `2` (default) · `3` · `4` — responsive, collapses to 1 on mobile

---

## 6 · Full layout example

```tsx
"use client"
import {
  AppShell, AppShellSidebar, AppShellMain,
  Sidebar, SidebarLogo, SidebarNav, SidebarNavSection,
  SidebarNavItem, SidebarFooter, SidebarPromo, SidebarCollapseToggle,
  TopBar, TopBarCenter, TopBarActions, TopBarStatusBadge,
  TopBarIconButton, TopBarAvatar, TopBarDivider,
  PageHeader, PageHeaderTitleRow, PageHeaderTitle,
  PageHeaderTabs, PageHeaderTab, PageHeaderFilters,
  ContentArea, MetricsRow, MetricCard, DashboardGrid, Widget, WidgetHeader, WidgetBody,
  Button, Badge,
} from "@brand/ds"
import {
  LayoutDashboard, Activity, Flame, BarChart2,
  Bell, HelpCircle, ChevronDown,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <AppShell>
      {/* ── Sidebar ── */}
      <AppShellSidebar>
        <Sidebar>
          <SidebarLogo>
            <span className="font-heading font-bold text-primary">brand</span>
          </SidebarLogo>

          <SidebarNav>
            <SidebarNavItem icon={<LayoutDashboard />} label="Dashboards" href="/dashboards" active />
            <SidebarNavItem icon={<Activity />}        label="Recordings"  href="/recordings" badge={8} />
            <SidebarNavItem icon={<Flame />}           label="Heatmaps"    href="/heatmaps" />
            <SidebarNavSection label="Analyze">
              <SidebarNavItem icon={<BarChart2 />} label="Trends" href="/trends" />
            </SidebarNavSection>
          </SidebarNav>

          <SidebarFooter>
            <SidebarPromo>
              <p className="font-semibold">40% off your first year</p>
              <button className="mt-1 text-primary underline text-xs">Learn more</button>
            </SidebarPromo>
            <SidebarCollapseToggle />
          </SidebarFooter>
        </Sidebar>
      </AppShellSidebar>

      {/* ── Main area ── */}
      <AppShellMain>
        <TopBar>
          <TopBarCenter>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              My Site <ChevronDown className="h-3 w-3" />
            </Button>
            <TopBarStatusBadge variant="trial" label="Trial pending" />
          </TopBarCenter>
          <TopBarDivider />
          <TopBarActions>
            <TopBarIconButton aria-label="Help"><HelpCircle className="h-4 w-4" /></TopBarIconButton>
            <TopBarIconButton aria-label="Notifications"><Bell className="h-4 w-4" /></TopBarIconButton>
            <TopBarAvatar fallback="M" />
          </TopBarActions>
        </TopBar>

        <PageHeader>
          <PageHeaderTitleRow>
            <PageHeaderTitle>Issues on "/sign-up"</PageHeaderTitle>
            <PageHeaderActions>
              <Badge variant="outline">5 widgets</Badge>
              <Button size="sm">+ Add widget</Button>
            </PageHeaderActions>
          </PageHeaderTitleRow>
          <PageHeaderTabs>
            <PageHeaderTab active>All sessions</PageHeaderTab>
            <PageHeaderTab>/features - detractors</PageHeaderTab>
            <PageHeaderTab>Chrome Rage Clicks</PageHeaderTab>
          </PageHeaderTabs>
          <PageHeaderFilters>
            <Button variant="outline" size="sm">Last 30 days</Button>
            <Button variant="outline" size="sm">+ Add filter</Button>
          </PageHeaderFilters>
        </PageHeader>

        <ContentArea>
          <MetricsRow className="mb-5">
            <MetricCard label="Total sessions"       value="130"  />
            <MetricCard label="Avg. session duration" value="6:29" />
            <MetricCard label="Avg. pages / session" value="2.4"  />
            <MetricCard label="Bounce rate"          value="59.2%" />
          </MetricsRow>

          <DashboardGrid cols={2}>
            <Widget>
              <WidgetHeader title="Users who didn't sign up" />
              <WidgetBody className="h-56">
                {/* chart goes here */}
              </WidgetBody>
            </Widget>
            <Widget>
              <WidgetHeader title="Page overview" />
              <WidgetBody>
                {/* heatmap preview */}
              </WidgetBody>
            </Widget>
          </DashboardGrid>
        </ContentArea>
      </AppShellMain>
    </AppShell>
  )
}
```

---

## 7 · Core components — quick reference

All 40 components from `@ux/react` are available. Import from `@brand/ds`. A summary of the most commonly used:

### Buttons + actions

```tsx
<Button variant="default" size="default">Save</Button>
// variants: default | destructive | outline | secondary | ghost | link
// sizes:    default | sm | lg | icon
```

### Cards

```tsx
// Always compound — never <Card title="…">
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

### Badges

```tsx
// variants: default | secondary | destructive | outline | purple | success | warning | info
<Badge variant="success">Active</Badge>
```

### Alerts

```tsx
// variants: default | destructive | success | warning | info
<Alert variant="warning">
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>…</AlertDescription>
</Alert>
```

### Tables

```tsx
// Always compound
<Table>
  <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>
  <TableBody>
    <TableRow><TableCell>Alice</TableCell></TableRow>
  </TableBody>
</Table>
```

### Dialogs

```tsx
// "use client" required
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* body */}
    <DialogFooter><Button>Confirm</Button></DialogFooter>
  </DialogContent>
</Dialog>
```

### Select

```tsx
<Select>
  <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>
```

### Tabs

```tsx
// Built-in Radix Tabs — distinct from PageHeaderTab which is layout-only
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">…</TabsContent>
  <TabsContent value="settings">…</TabsContent>
</Tabs>
```

### Forms (react-hook-form)

```tsx
// "use client" required
const form = useForm<{ email: string }>()
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

---

## 8 · Common mistakes agents make

| Mistake | Correct |
|---|---|
| `<Card title="Dashboard">` | `<Card><CardHeader><CardTitle>Dashboard</CardTitle>` |
| `<Badge size="sm">` | Badges have no `size` prop. Use `className="text-xs"` |
| `<Alert variant="primary">` | No `primary` variant. Use `default` |
| `<Button color="violet">` | No `color` prop. Use `variant="default"` |
| `style={{ color: "#8774e1" }}` | `className="text-primary"` |
| `className="dark:bg-gray-900"` | Use semantic tokens. `className="bg-background"` — it flips automatically |
| `<AppShell>` without `"use client"` | AppShell uses React state. Mark the file with `"use client"` |
| `<SidebarNavItem label="Home" />` without icon | Valid but add an icon — text-only items look broken when collapsed |
| `<TopBarActions>` as a sibling of `<TopBarCenter>` without wrapping in `<TopBar>` | All `TopBar*` subcomponents must be direct children of `<TopBar>` |
| `<PageHeaderTab>` outside `<PageHeaderTabs>` | Always wrap tabs in the container — it handles overflow scroll |
| `<ContentArea>` missing `padding` on a full-bleed page | Pass `padding="none"` and handle padding on inner sections |

---

## 9 · MCP configuration

To point the MCP server at this design system:

```json
{
  "mcpServers": {
    "brand-ds": {
      "command": "node",
      "args": ["/path/to/ux-design-system/packages/mcp/dist/server.js"],
      "env": {
        "UX_DS_ROOT":           "/path/to/ux-design-system/packages/brand-ds",
        "UX_DS_COMPONENTS_DIR": "/path/to/ux-design-system/packages/brand-ds/src/components",
        "UX_DS_TOKEN_PREFIX":   "--ds-"
      }
    }
  }
}
```

Available MCP tools once connected:

| Tool | Returns |
|---|---|
| `list_token_categories` | `color.violet`, `color.neutral`, `spacing`, `radius`, … |
| `list_tokens` | All `--ds-*` variables with light + dark values |
| `get_token("violet-500")` | `{ name: "--ds-color-violet-500", light: "#8774e1", … }` |
| `get_color_palette("violet")` | `{ 50: "#f6f4ff", …, 950: "#1a133f" }` |
| `get_semantic_color("bg.primary")` | Light + dark resolved values |
| `get_component_source("Button")` | Full TSX source |
| `validate_token_references(source)` | Checks all `var(--ds-*)` refs exist |

---

## 10 · Next.js HTTP transport

```ts
// app/api/mcp/route.ts
export const runtime = "nodejs"
export { GET, POST, DELETE } from "@brand/ds/mcp-next"
```

Or point to the MCP package directly:

```ts
export const runtime = "nodejs"
import { createMcpHandler } from "../../packages/mcp/dist/next.js"

export const { GET, POST, DELETE } = createMcpHandler({
  repoRoot: process.env.BRAND_DS_ROOT,
})
```

Set in `.env.local`:
```bash
UX_DS_ROOT=/absolute/path/to/packages/brand-ds
UX_DS_COMPONENTS_DIR=/absolute/path/to/packages/brand-ds/src/components
UX_DS_TOKEN_PREFIX=--ds-
```

---

## 11 · Voice + copy rules

- **Sentence case everywhere** — buttons, headings, table headers, alert titles, nav labels.
- **No emoji** in UI chrome. Use Lucide icons.
- **No exclamation marks** in status messages. "Saved." not "Saved!"
- **Errors name the failure:** "Couldn't save — network error" not "Something went wrong."
- **Button copy is 1–2 words.** "Save changes" · "Delete project" · "Add filter."
- **Empty states offer an action.** Never apologise ("No data yet" + a CTA button).
- **Headlines ≤ 6 words.** Descriptions ≤ 1 sentence.

---

## 12 · File locations

```
packages/brand-ds/
  styles/
    globals.css              ← all --ds-* tokens (:root + .dark)
  tailwind.config.ts         ← maps tokens → Tailwind keys
  src/
    lib/
      utils.ts               ← cn() helper
    components/
      AppShell/AppShell.tsx  ← outer frame + collapse context
      Sidebar/Sidebar.tsx    ← nav rail + all sub-pieces
      TopBar/TopBar.tsx      ← sticky header row
      PageHeader/PageHeader.tsx ← per-page title / tabs / filters
      ContentArea/ContentArea.tsx ← body + metric cards + widgets
      Button/Button.tsx      ← + 39 more (same as @ux/react)
      …
    index.ts                 ← barrel: all exports
  package.json               ← name: "@brand/ds"
  tsconfig.json
```
