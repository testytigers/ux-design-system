# Design System Documentation

Markdown is the canonical source of truth.

## Start here

- **[Getting Started](./getting-started.md)** — install, Tailwind config, first component
- **[Components](./components/overview.md)** — all 40 components with import line, variants, and an example. Each component also has its own page in this folder.
- **[Tokens](./tokens/overview.md)** — the full `--ux-*` variable map across the three layers
- **[Colors](./colors/overview.md)** — purple, neutral, status, accent — every shade with usage guidance and dark-mode pairings
- **[Typography](./typography/overview.md)** — fonts, sizes, weights, line heights, examples
- **[Theming](./theming/overview.md)** — dark mode, custom themes, brand swap, scoped themes

## Word-doc companions (reviews, not references)

These describe **how the system was rescued**, not **how to use it**:

- `Design-System-Critical-Review.docx` (in repo root) — the original audit
- `Multi-Agent-Fix-Plan.docx` — junior-friendly playbooks for the rescue
- `Build-Status.docx` — what the build pipeline does and why

## A note about `index.html`

`docs/index.html` is a 130 KB legacy single-file documentation snapshot from before the rescue. **It is no longer maintained.** It still uses the (incorrect) `data-theme="dark"` selector and references API shapes (`<Card title=…>`, `<Button variant="primary">`, `<Alert variant="primary">`, a `Modal` component) that do not match the current code.

If you opened `index.html` and something looked off — that's why. Use the markdown files in this folder instead. They are generated/maintained against the actual source and verified by the `scripts/check-tokens.mjs`-style guard (every `var(--ux-*)` reference resolves; every doc API exists in code).

The plan is to either regenerate `index.html` from the markdown via a static-site pipeline (Storybook or a docs framework), or to delete it once the rescue is fully merged.

## How the per-component pages stay in sync

`scripts/generate-component-docs.mjs` walks `packages/react/src/components/`, parses each component for its exports and CVA variants, and emits one markdown page per component. Re-run it after any component change:

```bash
node scripts/generate-component-docs.mjs
```

The page bodies are derived from the source — what's in code is what's in the docs.
