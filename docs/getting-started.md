# Getting Started

This guide takes you from `pnpm add` to a working component on screen in five minutes.

## Prerequisites

- **Node 20+**, **pnpm 9+** (npm and yarn work too)
- A React 18 or 19 app (Next.js, Vite, Remix, CRA — all fine)
- **Tailwind CSS 3.4+** — the design system ships class strings; Tailwind must be configured to compile them

## 1. Install

```bash
pnpm add @ux/react @ux/tokens
pnpm add -D tailwindcss postcss autoprefixer tailwindcss-animate
```

If you don't already have Tailwind set up:

```bash
pnpm dlx tailwindcss init -p
```

## 2. Load the fonts

The system uses **Roboto Mono** for headings and **Open Sans** for body. Load them once in your global stylesheet, your `<head>`, or your framework's font loader (`next/font`, etc.):

```css
/* globals.css — add at the very top */
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap");
```

If you skip this, components still render — they just fall back to system fonts.

## 3. Load the CSS variables

Add the token sheet to your global stylesheet:

```css
/* globals.css */
@import "@ux/tokens/css";

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground font-body; }
  h1, h2, h3, h4, h5, h6 { @apply font-heading; }
}
```

`@ux/tokens/css` resolves to a single file containing the `:root { … }` and `.dark { … }` blocks with every `--ux-*` variable.

## 4. Configure Tailwind

The design system maps Tailwind theme keys (`bg-primary`, `text-foreground`, …) onto the CSS variables. Copy this `tailwind.config.ts` (or merge into yours):

```ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@ux/react/dist/**/*.js",   // ← required, so the DS classes are scanned
  ],
  theme: {
    extend: {
      colors: {
        border:      "var(--ux-color-border-default)",
        input:       "var(--ux-color-neutral-200)",
        ring:        "var(--ux-color-purple-500)",
        background:  "var(--ux-color-bg-primary)",
        foreground:  "var(--ux-color-text-primary)",
        primary: {
          DEFAULT:    "var(--ux-color-purple-600)",
          foreground: "var(--ux-color-text-on-primary)",
          50:  "var(--ux-color-purple-50)",
          100: "var(--ux-color-purple-100)",
          200: "var(--ux-color-purple-200)",
          300: "var(--ux-color-purple-300)",
          400: "var(--ux-color-purple-400)",
          500: "var(--ux-color-purple-500)",
          600: "var(--ux-color-purple-600)",
          700: "var(--ux-color-purple-700)",
          800: "var(--ux-color-purple-800)",
          900: "var(--ux-color-purple-900)",
          950: "var(--ux-color-purple-950)",
        },
        secondary: {
          DEFAULT:    "var(--ux-color-purple-100)",
          foreground: "var(--ux-color-purple-900)",
        },
        destructive: {
          DEFAULT:    "var(--ux-color-status-error)",
          foreground: "#fff",
        },
        muted: {
          DEFAULT:    "var(--ux-color-muted)",
          foreground: "var(--ux-color-muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--ux-color-accent)",
          foreground: "var(--ux-color-accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--ux-color-popover)",
          foreground: "var(--ux-color-popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--ux-color-card)",
          foreground: "var(--ux-color-card-foreground)",
        },
      },
      borderRadius: {
        sm: "var(--ux-radius-sm)",
        md: "var(--ux-radius-md)",
        lg: "var(--ux-radius-lg)",
      },
      fontFamily: {
        heading: ["var(--ux-font-family-headings)", "ui-monospace", "monospace"],
        body:    ["var(--ux-font-family-body)",    "sans-serif"],
        mono:    ["var(--ux-font-family-mono)",    "monospace"],
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up":   { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "caret-blink":    { "0%,70%,100%": { opacity: "1" }, "20%,50%": { opacity: "0" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "caret-blink":    "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

The `./node_modules/@ux/react/dist/**/*.js` glob is the easiest line to forget. Without it, Tailwind purges every class your DS uses and your components render unstyled.

## 5. First component

```tsx
import {
  Button,
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
  Badge,
  Alert, AlertTitle, AlertDescription,
} from "@ux/react"

