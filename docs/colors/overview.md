# Colors

The system has four palettes: **purple** (brand), **neutral** (surfaces / text / borders), **status** (success / warning / error / info), and **accent** (pink). Every shade is a CSS variable; semantic surfaces (background, foreground, muted, accent, popover, card) sit on top.

## At a glance

```
🟣 Purple    50 100 200 300 400 500 600* 700 800 900 950   * = brand
⬜ Neutral   0  50 100 200 300 400 500 600  700 800 900 950
🟢 Status    success / warning / error / info  (each with a -light pair)
🩷 Accent    pink — primary + light
```

## Purple — the brand

| Shade | Variable | Hex | Where it shows up |
|---|---|---|---|
| `purple-50` | `--ux-color-purple-50` | `#faf5ff` | Subtle hover backgrounds, link-on-hover surfaces |
| `purple-100` | `--ux-color-purple-100` | `#f3e8ff` | Secondary button background, accent surfaces, badge backgrounds |
| `purple-200` | `--ux-color-purple-200` | `#e9d5ff` | Borders for purple-tinted blocks, hover for `bg-secondary` |
| `purple-300` | `--ux-color-purple-300` | `#d8b4fe` | Disabled-on-purple states |
| `purple-400` | `--ux-color-purple-400` | `#c084fc` | Dark-mode focus ring, dark-mode link |
| `purple-500` | `--ux-color-purple-500` | `#a855f7` | **Focus ring** (`ring-ring` / `--ux-color-border-focus`) |
| **`purple-600`** | `--ux-color-purple-600` | **`#9333ea`** | **The brand**: primary button bg, link, `bg-primary` |
| `purple-700` | `--ux-color-purple-700` | `#7e22ce` | Primary hover (~`bg-primary/90`), secondary-button text |
| `purple-800` | `--ux-color-purple-800` | `#6b21a8` | Active / pressed states |
| `purple-900` | `--ux-color-purple-900` | `#581c87` | Text on `purple-100` (secondary button foreground) |
| `purple-950` | `--ux-color-purple-950` | `#3b0764` | Deepest purple — rarely used directly |

Tailwind exposes the full scale as `bg-primary-{50..950}` and `text-primary-{50..950}`.

### How it maps to Tailwind tokens

```text
primary.DEFAULT     → purple-600   (the button background, the link)
primary.foreground  → text-on-primary (white)
secondary.DEFAULT   → purple-100   (subtle purple surface)
secondary.foreground → purple-900  (text on the subtle surface)
ring                → purple-500   (focus ring)
text.link           → purple-600 (light) / purple-400 (dark)
border.focus        → purple-500 (light) / purple-400 (dark)
```

## Neutral — surfaces, text, borders

| Shade | Hex | Light-mode role | Dark-mode role |
|---|---|---|---|
| `neutral-0` | `#ffffff` | `bg-primary`, `bg-elevated`, page surfaces | `text-primary` |
| `neutral-50` | `#fafafa` | `bg-secondary`, `bg-subtle` | — |
| `neutral-100` | `#f4f4f5` | `bg-tertiary`, `bg-muted` | — |
| `neutral-200` | `#e4e4e7` | `border-default`, `input` background | — |
| `neutral-300` | `#d4d4d8` | `border-strong` | — |
| `neutral-400` | `#a1a1aa` | `text-muted` (placeholders) | dark-mode `text-tertiary` |
| `neutral-500` | `#71717a` | `text-tertiary`, `muted-foreground` | dark-mode `text-muted` |
| `neutral-600` | `#52525b` | `text-secondary` | — |
| `neutral-700` | `#3f3f46` | — | dark-mode `border-strong` |
| `neutral-800` | `#27272a` | — | dark-mode `border-default`, `bg-tertiary`, `muted`, `accent` |
| `neutral-900` | `#18181b` | — | dark-mode `bg-secondary`, `bg-elevated`, `popover`, `card` |
| `neutral-950` | `#09090b` | `text-primary`, `bg-inverted` | dark-mode `bg-primary` |

### Semantic neutral aliases

```text
bg.primary     → neutral-0    (light) / neutral-950 (dark)   page background
bg.secondary   → neutral-50   / neutral-900                  card background
bg.tertiary    → neutral-100  / neutral-800                  input background
text.primary   → neutral-950  / neutral-0                    body text
text.secondary → neutral-600  / neutral-300                  captions
text.tertiary  → neutral-500  / neutral-400                  metadata
text.muted     → neutral-400  / neutral-500                  placeholders
border.default → neutral-200  / neutral-800                  dividers
border.strong  → neutral-300  / neutral-700                  emphasis
muted          → neutral-100  / neutral-800                  Shadcn `bg-muted`
muted-fg       → neutral-500  / neutral-400                  Shadcn `text-muted-foreground`
```

## Status — feedback colors

| Color | Variable | Hex | Light pair |
|---|---|---|---|
| 🟢 Success | `--ux-color-status-success` | `#16a34a` | `--ux-color-status-success-light` `#bbf7d0` |
| 🟡 Warning | `--ux-color-status-warning` | `#ca8a04` | `--ux-color-status-warning-light` `#fef08a` |
| 🔴 Error | `--ux-color-status-error` | `#dc2626` | `--ux-color-status-error-light` `#fecaca` |
| 🔵 Info | `--ux-color-status-info` | `#2563eb` | `--ux-color-status-info-light` `#bfdbfe` |

Tailwind:

```text
bg-destructive            → status.error           (#dc2626)
bg-destructive-foreground → white
```

