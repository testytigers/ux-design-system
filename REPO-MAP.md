# Repository Map

The canonical layout. Everything is here for a reason; everything not listed is either build artifact (`.gitignore`'d) or a **deprecated** legacy file kept on disk because the workspace mount does not permit deletion.

## Top level

```
ux-design-system/
├── README.md                   ← project overview
├── CHANGELOG.md                ← rescue + change log
├── REPO-MAP.md                 ← you are here
├── package.json                ← workspace root (turbo + pnpm)
├── pnpm-workspace.yaml         ← lists packages/*
├── pnpm-lock.yaml              ← canonical lockfile
├── turbo.json                  ← turbo task graph (build, dev, lint, clean)
├── tailwind.config.ts          ← Tailwind theme — maps tokens to keys
├── .gitignore
├── .prettierrc / .prettierignore
│
├── packages/                   ← workspace packages (see below)
├── styles/
│   └── globals.css             ← :root + .dark CSS variables (canonical)
├── docs/                       ← markdown documentation
├── scripts/                    ← repo-level scripts (see below)
│
├── Design-System-Critical-Review.docx   ← original audit
├── Multi-Agent-Fix-Plan.docx            ← junior-friendly rescue playbook
└── Build-Status.docx                    ← post-rescue build status
```

## Packages

### `packages/tokens` — `@ux/tokens`

```
packages/tokens/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                ← barrel + cssVariables string
│   ├── generate-css.ts         ← runtime CSS generation helpers
│   └── layers/
│       ├── primitive.ts        ← Layer 1 — raw scales
│       ├── alias.ts            ← Layer 2 — semantic aliases
│       └── component.ts        ← Layer 3 — component compositions
├── scripts/
│   └── build.mjs               ← tsc-based build (ESM .mjs + CJS .cjs + d.ts + variables.css)
└── dist/                       ← built artifacts (gitignored)
    ├── index.{mjs,cjs,d.ts}
    ├── primitive.{mjs,cjs,d.ts}
    ├── alias.{mjs,cjs,d.ts}
    ├── component.{mjs,cjs,d.ts}
    ├── generate-css.{mjs,cjs,d.ts}
    ├── layers/                 ← per-layer source
    └── css/variables.css       ← exported via `@import "@ux/tokens/css"`
```

### `packages/react` — `@ux/react`

```
packages/react/
├── package.json
├── tsconfig.json               ← used by editors (path aliases for src)
├── tsconfig.build.json         ← used by scripts/build.mjs
├── src/
│   ├── index.ts                ← barrel — 193 named exports
│   ├── lib/
│   │   └── utils.ts            ← cn() helper (clsx + tailwind-merge)
│   └── components/
│       ├── Accordion/Accordion.tsx + index.ts
│       ├── Alert/Alert.tsx     + index.ts
│       ├── … (40 component dirs)
│       └── index.ts            ← internal barrel for components
├── scripts/
│   └── build.mjs               ← tsc + post-processor (alias resolution, .js extensions, "use client")
└── dist/                       ← built artifacts (gitignored)
    ├── index.js + index.d.ts   ← barrel
    ├── components/<Name>/<Name>.{js,d.ts}
    └── lib/utils.{js,d.ts}
```

## Documentation (`docs/`)

```
docs/
├── README.md                   ← docs landing page
├── getting-started.md          ← install + first component + Tailwind setup
├── tokens/
│   ├── overview.md             ← architecture, layers, programmatic API
│   └── reference.md            ← AUTO-GENERATED — every --ux-* var enumerated
├── colors/overview.md
├── typography/overview.md
├── theming/overview.md         ← dark mode (class-based), custom themes
├── components/
│   ├── overview.md             ← all 40 components, variants, imports
│   ├── accordion.md            ← AUTO-GENERATED per-component
│   ├── alert.md                ← AUTO-GENERATED
│   ├── … (40 pages total)      ← AUTO-GENERATED
│   └── tooltip.md              ← AUTO-GENERATED
├── index.html                  ← deprecation redirect to the .md docs
└── TEST-PLAN.md                ← deprecated — pre-rescue test plan
```

## Scripts (`scripts/`)

```
scripts/
├── generate-component-docs.mjs        ← regenerates docs/components/<slug>.md
├── generate-tokens-reference.mjs      ← regenerates docs/tokens/reference.md
├── build-report.js                    ← builds Design-System-Critical-Review.docx
├── build-fix-plan.js                  ← builds Multi-Agent-Fix-Plan.docx
├── build-status.js                    ← builds Build-Status.docx
└── (deprecated, kept for traceability)
    ├── analyze-components.py          ← stubbed; raises on import
    ├── test-design-system.py          ← stubbed; raises on import
    └── generate-components.py         ← stubbed; was the source of the nested-var() bug
```

## Deprecated files kept on disk

| Path | Why kept | What to do |
|---|---|---|
| `analysis-report.json` | FS won't permit deletion | Stubbed with `_deprecated: true`. Ignore. |
| `docs/index.html` | FS won't permit deletion | Replaced with a redirect page pointing at the markdown docs. |
| `docs/TEST-PLAN.md` | FS won't permit deletion | Replaced with a deprecation note. Real test plan deferred. |
| `scripts/analyze-components.py` | FS won't permit deletion | Stubbed; raises on run. |
| `scripts/test-design-system.py` | FS won't permit deletion | Stubbed; raises on run. |
| `scripts/generate-components.py` | FS won't permit deletion | Stubbed; raises on run. **Do not regenerate from it — it produced the nested-var() bug.** |
| `packages/react/tsup.config.ts` | FS won't permit deletion | Replaced with a stub. The current build is `node scripts/build.mjs`. |
| `packages/tokens/tsconfig.cjs.json` | Intermediate build artifact | Regenerated on every build. Add to `.gitignore` (already done). |
| `packages/tokens/dist-cjs/` | Intermediate build artifact | Same — regenerated; gitignored. |
| `packages/react/dist/react/` (332 files) | Pollution from broken earlier build | Each file overwritten with a one-line stub. Excluded from npm publish via `.npmignore` and `package.json#files`. |
| `packages/react/dist/tokens/` (20 files) | Same as above | Same treatment. |

When deletion becomes possible (i.e. a normal git checkout on a normal filesystem), all of the above can be removed in one PR.

## Two lockfiles

The repo currently contains both `pnpm-lock.yaml` and `package-lock.json`. **`pnpm-lock.yaml` is canonical** (matches `pnpm-workspace.yaml` and the `packageManager` field in root `package.json`). `package-lock.json` was created by ad-hoc `npm install` calls during the rescue and is gitignored going forward.

## How to keep this map current

Re-run after any structural change:

```bash
# Per-component docs
node scripts/generate-component-docs.mjs

# Token reference
node scripts/generate-tokens-reference.mjs

# Build (verifies nothing broke)
node packages/tokens/scripts/build.mjs
node packages/react/scripts/build.mjs
```

If you add a new top-level directory or a new package, update this file by hand.
