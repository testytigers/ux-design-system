# UX Design System

A purple-first React component library built on **Shadcn UI** + **Radix UI** primitives, with a tokenized theme expressed as CSS custom properties and consumed through Tailwind.

> **Status:** v0.1 — usable. The component surface is stable; theming and tooling are still maturing. See [CHANGELOG.md](./CHANGELOG.md).

## What you get

| Metric | Value |
|---|---|
| Components | 40 (40 directories under `packages/react/src/components`, 193 named exports) |
| Token layers | Primitive (Tailwind-style scales) + semantic aliases (CSS custom properties) |
| Color scales | Purple (50–950) · Neutral (0–950) · Status (success / warning / error / info) · Accent (pink) |
| Typography | Roboto Mono (headings) · Open Sans (body) · JetBrains Mono (code) |
| Dark mode | Built-in via the `.dark` class on `<html>` (Tailwind `darkMode: ["class"]`) |
| Runtime deps | React 18+ · React-DOM · Radix UI primitives · lucide-react · class-variance-authority · clsx · tailwind-merge |
| Build deps | **Tailwind CSS v3.4+ is required** to compile component class names |

## Architecture

The system is **two layers in practice**, three on paper:

```
┌────────────────────────────────────────────────────────────────┐
│ Components (packages/react/src/components/**)                  │
│   className strings use Tailwind theme keys:                   │
│     bg-primary, text-foreground, border-border,                │
│     bg-muted, text-muted-foreground, ring-ring, …              │
└──────────────────────────────┬─────────────────────────────────┘
                               │ Tailwind theme
                               ▼
┌────────────────────────────────────────────────────────────────┐
│ Semantic CSS variables (styles/globals.css :root + .dark)      │
│   --ux-color-bg-primary, --ux-color-text-primary,              │
│   --ux-color-border-default, --ux-color-border-focus, …        │
└──────────────────────────────┬─────────────────────────────────┘
                               │ var()
                               ▼
┌────────────────────────────────────────────────────────────────┐
│ Primitive CSS variables (styles/globals.css :root)             │
│   --ux-color-purple-{50..950}                                  │
│   --ux-color-neutral-{0..950}                                  │
│   --ux-color-status-{success,warning,error,info}[-light]       │
│   --ux-spacing-{0..24}, --ux-radius-{none..full}, …            │
└────────────────────────────────────────────────────────────────┘
```

The TypeScript modules `packages/tokens/src/layers/{primitive,alias,component}.ts` mirror these values for programmatic access; they are exported from `@ux/tokens` and `@ux/tokens/{primitive,alias,component}`.

## Packages

| Package | Purpose | Entry points |
|---|---|---|
| `@ux/tokens` | Token values + CSS variables file | `.` (barrel) · `./primitive` · `./alias` · `./component` · `./css` (variables.css) |
| `@ux/react` | React components | `.` (barrel — 193 exports) |

## Quick start

```bash
pnpm add @ux/react @ux/tokens
# peerDeps you also need:
pnpm add react react-dom tailwindcss
```

```tsx
// app.tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from "@ux/react"

export default function App() {
  return (
    <Card>
      <CardHeader><CardTitle>Hello</CardTitle></CardHeader>
      <CardContent>
        <Button>Primary</Button>
        <Button variant="outline" className="ml-2">Outline</Button>
      </CardContent>
    </Card>
  )
}
```

```css
/* globals.css */
@import "@ux/tokens/css";  /* :root + .dark CSS variables */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Full setup, including the Tailwind config you must extend, lives in [docs/getting-started.md](./docs/getting-started.md).

## Design decisions

- **Purple-600 (`#9333ea`) is the primary brand color.** It maps to Tailwind's `primary` token and `text.link`. (Purple-500 is the focus-ring color in light mode; purple-400 in dark mode.)
- **Roboto Mono** for headings — geometric, technical, deliberate. Pairs with JetBrains Mono for code; if you want a softer visual hierarchy, swap `--ux-font-family-headings` to a slab/serif of your choosing.
- **Open Sans** for body — high legibility at small sizes.
- **Tailwind theme keys, not arbitrary values.** Components read `bg-primary`, not `bg-[var(--ux-color-purple-600)]`. This keeps the tokens replaceable without grep-rewriting components.
- **Compound components, not prop kitchen-sinks.** `<Card><CardHeader><CardTitle/></CardHeader>…</Card>` rather than `<Card title=… description=…/>`. Mirrors Shadcn UI conventions.
- **Real Form integration with `react-hook-form`.** `Form`, `FormField`, `FormControl`, `FormMessage`, `useFormField` are all exported and wire up to a Controller.

## Documentation

| Doc | What it covers |
|---|---|
| [Getting Started](./docs/getting-started.md) | Install, Tailwind config, first component, common pitfalls |
| [Tokens](./docs/tokens/overview.md) | The CSS variable tree, naming, how to override |
| [Colors](./docs/colors/overview.md) | Purple / neutral / status / accent scales, dark mode mappings |
| [Typography](./docs/typography/overview.md) | Fonts, sizes, weights, line heights, loading |
| [Theming](./docs/theming/overview.md) | Dark mode, custom themes, brand-color swap |
| [Components](./docs/components/overview.md) | Per-component import, props, variants, examples |

Each component also has its own page under `docs/components/`.

## Build

```bash
# from repo root
cd packages/tokens && npm run build   # → dist/{esm,cjs,d.ts} + css/variables.css
cd packages/react  && npm run build   # → dist/{esm,d.ts} (193 exports)
```

The build is `tsc` + a small post-processor (`packages/*/scripts/build.mjs`). No bundler, no native bindings.

## Limitations and known issues

These are real and documented so consumers don't trip over them:

- **Tailwind is required.** Components ship class strings; they will not render correctly without a Tailwind compile step. Add `./node_modules/@ux/react/dist/**/*.js` to your Tailwind `content` glob.
- **No Storybook yet.** A visual sandbox is on the roadmap (see [Multi-Agent Fix Plan §7](./Multi-Agent-Fix-Plan.docx)).
- **Tests are limited.** Unit + visual coverage is being added incrementally.
- **`lucide-react` major version.** Currently pinned to `1.14.0` for legacy reasons; will be moved to a current `0.x` release in an upcoming patch.

## License

MIT
