# Theming

Theming in this system means swapping the values of CSS variables. Components don't read primitives directly — they read Tailwind theme keys, which read the semantic CSS variables, which can reference the primitives. So a theme is a set of variable overrides.

## Dark mode

Dark mode is **class-based**, configured by `darkMode: ["class"]` in `tailwind.config.ts`. Toggle the `dark` class on `<html>`:

```js
// Manual toggle
document.documentElement.classList.toggle("dark")

// Follow the OS preference, with manual override stored in localStorage
function applyTheme() {
  const saved = localStorage.getItem("theme")               // "light" | "dark" | null
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const dark = saved ? saved === "dark" : prefersDark
  document.documentElement.classList.toggle("dark", dark)
}
applyTheme()
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme)
```

> Do **not** use `data-theme="dark"`. An older version of these docs referenced `data-theme`; the codebase has always used the class. The `:root` and `.dark` selectors in `styles/globals.css` are what actually switch.

### What flips in dark mode

The `.dark { … }` block in `globals.css` overrides the **semantic** layer only. Primitives (`--ux-color-purple-600`, `--ux-color-neutral-200`, etc.) stay the same; what changes is which neutral fills "background", "muted", and friends.

| Semantic token | Light | Dark |
|---|---|---|
| `bg.primary` | `neutral-0` (white) | `neutral-950` |
| `bg.secondary` | `neutral-50` | `neutral-900` |
| `bg.tertiary` | `neutral-100` | `neutral-800` |
| `bg.elevated` | `neutral-0` | `neutral-900` |
| `bg.overlay` | `rgba(0,0,0,.5)` | `rgba(0,0,0,.7)` |
| `text.primary` | `neutral-950` | `neutral-0` |
| `text.secondary` | `neutral-600` | `neutral-300` |
| `text.tertiary` | `neutral-500` | `neutral-400` |
| `text.muted` | `neutral-400` | `neutral-500` |
| `text.link` | `purple-600` | `purple-400` |
| `border.default` | `neutral-200` | `neutral-800` |
| `border.strong` | `neutral-300` | `neutral-700` |
| `border.focus` | `purple-500` | `purple-400` |
| `muted` | `neutral-100` | `neutral-800` |
| `muted-foreground` | `neutral-500` | `neutral-400` |
| `accent` | `purple-100` | `neutral-800` |
| `accent-foreground` | `purple-900` | `neutral-0` |
| `popover` | `neutral-0` | `neutral-900` |
| `popover-foreground` | `neutral-950` | `neutral-0` |
| `card` | `neutral-0` | `neutral-900` |
| `card-foreground` | `neutral-950` | `neutral-0` |

The brand color stays at `purple-600` in both modes — what visually changes is the surfaces around it.

## Custom themes

A "theme" is a class that overrides whichever variables you want. Three patterns:

### 1. Brand swap (touch primitives)

The simplest re-theme: replace the purple scale with another. Every component that references purple (buttons, badges, focus rings, links, secondary surfaces) repaints.

```css
:root {
  /* Replace purple with emerald */
  --ux-color-purple-50:  #ecfdf5;
  --ux-color-purple-100: #d1fae5;
  --ux-color-purple-200: #a7f3d0;
  --ux-color-purple-300: #6ee7b7;
  --ux-color-purple-400: #34d399;
  --ux-color-purple-500: #10b981;
  --ux-color-purple-600: #059669;   /* the new brand */
  --ux-color-purple-700: #047857;
  --ux-color-purple-800: #065f46;
  --ux-color-purple-900: #064e3b;
  --ux-color-purple-950: #022c22;
}
```

Only the variable names still say "purple" — that's intentional, so you can swap brands without renaming every reference. If the misnomer bothers you, alias the names in your own stylesheet.

### 2. Surface tweak (touch semantics)

Change what "primary background" means without touching the brand:

```css
:root {
  --ux-color-bg-primary:    #fdfcff;   /* slight purple tint */
  --ux-color-bg-secondary:  #f8f4ff;
  --ux-color-card:          #fffbff;
  --ux-color-popover:       #ffffff;
}
```

### 3. Scoped theme (a class that overrides locally)

