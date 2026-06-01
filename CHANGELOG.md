# Changelog

All notable changes are recorded here. Format roughly follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Typography

- **Heading family swapped: Roboto Slab → Roboto Mono.** New voice for headings — monospace, geometric, deliberate. Open Sans (body) and JetBrains Mono (code) are unchanged. This is a stylistic choice; if a softer hierarchy is preferred, override `--ux-font-family-headings` (see `docs/theming/overview.md`).
- Updated the Google Fonts `@import` URL, the Next.js `next/font` snippet, the Tailwind `fontFamily.heading` fallback (`serif` → `ui-monospace`, `monospace`), and the Figma Make spec to list Roboto Mono for `Text/H*` and `Text/Display/*`.
- Removed historical-quote references where they were direct API claims, but kept the pre-rescue Critical Review docx unchanged so it remains a faithful audit snapshot.

### Documentation

- **Rewrote every doc against the source of truth.** Earlier iterations advertised `<Card title=… description=…>`, `<Button variant="primary">`, `<Alert variant="primary">`, a `Modal` component, a `data-theme="dark"` selector, and a `size` prop on `Badge` — none of which exist. All examples in the new docs run as-is.
- **Per-component reference pages auto-generated** from the source. See `scripts/generate-component-docs.mjs` and the 40 pages under `docs/components/`. Re-run after any component change.
- **Reconciled the "main color" contradiction.** Three different files said three different things (`#8b5cf6`, `#a855f7`, `#9333ea`); the brand is `purple-600` (`#9333ea`) everywhere now.
- **Removed the "no framework lock-in" / "components work without Tailwind" claims.** Tailwind is required; the docs now say so.
- **Dropped the `data-theme` references.** Dark mode is class-based — `<html class="dark">` — and always has been in code.
- New top-level [Multi-Agent Fix Plan](./Multi-Agent-Fix-Plan.docx) and [Build Status](./Build-Status.docx) Word docs accompanying the codebase rescue.

### Build & packaging

- **`@ux/tokens` and `@ux/react` now build.** Replaced the broken `tsup` configuration (which referenced flat kebab-case files that never existed) with a `tsc`-based pipeline at `packages/{tokens,react}/scripts/build.mjs`. No native binaries; no rollup.
- **`@ux/tokens` exports map points at real files.** Previously the `import`/`require` entries pointed at `.mjs`/`.cjs` files that did not exist. Now produces ESM `.mjs` + CJS `.cjs` + `.d.ts` for `index` and per-layer subpath entries (`./primitive`, `./alias`, `./component`).
- **`@ux/react` exports map simplified.** Stripped 40 phantom subpath exports referencing kebab-case files. Single barrel entry point with `"sideEffects": false` for tree-shaking. 193 named exports.
- **`scripts/check-tokens.mjs`-style guard implemented inline.** Every `var(--ux-*)` reference in `packages/`, `styles/`, and `tailwind.config.ts` now resolves to a definition in `globals.css`. 173 vars defined; 59 referenced; 0 missing.

### Tokens

- **Single CSS variable namespace (`--ux-*`) everywhere.** Removed the dual-prefix bug where the `.dark` block flipped one set of names while components read another.
- **Added missing semantic tokens:** `--ux-color-muted`, `--ux-color-muted-foreground`, `--ux-color-accent`, `--ux-color-accent-foreground`, `--ux-color-popover[-foreground]`, `--ux-color-card[-foreground]`. The Tailwind config referenced these; they were undefined.
- **Filled in the spacing scale:** added `--ux-spacing-{2.5, 5, 7, 9, 10, 14, 16, 20, 24}`. Component tokens referenced these and resolved to nothing.
- **Fixed the shimmer utility** (`.animate-shimmer`) to read from the `--ux-` namespace.

### Components — fixed

- **Alert** — replaced `WarningTriangle` (does not exist in `lucide-react`) with `TriangleAlert`. Hardened the icon lookup so an unset variant cannot crash. (Already fixed by the prior team; doc updated.)
- **Carousel** — destructure `orientation` from `useCarousel()` in `CarouselPrevious` and `CarouselNext`. Previously referenced an unbound identifier.
- **Calendar** — rewrote for `react-day-picker` v9 (`Chevron` component, `button_previous`/`button_next` class names, `month_grid`, etc.). The earlier code used the v8 API.
- **InputOtp** — rewrote against the actual `input-otp` API (`OTPInput` + `OTPInputContext`); was previously trying to use a non-existent namespace `OTPInput.Root/Group/Slot/Separator`.
- **Resizable** — uses `react-resizable-panels` exports `Group`/`Panel`/`Separator` (not `PanelGroup`/`Panel`/`PanelResizeHandle`). Replaced `@radix-ui/react-icons` (uninstalled) with `GripVertical` from lucide.
- **Dialog** — replaced removed Radix prop type names (`OverlayProps`, `ContentProps`, `TitleProps`, `DescriptionProps`) with `React.ComponentPropsWithoutRef<typeof …>`. Switched `clsx` → `cn` for proper Tailwind class merging. Replaced raw colors (`bg-white`, `text-neutral-*`, `focus:ring-purple-500`) with theme keys. Removed hard-coded `z-[1300]`.
- **DropdownMenu** — added `& { inset?: boolean }` intersection on `DropdownMenuSubTrigger` props.
- **Charts** — stopped forwarding Recharts Tooltip/Legend prop shapes through to a plain `<div>`. Now uses `HTMLAttributes<HTMLDivElement>`.
- **Pagination** — switched `ButtonProps` import to `type`-only; reordered Previous/Next props so `size="default"` does not collide with the spread.
- **Toggle** — type alias instead of `interface … extends … {}` so `className` is reachable on TS5.
- **Form** — barrel now re-exports the full Shadcn pattern (`Form`, `FormField`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField`). Previously only four wrappers were re-exported despite the file implementing the full pattern.
- **Components index** — removed `export * from "./Modal/Modal"`; that directory does not exist (Dialog is the name).

### Components — already fixed before this rescue (kept; documented)

The team had already done substantial work that the documentation never reflected:

- The 19-file "nested `var()` arbitrary class" bug (e.g. `bg-[var(--ux-color-bg-[var(--ux-color-purple-600)])]`) was already swept. Components now use Tailwind theme keys (`bg-background`, `text-foreground`, `border-border`, etc.).
- The four `@/components/ui/*` broken imports in Command, Pagination, Calendar, Carousel were repointed at the actual `@/components/<Name>/<Name>` paths.
- The `{components/` and `{packages/` garbage directories from the unescaped-brace generation bug had been deleted.

### Known issues (carried forward)

- `lucide-react` is pinned to `1.14.0`. The current code uses modern icon names (`TriangleAlert`, `GripVertical`, `Dot`); these resolve at runtime but a bump to a current `0.x` release is on the next-PR list.
- No Storybook yet. Visual regression coverage is on the roadmap (see [Multi-Agent Fix Plan](./Multi-Agent-Fix-Plan.docx) §7).
- Build is `tsc`-only — no minification, no tree-shake at build time. Tree-shaking is delegated to consumer bundlers via `"sideEffects": false`.
- `badge.warning` (yellow text on yellow background) is borderline for WCAG AA at body sizes. Documented in the colors guide; A11y pass scheduled.

## [0.1.0] — initial commit

- 40 components, 3-layer token system on paper, `:root` and `.dark` CSS variables.
- Build pipeline broken; documentation drifted from code; ~30% of components had compile-blocking bugs. See [Design-System-Critical-Review.docx](./Design-System-Critical-Review.docx) for the full triage.
