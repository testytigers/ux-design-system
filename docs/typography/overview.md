# Typography

The system pairs a monospace heading with a humanist sans body — a deliberate, technical voice for headings, kept readable by an Open Sans body that does the heavy lifting at small sizes.

> **Note on the heading family**: Roboto Mono is monospace. JetBrains Mono (also monospace) is the code family. Two monospaces in one system is a strong stylistic choice — geometric, slightly retro-technical. If you want a softer hierarchy, swap `--ux-font-family-headings` to a slab/serif of your choosing (see [Theming](../theming/overview.md)); nothing else in the system needs to change.

## Font families

| Family | Font | Tailwind class | CSS variable |
|---|---|---|---|
| Headings | **Roboto Mono** (monospace) | `font-heading` | `--ux-font-family-headings` |
| Body | **Open Sans** (sans-serif) | `font-body` | `--ux-font-family-body` |
| Code | **JetBrains Mono** (monospace) | `font-mono` | `--ux-font-family-mono` |
| System fallback | `system-ui, -apple-system, sans-serif` | (no class — use `font-body` and let it fall back) | `--ux-font-family-system` |

The base body class in `globals.css` applies `font-body` to `<body>` and `font-heading` to `<h1>`–`<h6>`, so most of the time you don't have to think about families.

```tsx
<h1>Roboto Mono automatically</h1>
<p>Open Sans automatically</p>
<code className="font-mono">JetBrains Mono on demand</code>
```

> **Heads up**: Tailwind classes are `font-heading` / `font-body` (singular). The CSS variables are `--ux-font-family-headings` / `--ux-font-family-body` (plural for headings — historical). Both are correct in their respective scopes.

## Loading the fonts

Components don't bundle the fonts. Load them once:

```css
/* globals.css — at the top */
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap");
```

Or, if you're on Next.js:

```tsx
import { Roboto_Mono, Open_Sans } from "next/font/google"

const heading = Roboto_Mono({ subsets: ["latin"], variable: "--ux-font-family-headings" })
const body    = Open_Sans({  subsets: ["latin"], variable: "--ux-font-family-body" })

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

If you skip loading, the system falls back to `ui-monospace, monospace` for headings and `sans-serif` for body. Components still render — just without the brand voice.

## Sizes

| Token | Variable | Size | Recommended use |
|---|---|---|---|
| `xs` | `--ux-font-size-xs` | `0.75rem` (12px) | Badges, captions, footnotes |
| `sm` | `--ux-font-size-sm` | `0.875rem` (14px) | Buttons (default), small body, table cells |
| `base` | `--ux-font-size-base` | `1rem` (16px) | Body text |
| `lg` | `--ux-font-size-lg` | `1.125rem` (18px) | Large body, lead paragraphs |
| `xl` | `--ux-font-size-xl` | `1.25rem` (20px) | Card titles, sub-section headings |
| `2xl` | `--ux-font-size-2xl` | `1.5rem` (24px) | Section headings (h3) |
| `3xl` | `--ux-font-size-3xl` | `1.875rem` (30px) | Page sub-headings (h2) |
| `4xl` | `--ux-font-size-4xl` | `2.25rem` (36px) | Page titles (h1) |
| `5xl` | `--ux-font-size-5xl` | `3rem` (48px) | Hero headlines |

Use Tailwind: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`.

## Weights

| Token | Variable | Weight | Use |
|---|---|---|---|
| `normal` | `--ux-font-weight-normal` | `400` | Body text |
| `medium` | `--ux-font-weight-medium` | `500` | Buttons, labels, table headers |
| `semibold` | `--ux-font-weight-semibold` | `600` | Card titles, h2/h3 |
| `bold` | `--ux-font-weight-bold` | `700` | h1, hero copy, emphasis |

Tailwind: `font-normal`, `font-medium`, `font-semibold`, `font-bold`.

Roboto Mono and Open Sans are both loaded with weights 400/500/600/700 by default. If you don't load all four, browsers will simulate weights and your headings will look slightly off.

## Line heights

| Token | Variable | Value | Use |
|---|---|---|---|
| `tight` | `--ux-line-height-tight` | `1.25` | Headings, short labels |
| `normal` | `--ux-line-height-normal` | `1.5` | Body text, default |
| `relaxed` | `--ux-line-height-relaxed` | `1.75` | Long-form copy, articles |

Tailwind: `leading-tight`, `leading-normal`, `leading-relaxed`.

## Letter spacing

| Token | Variable | Value | Use |
|---|---|---|---|
| `tight` | `--ux-letter-spacing-tight` | `-0.025em` | Large headings (40px+) |
| `normal` | `--ux-letter-spacing-normal` | `0em` | Default |
| `wide` | `--ux-letter-spacing-wide` | `0.025em` | All-caps labels, badges |

Tailwind: `tracking-tight`, `tracking-normal`, `tracking-wide`.

## Composing type styles

There's no `Heading` or `Text` component — use the semantic HTML tag plus utility classes. A few standard recipes:

```tsx
{/* h1: page title */}
<h1 className="text-4xl font-bold tracking-tight">Page title</h1>

{/* h2: section header */}
<h2 className="text-3xl font-semibold tracking-tight mt-12 mb-4">Section</h2>

{/* h3: subsection */}
<h3 className="text-2xl font-semibold mt-8 mb-3">Subsection</h3>

{/* body */}
<p className="text-base leading-relaxed text-foreground">Body copy.</p>

{/* small / muted */}
<p className="text-sm text-muted-foreground">Caption or metadata.</p>

{/* label */}
<label className="text-sm font-medium leading-none">Label text</label>

{/* code */}
<code className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">value</code>
```

## Full example

```tsx
export function Article() {
  return (
    <article className="container mx-auto max-w-prose py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Article Title
      </h1>

      <p className="text-sm text-muted-foreground mb-8">
        By John Doe · March 15, 2024
      </p>

      <h2 className="text-2xl font-semibold tracking-tight mt-12 mb-3">
        Section Heading
      </h2>

      <p className="text-base leading-relaxed mb-4">
        Body text uses Open Sans for readability at small sizes; headings
        use Roboto Mono for a deliberate, technical voice.
      </p>

      <pre className="font-mono text-sm bg-muted text-muted-foreground p-3 rounded-md mt-4">
        const code = "JetBrains Mono"
      </pre>
    </article>
  )
}
```

## Customising

To replace the font families globally, override the variables:

```css
:root {
  --ux-font-family-headings: "Crimson Pro", Georgia, serif;
  --ux-font-family-body:     "Inter", system-ui, sans-serif;
  --ux-font-family-mono:     "Fira Code", monospace;
}
```

To rescale the type system:

```css
:root {
  --ux-font-size-base: 1.0625rem;   /* 17px instead of 16px */
  --ux-font-size-sm:   0.9375rem;
  --ux-font-size-lg:   1.1875rem;
}
```

The whole scale is relative to `rem`, so consider scaling at the `<html>` level instead:

```css
html { font-size: 17px; }   /* every rem-based token grows proportionally */
```

## Best practices

1. **Trust the defaults.** `<body>` already has `font-body`; `<h1>`–`<h6>` already have `font-heading`. Don't re-declare unless you mean to.
2. **Avoid mid-scale sizes** like `text-[15px]`. If you need a size that's not in the scale, the scale probably needs adjusting.
3. **Use `font-medium` for buttons and labels.** That's the convention components ship with; mixing weights in interactive UI looks accidental.
4. **`leading-tight` for headings, `leading-relaxed` for long copy.** Don't mix.
5. **Don't combine `tracking-wide` with body text.** It's for short, all-caps labels — never paragraph text.
