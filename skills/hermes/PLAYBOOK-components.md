# Playbook — Components

Step-by-step procedure for adding a new component, modifying an existing one, or removing one.

The component layer is where the original Hermes shipped most of its bugs (the entire POSTMORTEM §4 is component-failures). Be extra careful here.

---

## 0 · Decide which kind of change this is

| Kind | Example | Caution level |
|---|---|---|
| **A.** Add a brand-new component (e.g. `Stepper`) | Brand-new directory under `components/` | High — new public API |
| **B.** Add a variant to an existing component (e.g. `Button` variant `outline-destructive`) | Edit `<Name>/<Name>.tsx` | Medium |
| **C.** Add a size or new prop (e.g. `Button` size `xl`) | Edit `<Name>/<Name>.tsx` | Medium |
| **D.** Fix a bug in an existing component | Edit `<Name>/<Name>.tsx` | Low — but always run the full validation gate |
| **E.** Remove a component or variant | Delete or unexport | High — public-API change |

---

## 1 · Pre-flight check

Same as PLAYBOOK-tokens §1. The trunk must be green BEFORE you start.

Additionally for components:

```bash
# Folder count == doc count?
folders=$(ls packages/react/src/components | grep -v "index.ts" | wc -l)
pages=$(ls docs/components/*.md | grep -v overview | grep -v README | wc -l)
echo "components=$folders docs=$pages $([ $folders -eq $pages ] && echo OK || echo DRIFT)"
# Expected: components=40 docs=40 OK
```

If DRIFT: the doc generator hasn't run. Run it before continuing.

```bash
# Export count == 193 (or whatever the current canonical number is)
node --input-type=module -e "import('./packages/react/dist/index.js').then(m => console.log('exports:', Object.keys(m).length))"
# Expected: exports: 193
```

---

## 2 · Confirm the current API via MCP

For any kind except **A** (new component):

```text
get_component({ name: "<TheComponent>" })
# Read: exports, variants, defaults, flags (asChild/inset/side/orientation), sourcePath
```

For deep work, also:

```text
get_component_source({ name: "<TheComponent>" })
# Read the full TSX. Note what patterns are used (forwardRef, Slot, CVA, etc.).
```

Mimic the existing patterns. If you find yourself deviating significantly, **stop and ask**.

---

## 3 · Kind A — Add a brand-new component

### 3.1 Find a sibling to mimic

Look at `list_components({ category: "<your category>" })` and pick the closest existing component as your template. **Read its source** with `get_component_source`. Match its:

- File structure (`<Name>/<Name>.tsx`, `<Name>/index.ts`)
- Naming conventions (PascalCase compound parts like `<Name>Header`, `<Name>Title`, etc.)
- Pattern (forwardRef + ComponentPropsWithoutRef when wrapping Radix; cva for variants)
- Token consumption (Tailwind theme keys only — no raw hex, no nested `var()`)

### 3.2 File template

`packages/react/src/components/Stepper/Stepper.tsx`:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stepperVariants = cva(
  // base classes — every variant gets these
  "flex items-center gap-2",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col items-start",
      },
      size: {
        default: "text-sm",
        sm: "text-xs",
        lg: "text-base",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "default",
    },
  }
)

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, orientation, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stepperVariants({ orientation, size }), className)}
      role="navigation"
      aria-label="Stepper"
      {...props}
    />
  )
)
Stepper.displayName = "Stepper"

const StepperItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { active?: boolean; complete?: boolean }
>(({ className, active, complete, ...props }, ref) => (
  <div
    ref={ref}
    data-active={active ? "true" : undefined}
    data-complete={complete ? "true" : undefined}
    className={cn(
      "flex items-center gap-2 text-muted-foreground",
      "data-[active=true]:text-foreground data-[complete=true]:text-primary",
      className
    )}
    {...props}
  />
))
StepperItem.displayName = "StepperItem"

export { Stepper, StepperItem, stepperVariants }
```

`packages/react/src/components/Stepper/index.ts`:

```ts
export { Stepper, StepperItem, stepperVariants, type StepperProps } from "./Stepper"
```

### 3.3 Wire to the barrels

`packages/react/src/components/index.ts`:

```diff
+ export * from "./Stepper/Stepper"
```

`packages/react/src/index.ts`:

```diff
+ export { Stepper, StepperItem, stepperVariants } from "./components/Stepper"
+ export type { StepperProps } from "./components/Stepper"
```

### 3.4 Add description for the doc generator

`scripts/generate-component-docs.mjs` has a `DESCRIPTION` map and a `CATEGORY` map. Add your component there so the auto-generated page has a meaningful intro.

### 3.5 Build, generate docs

```bash
( cd packages/react && node scripts/build.mjs ) 2>&1 | tail -5
# Expected last lines: [react] post-process: rewrote N files. [react] done.