export default function HelloPage() {
  return (
    <main className="container mx-auto p-8 space-y-6">
      <h1 className="text-4xl font-bold">Welcome</h1>

      <Card>
        <CardHeader>
          <CardTitle>Hello, world</CardTitle>
          <CardDescription>A purple-themed design system.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
          <Badge>New</Badge>
        </CardContent>
        <CardFooter>
          <Alert variant="info">
            <AlertTitle>Tip</AlertTitle>
            <AlertDescription>
              Override <code>--ux-color-purple-600</code> to retheme everything.
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
    </main>
  )
}
```

A few things to notice:

- `<Card>` is a **compound** — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` are all imported separately. There is no `title` or `description` prop.
- `<Button>` defaults to the primary purple variant. Other variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
- `<Alert>` variants are `default`, `destructive`, `success`, `warning`, `info`. There is no `primary` variant.
- `<Badge>` variants are `default`, `secondary`, `destructive`, `outline`, `purple`, `success`, `warning`, `info`. There is no `size` prop.

## 6. Dark mode

The system is wired to Tailwind's class-based dark mode. Toggle by adding the `dark` class to `<html>`:

```tsx
// Toggle on click
document.documentElement.classList.toggle("dark")

// Or follow the system preference
const mq = window.matchMedia("(prefers-color-scheme: dark)")
function apply() { document.documentElement.classList.toggle("dark", mq.matches) }
apply()
mq.addEventListener("change", apply)
```

Every semantic color (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-popover`, `bg-card`, …) flips automatically.

> **Note**: dark mode is class-based, not `data-theme`-based. A previous version of these docs said `data-theme="dark"` — that has been corrected.

## 7. Form with validation

```tsx
import { useForm } from "react-hook-form"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage,
  Input, Button,
} from "@ux/react"

type Values = { email: string }

export function SignUpForm() {
  const form = useForm<Values>({ defaultValues: { email: "" } })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => console.log(v))} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" {...field} /></FormControl>
              <FormDescription>We'll only use it to send confirmation.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign up</Button>
      </form>
    </Form>
  )
}
```

`Form` is a re-export of `FormProvider` from `react-hook-form`; `FormField` wraps `Controller`; `FormMessage` reads errors out of context automatically.

## 8. Project structure

```
ux-design-system/
├── packages/
│   ├── tokens/                      # @ux/tokens
│   │   ├── src/
│   │   │   ├── layers/
│   │   │   │   ├── primitive.ts     # raw values
│   │   │   │   ├── alias.ts         # semantic aliases
│   │   │   │   └── component.ts     # component-level tokens
│   │   │   ├── index.ts
│   │   │   └── generate-css.ts
│   │   ├── scripts/build.mjs        # tsc-based build
│   │   └── dist/                    # built artifacts (.mjs + .cjs + .d.ts + css/)
│   │
│   └── react/                       # @ux/react
│       ├── src/
│       │   ├── components/
│       │   │   ├── Button/Button.tsx
│       │   │   ├── Card/Card.tsx
│       │   │   └── …(40 components)
│       │   ├── lib/utils.ts         # the cn() helper
│       │   └── index.ts             # the barrel
│       ├── scripts/build.mjs
│       └── dist/                    # built artifacts
│
├── styles/globals.css               # :root + .dark CSS variables
├── tailwind.config.ts               # the theme that maps tokens → tailwind keys
└── docs/                            # you are here
```

## Common pitfalls

- **Components are unstyled.** Tailwind isn't scanning `node_modules/@ux/react`. Add the glob (Step 4).
- **Dark mode does nothing.** You toggled `data-theme="dark"` instead of the `dark` class. Use `document.documentElement.classList.add("dark")`.
- **Some colors look "wrong" after a brand swap.** You overrode `--ux-color-purple-500` but not `-600`. The brand color is `purple-600`; the focus ring uses `-500`; hover states use `-700`. Override the whole scale.
- **`Form` says it's not a function.** You imported the four-element shell from a previous version. Make sure you're on a build where `Form`, `FormField`, `FormControl`, `useFormField` are all exported (run `node -e "console.log(Object.keys(require('@ux/react')))"` to verify).

## Next steps

- [Token Architecture](./tokens/overview.md) — the full `--ux-*` variable map
- [Color System](./colors/overview.md) — every shade, where to use it, dark-mode pairings
- [Typography](./typography/overview.md) — sizes, weights, line heights
- [Theming](./theming/overview.md) — dark mode, brand swap, custom themes
- [Components](./components/overview.md) — per-component reference