For badges and alerts the `<Badge variant="success|warning|error|info">` and `<Alert variant="success|warning|error|info">` variants do the right thing automatically.

> **A11y note**: at small text sizes the warning pair (`#ca8a04` on `#fef08a`) is borderline for WCAG AA. Prefer `text-status-warning-darker` / dark-yellow text on a light yellow surface for body copy; the icon-only badge usage is fine.

## Accent — complementary

| Token | Hex | Use |
|---|---|---|
| `accent-primary` | `#f472b6` | Highlight, marketing surface, decorative dot |
| `accent-primary-light` | `#fbcfe8` | Background for the accent |

The accent is **decorative** — it's not used by any default component. Reach for it in marketing components and one-off illustrations.

> Note: `bg-accent` / `text-accent-foreground` in Tailwind do **not** point at the pink accent — they point at `--ux-color-accent` / `--ux-color-accent-foreground` which is `purple-100` / `purple-900`. This is the Shadcn convention (the `accent` token is for hover surfaces, not a literal accent color). The pink lives at `--ux-color-accent-primary`.

## Dark mode

Dark mode is class-based. Toggle the `dark` class on `<html>`:

```js
document.documentElement.classList.toggle("dark")
```

The `:root { … }` block defines light-mode values; the `.dark { … }` block in `styles/globals.css` overrides only the **semantic** tokens, keeping primitives unchanged. The brand color stays at purple-600 in both modes — what changes is which neutral fills "background", "muted", etc.

| Semantic token | Light | Dark |
|---|---|---|
| `bg.primary` | `neutral-0` | `neutral-950` |
| `bg.secondary` | `neutral-50` | `neutral-900` |
| `bg.tertiary` | `neutral-100` | `neutral-800` |
| `bg.elevated` | `neutral-0` | `neutral-900` |
| `bg.inverted` | `neutral-950` | `neutral-0` |
| `bg.overlay` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.7)` |
| `text.primary` | `neutral-950` | `neutral-0` |
| `text.secondary` | `neutral-600` | `neutral-300` |
| `text.tertiary` | `neutral-500` | `neutral-400` |
| `text.muted` | `neutral-400` | `neutral-500` |
| `text.link` | `purple-600` | `purple-400` |
| `border.default` | `neutral-200` | `neutral-800` |
| `border.focus` | `purple-500` | `purple-400` |
| `muted` | `neutral-100` | `neutral-800` |
| `muted-fg` | `neutral-500` | `neutral-400` |
| `accent` | `purple-100` | `neutral-800` |
| `accent-fg` | `purple-900` | `neutral-0` |
| `popover` | `neutral-0` | `neutral-900` |
| `card` | `neutral-0` | `neutral-900` |

## Usage

### Buttons

```tsx
<Button>Primary</Button>             {/* purple-600 bg, white text */}
<Button variant="secondary">…</Button>  {/* purple-100 bg, purple-900 text */}
<Button variant="destructive">…</Button>  {/* status.error bg, white text */}
<Button variant="outline">…</Button>      {/* transparent bg, border + text */}
<Button variant="ghost">…</Button>        {/* hover:bg-accent on hover */}
<Button variant="link">…</Button>         {/* purple-600 underlined */}
```

### Badges

```tsx
<Badge>Default</Badge>                    {/* purple-600 / white */}
<Badge variant="secondary">…</Badge>      {/* purple-100 / purple-900 */}
<Badge variant="purple">…</Badge>         {/* purple-100 / purple-700 */}
<Badge variant="success">Active</Badge>   {/* status-success-light / status-success */}
<Badge variant="warning">Pending</Badge>
<Badge variant="info">Note</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Tag</Badge>
```

### Alerts

```tsx
<Alert variant="info">       <AlertTitle>Heads up</AlertTitle> …</Alert>
<Alert variant="success">    <AlertTitle>Saved</AlertTitle>    …</Alert>
<Alert variant="warning">    <AlertTitle>Caution</AlertTitle>  …</Alert>
<Alert variant="destructive"><AlertTitle>Error</AlertTitle>    …</Alert>
```

There is no `<Alert variant="primary">` — use `<Alert variant="info">` for the purple-tinted call-out.

## Customising the palette

Override Layer 1 to swap the entire brand:

```css
:root {
  /* Replace purple with blue */
  --ux-color-purple-50:  #eff6ff;
  --ux-color-purple-100: #dbeafe;
  --ux-color-purple-200: #bfdbfe;
  --ux-color-purple-300: #93c5fd;
  --ux-color-purple-400: #60a5fa;
  --ux-color-purple-500: #3b82f6;
  --ux-color-purple-600: #2563eb;   /* main brand */
  --ux-color-purple-700: #1d4ed8;
  --ux-color-purple-800: #1e40af;
  --ux-color-purple-900: #1e3a8a;
  --ux-color-purple-950: #172554;
}
```

If you replace the entire scale, every component repaints — no other change required.

To swap individual semantic surfaces (e.g. tinted backgrounds) override Layer 2 directly:

```css
:root {
  --ux-color-bg-primary:    #f8fafc;   /* slight off-white */
  --ux-color-bg-secondary:  #f1f5f9;
}
```

For dark mode, override the same names inside `.dark { … }`.

## See also

- [Tokens overview](../tokens/overview.md) — the full variable map
- [Theming](../theming/overview.md) — dark mode wiring, custom themes
- [Typography](../typography/overview.md) — font sizes, weights, line heights