node scripts/generate-component-docs.mjs 2>&1 | tail -3
# Expected: "Wrote 41 pages, skipped 0." (or whatever new total)
```

### 3.6 Add to the components overview

Edit `docs/components/overview.md`. Find the appropriate category section and add a row to the table. Use the same shape as siblings.

### 3.7 Validation gate

Run [PLAYBOOK-validation.md](./PLAYBOOK-validation.md) §3 in full. Specifically:

```bash
# Build green
( cd packages/react && node scripts/build.mjs ) 2>&1 | tail -3
# Export count went up
node --input-type=module -e "import('./packages/react/dist/index.js').then(m => console.log('exports:', Object.keys(m).length))"
# Expected: 197 (was 193, you added 3: Stepper, StepperItem, stepperVariants), + StepperProps type
# Folder ↔ doc count parity
folders=$(ls packages/react/src/components | grep -v "index.ts" | wc -l)
pages=$(ls docs/components/*.md | grep -v overview | grep -v README | wc -l)
echo "$folders vs $pages"
# Expected: 41 vs 41
# No raw colors crept in
! grep -rnE "(bg-white|bg-black|text-white|bg-neutral-|text-neutral-|bg-purple-|text-purple-)" packages/react/src/components/Stepper
# Should print nothing
# No nested var()
! grep -rE "var\(--ux-color-[a-z]+-\[var" packages/react/src/components/Stepper
# Should print nothing
```

### 3.8 CHANGELOG

```markdown
### Components
- New component: Stepper + StepperItem. Renders a horizontal or vertical progress
  indicator. Variants: orientation (horizontal | vertical), size (default | sm | lg).
  Item props: active, complete. Source: packages/react/src/components/Stepper/.
```

### 3.9 MCP verification

```text
list_components({ category: "navigation" })
# Stepper should appear in the list.

get_component({ name: "Stepper" })
# Variant matrix should match what you wrote.
```

If MCP doesn't list it: the data loader hasn't picked up your new directory. Did you save the .tsx file? Did the loader run? (It re-reads on every server boot.)

---

## 4 · Kind B — Add a variant

Example: add a `success` variant to Button.

### 4.1 Open the existing CVA block

`packages/react/src/components/Button/Button.tsx`:

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center …",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground …",
        destructive: "bg-destructive text-destructive-foreground …",
        outline: "border border-input bg-background …",
        secondary: "bg-secondary text-secondary-foreground …",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // NEW:
        success: "bg-status-success text-white shadow-sm hover:bg-status-success/90",
      },
      size: { … },
    },
    …
  }
)
```

### 4.2 The semantic tokens used must exist

`bg-status-success` resolves to `--ux-color-status-success` (defined as `#16a34a`). Confirm:

```text
get_token({ name: "status-success" })
# Expected: { name: "--ux-color-status-success", light: "#16a34a", category: "color.status" }
```

If you need a new color/surface for the variant, **add it via PLAYBOOK-tokens first**. Don't reach for raw hex.

### 4.3 Build, generate docs, validation gate (same as §3.5–3.7)

The doc generator picks up the new variant from the CVA — `docs/components/button.md` will list it automatically.

### 4.4 CHANGELOG

```markdown
### Components
- Button: new `variant="success"` (bg-status-success / white text). Matches Badge's
  success variant for visual consistency.
```

### 4.5 MCP verification

```text
get_component_variants({ name: "Button" })
# `variant` array should include "success".
```

---

## 5 · Kind C — Add a size or new prop

Same as §4 but in the appropriate variants block. Be careful with size additions: changing the size scale of Button is a visible change across the whole product.

For new boolean props (e.g. `loading?: boolean`), follow the existing `asChild` pattern: destructure it, branch on it, document it in the displayName component spec.

---

## 6 · Kind D — Fix a bug

Bug fixes are the most common change. The procedure is the same as §3–§5 minus the "add" steps.

**Important:** every bug fix gets a CHANGELOG entry under `### Fixes`, with a sentence describing the failure mode and what user behaviour changed. Example:

```markdown
### Fixes
- Carousel: `CarouselPrevious` and `CarouselNext` now destructure `orientation` from
  `useCarousel()`. Previously the references were unbound; vertical orientation crashed at runtime.
```

If the bug appeared in a previous shipped version, also add an entry to [POSTMORTEM.md](./POSTMORTEM.md) so future Hermes knows it happened.

---

## 7 · Kind E — Remove a component or variant

### 7.1 This is a breaking change for consumers

Removal of a public export is **semver-breaking**. Coordinate with the user before deleting.

### 7.2 Search every caller in the repo

```bash
grep -rn "<Stepper\b" docs/ examples/ 2>/dev/null
# If you find usages, you must migrate them first OR provide a deprecation path.
```

### 7.3 Two-step removal

1. **Soft-deprecate** in v0.X: keep the export, add a `@deprecated` JSDoc, log a one-time console warning on render.
2. **Hard-remove** in v0.(X+1): delete the directory and the barrel exports.

### 7.4 CHANGELOG

```markdown
### Breaking
- Removed: Stepper / StepperItem. Use the Pagination + Progress combo instead.
  Migration: see `docs/migrations/stepper-to-pagination.md`.
```

### 7.5 Validation gate

Run §3.7 — the export count goes DOWN, and you must explicitly document that.

---

## 8 · Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Build red, "Cannot find module '@/components/Foo/Foo'" | Forgot `@/*` path alias resolution | Use a relative path or check `tsconfig.json` paths |
| Build red, "Cannot find module '@ux/tokens'" | Workspace symlink missing | `mkdir -p node_modules/@ux && ln -sf $(pwd)/packages/tokens node_modules/@ux/tokens` |
| Build green but export count didn't go up | Forgot to update `src/index.ts` barrel | Add the export, rebuild |
| Doc page is missing | `scripts/generate-component-docs.mjs` didn't run | Re-run it |
| `docs/components/overview.md` doesn't list the new component | Manual edit of overview.md skipped | Edit it; the overview is hand-maintained |
| MCP returns "No component named 'Foo'" | Directory naming mismatch (PascalCase required) | Rename directory to match the .tsx filename |
| Variant doesn't apply in the rendered HTML | CVA `defaultVariants` overrides your variant on missing prop | Pass the variant explicitly OR check defaults |
| Raw color slipped in | Grep blockers from HARD-RULES R4 | Remove the raw class, use tokenised equivalent |
| Nested `var()` slipped in | HARD-RULES R1 violation | Replace with a Tailwind theme key |

---

## 9 · Definition of done for a component change

- [ ] `<Name>/<Name>.tsx` edited
- [ ] `<Name>/index.ts` updated if exports changed
- [ ] `packages/react/src/components/index.ts` (internal barrel) updated if you added a new component
- [ ] `packages/react/src/index.ts` (public barrel) updated if you added a new component
- [ ] `scripts/generate-component-docs.mjs` DESCRIPTION + CATEGORY map updated for new components
- [ ] React package builds (`[react] done.`)
- [ ] `node scripts/generate-component-docs.mjs` regenerated docs; the relevant `.md` reflects your change
- [ ] `docs/components/overview.md` updated if API surface changed
- [ ] No raw colors (R4 grep), no nested `var()` (R1 grep), no fictional APIs (R3 — MCP-verified)
- [ ] `CHANGELOG.md` updated under `## [Unreleased]` → `### Components` or `### Fixes` or `### Breaking`
- [ ] MCP `get_component(name)` returns the new variant matrix
- [ ] If new component: smoke-test rendering with `renderToString` from `react-dom/server` (SSR-safe components only)

Only when ALL boxes are checked: "done".

---

## 10 · Worked example — adding a `loading` boolean to Button

The user wants `<Button loading>Submit</Button>` to disable the button, swap the children for a spinner, and prevent re-clicks.

### 10.1 Verify the change scope

```text
get_component_source({ name: "Button" })
# Read the current Button source. Note the props interface and the forwardRef pattern.
```

### 10.2 Edit

```tsx
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
        {children}
      </Comp>
    )
  }
)
```

### 10.3 Validation

```bash
( cd packages/react && node scripts/build.mjs ) 2>&1 | tail -3
# [react] done.

# Confirm Loader2 import works (lucide-react@1.14.0 has it)
node --input-type=module -e "import('lucide-react').then(m => console.log('Loader2' in m ? 'OK' : 'MISSING'))"

# No new raw colors, no nested var()
! grep -rE "var\(--ux-color-[a-z]+-\[var" packages/react/src/components/Button
! grep -rnE "(bg-white|bg-black|text-white|bg-neutral-)" packages/react/src/components/Button
```

### 10.4 Generate docs

```bash
node scripts/generate-component-docs.mjs 2>&1 | tail -3
# Check that docs/components/button.md now mentions the `loading` prop (it will, because the generator parses ButtonProps).
```

### 10.5 CHANGELOG

```markdown
### Components
- Button: new `loading?: boolean` prop. When true, renders a Loader2 spinner before children,
  forces `disabled`, and sets `aria-busy="true"`. Pairs with form submissions.
```

### 10.6 MCP verification

```text
get_component({ name: "Button" })
# The `loading` prop should appear via the exports / source path. The variant matrix itself
# is unchanged (loading is a boolean prop, not a CVA variant).
```

Done.