Multiple themes in one app — a `.theme-corporate` block over here, a `.theme-vibrant` over there:

```css
.theme-corporate {
  --ux-color-purple-600: #1e40af;
  --ux-color-purple-700: #1d4ed8;
  --ux-color-purple-500: #3b82f6;
}

.theme-vibrant {
  --ux-color-purple-600: #ec4899;
  --ux-color-purple-700: #db2777;
  --ux-color-purple-500: #f472b6;
}
```

```tsx
<section className="theme-corporate">
  <Button>Now blue</Button>
</section>
<section className="theme-vibrant">
  <Button>Now pink</Button>
</section>
```

Cascading rules apply: dark-mode overrides come from `.dark` if it's higher in the cascade. To make a theme that works in both modes, define overrides for both:

```css
.theme-corporate         { --ux-color-purple-600: #1e40af; }
.dark .theme-corporate   { --ux-color-purple-600: #3b82f6; }
```

## Other things you can theme

### Border radius

```css
:root {
  --ux-radius-sm: 0.375rem;
  --ux-radius-md: 0.5rem;
  --ux-radius-lg: 1rem;          /* heavier roundness on cards/dialogs */
}
```

### Shadows

```css
:root {
  --ux-shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.10);
  --ux-shadow-md:  0 6px 10px -2px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10);
  --ux-shadow-lg:  0 12px 20px -4px rgba(0,0,0,0.15), 0 4px 6px -4px rgba(0,0,0,0.10);
  --ux-shadow-2xl: 0 30px 60px -15px rgba(0,0,0,0.30);
}
```

### Spacing density

```css
/* Tighter density everywhere */
:root {
  --ux-spacing-2: 0.375rem;
  --ux-spacing-3: 0.5rem;
  --ux-spacing-4: 0.75rem;
  --ux-spacing-6: 1.125rem;
}

/* Roomier */
:root {
  --ux-spacing-4: 1.25rem;
  --ux-spacing-6: 1.875rem;
  --ux-spacing-8: 2.5rem;
}
```

### Type scale

```css
html { font-size: 17px; }   /* re-bases the whole rem-driven type scale */
```

### Responsive theming

Override per breakpoint:

```css
@media (max-width: 768px) {
  :root {
    --ux-spacing-4: 0.75rem;
    --ux-spacing-6: 1rem;
    --ux-spacing-8: 1.5rem;
    --ux-radius-lg: 0.5rem;
  }
}
```

## Switching theme at runtime

Persist the choice and apply on mount.

```tsx
"use client"
import { useEffect } from "react"

type Theme = "light" | "dark"

export function useTheme() {
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null)
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.documentElement.classList.toggle("dark", stored ? stored === "dark" : prefers)
  }, [])

  return {
    set(theme: Theme) {
      localStorage.setItem("theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    },
    toggle() {
      const next: Theme = document.documentElement.classList.contains("dark") ? "light" : "dark"
      this.set(next)
    },
  }
}
```

To avoid a flash of light theme on first paint, set the class **before** React hydrates. In Next.js this means a small inline `<script>` in `<head>` that reads localStorage and applies the class synchronously.

```html
<script>
  ;(function () {
    const t = localStorage.getItem("theme")
    const dark = t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
    if (dark) document.documentElement.classList.add("dark")
  })()
</script>
```

## Best practices

1. **Override at the right layer.** Brand → primitives. Surface meaning → semantic. One-off → Tailwind class on the component.
2. **Keep dark and light in sync.** When you add a semantic token, define it in both `:root` and `.dark`. Otherwise dark mode silently breaks.
3. **Don't theme via inline styles or `style` props on every component.** That leaks the design system through your application code. Always go through CSS variables.
4. **Test contrast** when you swap brand or surface tokens. The system ships defaults that hit WCAG AA — your overrides aren't automatic.
5. **Use a scoped theme class** rather than a JS-driven re-paint. CSS handles the cascade for free.

## See also

- [Tokens overview](../tokens/overview.md) — every variable, every layer
- [Colors](../colors/overview.md) — palettes and dark-mode mappings
- [Typography](../typography/overview.md) — fonts and scales
