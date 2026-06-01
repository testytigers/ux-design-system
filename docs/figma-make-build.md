# Build the UX Design System in Figma — using Figma Make

A single, drop-in spec for rebuilding the entire system inside Figma. Designed to be fed to Figma Make in stages — the staging matters because Variables → Styles → Components → Examples is a dependency chain.

> **Source of truth**: this document is derived from `styles/globals.css`, `tailwind.config.ts`, and `packages/react/src/components/**`. Any drift between Figma and code is a bug — re-export tokens via `node scripts/generate-tokens-reference.mjs` and reconcile.

---

## 0 · How to use this file

1. Open Figma and create a new file: **"UX Design System"**.
2. Open Figma Make on that file.
3. Paste the **Stage prompts** one at a time, in order. Wait for each to complete before the next.
4. After Stage 4 (Components), run the **Validation checklist** at the end. Anything that doesn't match — fix in Figma Make with a targeted prompt referencing the section number here.
5. Keep this file next to the Figma file as the spec for code reviews on either side.

**Recommended staging:**

| Stage | What gets built | Time |
|---|---|---|
| 1 | Variables — primitive scales | ~2 min |
| 2 | Variables — semantic aliases + dark-mode mode | ~3 min |
| 3 | Text Styles + Effect Styles | ~2 min |
| 4 | Components (40 in batches of ~5–8) | ~30 min |
| 5 | Demo pages (Hello / Form / Data / Overlays) | ~10 min |

---

## 1 · System overview (paste this first as context)

```
You are building a comprehensive design system in Figma named "UX Design System".

Identity:
  - Brand: purple-first. Brand color = #9333ea (purple-600).
  - Typography: Roboto Mono for headings (400/500/600/700 — monospace, geometric, technical), Open Sans for body (400/500/600/700), JetBrains Mono for code.
  - Density: comfortable; 16px base, 1.5 line-height, 4px grid (0.25rem).
  - Themes: Light (default) and Dark. Dark mode uses a class-based toggle in code; in Figma it's a Variable Mode.
  - Geometry: rounded-md (0.5rem) is the default radius; full pill for badges and avatars.

Architecture:
  - All colors, spacing, radii, font sizes, and shadows are Figma Variables.
  - Two Variable Collections: "Primitive" (raw scales) and "Semantic" (named aliases that bind to primitives).
  - Semantic has two modes: "Light" and "Dark". Primitive has a single mode.
  - Components consume Semantic variables. They do not bind to Primitive directly.
  - Component naming uses slash-separated variant matrices: Button/Default/Default, Button/Outline/Sm, etc.

Naming conventions (use exactly):
  - Variables: use --ux-* names from the codebase, prefixed with the appropriate collection (e.g. Primitive/Color/Purple/600).
  - Components: PascalCase root (Button, Card, AlertDialog).
  - Variant properties: lowercase (variant, size, state, side, orientation).
  - Variant values: lowercase (default, destructive, sm, lg, hover).

Stop when I say "stage 1 done" before moving on.
```

---

## 2 · Stage 1 — Primitive variables

Create one Variable Collection named **Primitive** with the categories below. Single mode (no dark/light at this layer). All hex values are exact.

### 2.1 · Color / Purple (11 shades)

| Name | Value |
|---|---|
| Primitive/Color/Purple/50 | `#faf5ff` |
| Primitive/Color/Purple/100 | `#f3e8ff` |
| Primitive/Color/Purple/200 | `#e9d5ff` |
| Primitive/Color/Purple/300 | `#d8b4fe` |
| Primitive/Color/Purple/400 | `#c084fc` |
| Primitive/Color/Purple/500 | `#a855f7` |
| Primitive/Color/Purple/600 | `#9333ea` |
| Primitive/Color/Purple/700 | `#7e22ce` |
| Primitive/Color/Purple/800 | `#6b21a8` |
| Primitive/Color/Purple/900 | `#581c87` |
| Primitive/Color/Purple/950 | `#3b0764` |

### 2.2 · Color / Neutral (12 shades)

| Name | Value |
|---|---|
| Primitive/Color/Neutral/0 | `#ffffff` |
| Primitive/Color/Neutral/50 | `#fafafa` |
| Primitive/Color/Neutral/100 | `#f4f4f5` |
| Primitive/Color/Neutral/200 | `#e4e4e7` |
| Primitive/Color/Neutral/300 | `#d4d4d8` |
| Primitive/Color/Neutral/400 | `#a1a1aa` |
| Primitive/Color/Neutral/500 | `#71717a` |
| Primitive/Color/Neutral/600 | `#52525b` |
| Primitive/Color/Neutral/700 | `#3f3f46` |
| Primitive/Color/Neutral/800 | `#27272a` |
| Primitive/Color/Neutral/900 | `#18181b` |
| Primitive/Color/Neutral/950 | `#09090b` |

### 2.3 · Color / Status (4 pairs)

| Name | Value |
|---|---|
| Primitive/Color/Status/Success/Default | `#16a34a` |
| Primitive/Color/Status/Success/Light | `#bbf7d0` |
| Primitive/Color/Status/Warning/Default | `#ca8a04` |
| Primitive/Color/Status/Warning/Light | `#fef08a` |
| Primitive/Color/Status/Error/Default | `#dc2626` |
| Primitive/Color/Status/Error/Light | `#fecaca` |
| Primitive/Color/Status/Info/Default | `#2563eb` |
| Primitive/Color/Status/Info/Light | `#bfdbfe` |

### 2.4 · Color / Accent (2)

| Name | Value |
|---|---|
| Primitive/Color/Accent/Primary | `#f472b6` |
| Primitive/Color/Accent/Light | `#fbcfe8` |

### 2.5 · Color / Opacity (10 black-with-alpha overlays)

| Name | Value |
|---|---|
| Primitive/Color/Opacity/5 | `rgba(0,0,0,0.05)` |
| Primitive/Color/Opacity/10 | `rgba(0,0,0,0.10)` |
| Primitive/Color/Opacity/20 | `rgba(0,0,0,0.20)` |
| Primitive/Color/Opacity/30 | `rgba(0,0,0,0.30)` |
| Primitive/Color/Opacity/40 | `rgba(0,0,0,0.40)` |
| Primitive/Color/Opacity/50 | `rgba(0,0,0,0.50)` |
| Primitive/Color/Opacity/60 | `rgba(0,0,0,0.60)` |
| Primitive/Color/Opacity/70 | `rgba(0,0,0,0.70)` |
| Primitive/Color/Opacity/80 | `rgba(0,0,0,0.80)` |
| Primitive/Color/Opacity/90 | `rgba(0,0,0,0.90)` |

### 2.6 · Spacing (px)

`16px = 1rem`. Values are in rem in code; convert to px for Figma (1 rem = 16 px).

| Name | rem | px |
|---|---|---|
| Primitive/Spacing/0 | 0 | 0 |
| Primitive/Spacing/0.5 | 0.125 | 2 |
| Primitive/Spacing/1 | 0.25 | 4 |
| Primitive/Spacing/1.5 | 0.375 | 6 |
| Primitive/Spacing/2 | 0.5 | 8 |
| Primitive/Spacing/2.5 | 0.625 | 10 |
| Primitive/Spacing/3 | 0.75 | 12 |
| Primitive/Spacing/4 | 1 | 16 |
| Primitive/Spacing/5 | 1.25 | 20 |
| Primitive/Spacing/6 | 1.5 | 24 |
| Primitive/Spacing/7 | 1.75 | 28 |
| Primitive/Spacing/8 | 2 | 32 |
| Primitive/Spacing/9 | 2.25 | 36 |
| Primitive/Spacing/10 | 2.5 | 40 |
| Primitive/Spacing/12 | 3 | 48 |
| Primitive/Spacing/14 | 3.5 | 56 |
| Primitive/Spacing/16 | 4 | 64 |
| Primitive/Spacing/20 | 5 | 80 |
| Primitive/Spacing/24 | 6 | 96 |

### 2.7 · Radius (px)

| Name | px |
|---|---|
| Primitive/Radius/None | 0 |
| Primitive/Radius/Sm | 4 |
| Primitive/Radius/Default | 6 |
| Primitive/Radius/Md | 8 |
| Primitive/Radius/Lg | 12 |
| Primitive/Radius/Xl | 16 |
| Primitive/Radius/2xl | 24 |
| Primitive/Radius/3xl | 32 |
| Primitive/Radius/Full | 9999 |

### 2.8 · Z-Index (number, used in Figma for layer order docs)

| Name | Value |
|---|---|
| Primitive/Z/Base | 0 |
| Primitive/Z/Dropdown | 1000 |
| Primitive/Z/Sticky | 1100 |
| Primitive/Z/Modal | 1200 |
| Primitive/Z/Popover | 1300 |
| Primitive/Z/Tooltip | 1400 |

### Stage 1 prompt

```
Create a Variable Collection named "Primitive" with one mode named "Default".

Add the following Color variables (group by the slashes in the name):
[paste tables 2.1 through 2.5 above]

Add the following Number variables (Spacing — units: px):
[paste table 2.6]

Add the following Number variables (Radius — units: px):
[paste table 2.7]

Add the following Number variables (Z):
[paste table 2.8]

When done, list every variable you created so I can verify the count. Expected total: 11 + 12 + 8 + 2 + 10 = 43 colors + 19 spacing + 9 radius + 6 z = 77 variables. Stop and confirm before stage 2.
```

---

## 3 · Stage 2 — Semantic variables (Light + Dark modes)

Create a second collection named **Semantic** with two modes: **Light** (default) and **Dark**. Every variable below has a value in each mode, expressed as a reference to a Primitive variable (never a raw hex).

### 3.1 · Background

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Bg/Primary | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/950 |
| Semantic/Color/Bg/Secondary | Primitive/Color/Neutral/50 | Primitive/Color/Neutral/900 |
| Semantic/Color/Bg/Tertiary | Primitive/Color/Neutral/100 | Primitive/Color/Neutral/800 |
| Semantic/Color/Bg/Subtle | Primitive/Color/Neutral/50 | Primitive/Color/Neutral/900 |
| Semantic/Color/Bg/Elevated | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/900 |
| Semantic/Color/Bg/Inverted | Primitive/Color/Neutral/950 | Primitive/Color/Neutral/0 |
| Semantic/Color/Bg/Overlay | Primitive/Color/Opacity/50 | Primitive/Color/Opacity/70 |
| Semantic/Color/Bg/Ghost | transparent | transparent |

### 3.2 · Text

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Text/Primary | Primitive/Color/Neutral/950 | Primitive/Color/Neutral/0 |
| Semantic/Color/Text/Secondary | Primitive/Color/Neutral/600 | Primitive/Color/Neutral/300 |
| Semantic/Color/Text/Tertiary | Primitive/Color/Neutral/500 | Primitive/Color/Neutral/400 |
| Semantic/Color/Text/Muted | Primitive/Color/Neutral/400 | Primitive/Color/Neutral/500 |
| Semantic/Color/Text/Inverted | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/950 |
| Semantic/Color/Text/Link | Primitive/Color/Purple/600 | Primitive/Color/Purple/400 |
| Semantic/Color/Text/OnPrimary | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/0 |
| Semantic/Color/Text/OnAccent | Primitive/Color/Neutral/950 | Primitive/Color/Neutral/950 |

### 3.3 · Border

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Border/Default | Primitive/Color/Neutral/200 | Primitive/Color/Neutral/800 |
| Semantic/Color/Border/Strong | Primitive/Color/Neutral/300 | Primitive/Color/Neutral/700 |
| Semantic/Color/Border/Subtle | Primitive/Color/Neutral/100 | Primitive/Color/Neutral/800 |
| Semantic/Color/Border/Focus | Primitive/Color/Purple/500 | Primitive/Color/Purple/400 |
| Semantic/Color/Border/Destructive | Primitive/Color/Status/Error/Default | Primitive/Color/Status/Error/Default |

### 3.4 · Shadcn-compat surfaces (these are the names components actually consume)

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Muted | Primitive/Color/Neutral/100 | Primitive/Color/Neutral/800 |
| Semantic/Color/MutedForeground | Primitive/Color/Neutral/500 | Primitive/Color/Neutral/400 |
| Semantic/Color/Accent | Primitive/Color/Purple/100 | Primitive/Color/Neutral/800 |
| Semantic/Color/AccentForeground | Primitive/Color/Purple/900 | Primitive/Color/Neutral/0 |
| Semantic/Color/Popover | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/900 |
| Semantic/Color/PopoverForeground | Primitive/Color/Neutral/950 | Primitive/Color/Neutral/0 |
| Semantic/Color/Card | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/900 |
| Semantic/Color/CardForeground | Primitive/Color/Neutral/950 | Primitive/Color/Neutral/0 |
| Semantic/Color/Input | Primitive/Color/Neutral/200 | Primitive/Color/Neutral/800 |
| Semantic/Color/Ring | Primitive/Color/Purple/500 | Primitive/Color/Purple/400 |

### 3.5 · Brand roles (the keys components reach for first)

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Primary | Primitive/Color/Purple/600 | Primitive/Color/Purple/600 |
| Semantic/Color/PrimaryForeground | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/0 |
| Semantic/Color/PrimaryHover | Primitive/Color/Purple/700 | Primitive/Color/Purple/700 |
| Semantic/Color/PrimaryActive | Primitive/Color/Purple/800 | Primitive/Color/Purple/800 |
| Semantic/Color/Secondary | Primitive/Color/Purple/100 | Primitive/Color/Neutral/800 |
| Semantic/Color/SecondaryForeground | Primitive/Color/Purple/900 | Primitive/Color/Neutral/0 |
| Semantic/Color/Destructive | Primitive/Color/Status/Error/Default | Primitive/Color/Status/Error/Default |
| Semantic/Color/DestructiveForeground | Primitive/Color/Neutral/0 | Primitive/Color/Neutral/0 |

### 3.6 · Status surfaces (paired bg + fg)

| Name | Light | Dark |
|---|---|---|
| Semantic/Color/Status/Success/Bg | Primitive/Color/Status/Success/Light | Primitive/Color/Status/Success/Default |
| Semantic/Color/Status/Success/Fg | Primitive/Color/Status/Success/Default | Primitive/Color/Status/Success/Light |
| Semantic/Color/Status/Warning/Bg | Primitive/Color/Status/Warning/Light | Primitive/Color/Status/Warning/Default |
| Semantic/Color/Status/Warning/Fg | Primitive/Color/Neutral/900 | Primitive/Color/Status/Warning/Light |
| Semantic/Color/Status/Error/Bg | Primitive/Color/Status/Error/Light | Primitive/Color/Status/Error/Default |
| Semantic/Color/Status/Error/Fg | Primitive/Color/Status/Error/Default | Primitive/Color/Status/Error/Light |
| Semantic/Color/Status/Info/Bg | Primitive/Color/Status/Info/Light | Primitive/Color/Status/Info/Default |
| Semantic/Color/Status/Info/Fg | Primitive/Color/Status/Info/Default | Primitive/Color/Status/Info/Light |

> A11y note: the `warning/fg` in Light mode uses neutral-900 rather than the warning-default (`#ca8a04` on `#fef08a`) because the latter fails WCAG AA contrast at small sizes.

### Stage 2 prompt

```
Create a Variable Collection named "Semantic" with two modes: "Light" (default) and "Dark".

For each variable below, set its value in BOTH modes to a reference to the corresponding Primitive variable — never a raw hex.

[paste tables 3.1 through 3.6]

Bind transparent for Bg/Ghost in both modes by leaving alpha at 0.

When done, switch the mode to Dark on a test rectangle bound to Semantic/Color/Bg/Primary and confirm it goes black. Stop and confirm before stage 3.
```

---

## 4 · Stage 3 — Text Styles + Effect Styles

### 4.1 · Text Styles

Name format: `Text/<scale>/<weight>` (e.g. `Text/Lg/Semibold`). Headings use Roboto Mono (monospace); body uses Open Sans.

| Style | Font | Size px | Weight | Line height | Letter spacing |
|---|---|---|---|---|---|
| Text/H1 | Roboto Mono | 36 | 700 | 1.25 (45) | -0.025em |
| Text/H2 | Roboto Mono | 30 | 600 | 1.25 (37.5) | -0.025em |
| Text/H3 | Roboto Mono | 24 | 600 | 1.25 (30) | 0 |
| Text/H4 | Roboto Mono | 20 | 600 | 1.25 (25) | 0 |
| Text/Display/Lg | Roboto Mono | 48 | 700 | 1.25 (60) | -0.025em |
| Text/Display/Xl | Roboto Mono | 36 | 700 | 1.25 (45) | -0.025em |
| Text/Body/Lg | Open Sans | 18 | 400 | 1.5 (27) | 0 |
| Text/Body/Base | Open Sans | 16 | 400 | 1.5 (24) | 0 |
| Text/Body/Sm | Open Sans | 14 | 400 | 1.5 (21) | 0 |
| Text/Body/Xs | Open Sans | 12 | 400 | 1.5 (18) | 0 |
| Text/Label/Medium | Open Sans | 14 | 500 | 1.0 (14) | 0 |
| Text/Label/Small | Open Sans | 12 | 500 | 1.0 (12) | 0.025em |
| Text/Caption | Open Sans | 12 | 400 | 1.5 (18) | 0 |
| Text/Button | Open Sans | 14 | 500 | 1.0 (14) | 0 |
| Text/Code/Sm | JetBrains Mono | 13 | 400 | 1.5 (19.5) | 0 |
| Text/Code/Base | JetBrains Mono | 14 | 400 | 1.5 (21) | 0 |

### 4.2 · Effect Styles (shadows)

| Style | Effects |
|---|---|
| Shadow/Sm | `0 1px 2px 0 rgba(0,0,0,0.05)` |
| Shadow/Md | `0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)` |
| Shadow/Lg | `0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)` |
| Shadow/Xl | `0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)` |
| Shadow/2xl | `0 25px 50px -12px rgba(0,0,0,0.25)` |
| Shadow/Inner | `inset 0 2px 4px 0 rgba(0,0,0,0.05)` |
| Shadow/Focus | `0 0 0 2px Semantic/Color/Ring (offset 2px)` |
| Shadow/Glow | `0 0 20px rgba(147,51,234,0.3), 0 0 40px rgba(147,51,234,0.1)` |

### Stage 3 prompt

```
Create the Text Styles in section 4.1. Use exact font, size, weight, line-height (px), letter-spacing.

Create the Effect Styles in section 4.2. Shadow/Focus uses the Ring variable from Semantic — bind it.

Stop and confirm before stage 4.
```

---

## 5 · Stage 4 — Components

The 40 components, grouped by category. For each component I give: variants & sizes, exact dimensions, layout, and the semantic tokens to bind. Build them in the order below — later components consume earlier ones.

### 5.0 · Build order

1. **Primitives**: Button, Badge, Input, Label, Textarea, Separator, Skeleton, Switch, Checkbox, Slider, RadioGroup, Toggle, Progress, Avatar, AspectRatio
2. **Composed primitives**: Card, Alert, Tooltip, Popover, HoverCard
3. **Forms**: Form (FormItem/FormLabel/FormControl/FormDescription/FormMessage), Select, InputOTP
4. **Overlays**: Dialog, Sheet, DropdownMenu, ContextMenu, Menubar
5. **Navigation**: Tabs, Accordion, NavigationMenu, Pagination
6. **Data**: Table, Calendar, Charts, Carousel, Command
7. **Layout**: Resizable, ScrollArea
8. **Notifications**: Toast

### 5.1 · Button

- Variant property: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- Size property: `default`, `sm`, `lg`, `icon`
- State property: `default`, `hover`, `focus`, `active`, `disabled`

Layout (auto-layout, horizontal):
- Gap: 8px (Spacing/2)
- Default size: height 36px, padding-x 16px, padding-y 8px
- Sm: height 32px, padding-x 12px, font-size 12 (`Text/Body/Xs`)
- Lg: height 40px, padding-x 32px
- Icon: 36×36
- Radius: 6 (Primitive/Radius/Default → Radius/Md in code)
- Text style: `Text/Button`

Bindings:
| Variant | Fill | Text | Border | Hover Fill |
|---|---|---|---|---|
| default | Semantic/Color/Primary | Semantic/Color/PrimaryForeground | none | Semantic/Color/PrimaryHover |
| destructive | Semantic/Color/Destructive | Semantic/Color/DestructiveForeground | none | Semantic/Color/Destructive (90% alpha) |
| outline | Semantic/Color/Bg/Primary | Semantic/Color/Text/Primary | 1px Semantic/Color/Input | Semantic/Color/Accent |
| secondary | Semantic/Color/Secondary | Semantic/Color/SecondaryForeground | none | Semantic/Color/Secondary (80% alpha) |
| ghost | transparent | Semantic/Color/Text/Primary | none | Semantic/Color/Accent |
| link | transparent | Semantic/Color/Primary | none | underline |

Focus: 2px outline using `Shadow/Focus`. Disabled: 50% opacity, pointer none.

### 5.2 · Badge

- Variant: `default`, `secondary`, `destructive`, `outline`, `purple`, `success`, `warning`, `info`
- No size property (single size).
- Layout: padding 10px × 2px (`px-2.5 py-0.5` in code), radius 6 (Sm), gap 4px, text style `Text/Label/Small`.

| Variant | Fill | Text | Border |
|---|---|---|---|
| default | Semantic/Color/Primary | Semantic/Color/PrimaryForeground | transparent |
| secondary | Semantic/Color/Secondary | Semantic/Color/SecondaryForeground | transparent |
| destructive | Semantic/Color/Destructive | Semantic/Color/DestructiveForeground | transparent |
| outline | transparent | Semantic/Color/Text/Primary | 1px Semantic/Color/Border/Default |
| purple | Primitive/Color/Purple/100 | Primitive/Color/Purple/700 | transparent |
| success | Semantic/Color/Status/Success/Bg | Semantic/Color/Status/Success/Fg | transparent |
| warning | Semantic/Color/Status/Warning/Bg | Semantic/Color/Status/Warning/Fg | transparent |
| info | Semantic/Color/Status/Info/Bg | Semantic/Color/Status/Info/Fg | transparent |

### 5.3 · Input

Single variant. States: `default`, `focus`, `disabled`, `error`.

Layout: height 36px, padding-x 12px, padding-y 4px, radius 6, border 1px `Semantic/Color/Input`, fill `Semantic/Color/Bg/Primary`, text `Text/Body/Sm`, placeholder `Semantic/Color/Text/Muted`.
Focus: ring 2px `Semantic/Color/Ring`, offset 2px.

### 5.4 · Textarea

Same surface as Input but multi-line. Min height: 80px. Padding 12px × 8px.

### 5.5 · Label

Text style `Text/Label/Medium`, color `Semantic/Color/Text/Primary`. No padding; line-height 1.0.

### 5.6 · Checkbox

Size: 16×16. Radius 4. Border 1px `Semantic/Color/Border/Default`. Background `transparent`.
Checked state: fill `Semantic/Color/Primary`, check icon white (lucide `Check`), 12×12.
Focus: ring as Input.

### 5.7 · RadioGroup

`RadioGroupItem`: 16×16 circle. Border 1px `Semantic/Color/Border/Default`. Checked state: 4×4 inner dot fill `Semantic/Color/Primary`.

### 5.8 · Switch

Track: 36×20 rounded-full. Off: fill `Semantic/Color/Input`. On: fill `Semantic/Color/Primary`. Knob: 16×16 white circle with `Shadow/Sm`, slides 16px on toggle.

### 5.9 · Slider

Track: full width × 4px, fill `Semantic/Color/Bg/Tertiary`. Active range: fill `Semantic/Color/Primary`. Thumb: 20×20 circle, fill `Semantic/Color/Bg/Primary`, border 2px `Semantic/Color/Primary`, `Shadow/Sm`.

### 5.10 · Toggle

Variant: `default`, `outline`. Size: `default` (h-36), `sm` (h-32), `lg` (h-40).
Pressed state: fill `Semantic/Color/Accent`, text `Semantic/Color/AccentForeground`.

### 5.11 · Progress

Container: full width × 8px, radius 9999 (full), fill `Semantic/Color/Bg/Tertiary`.
Fill bar: width = value%, height 8, fill `Semantic/Color/Primary`.

### 5.12 · Avatar

Sizes: sm (32), md (40), lg (48), xl (64). Circle. Image fill or fallback initials in `Text/Label/Medium` centered, bg `Semantic/Color/Muted`, text `Semantic/Color/MutedForeground`.

### 5.13 · AspectRatio

Frame component with `ratio` number property. Common values: `16/9`, `4/3`, `1/1`, `21/9`.

### 5.14 · Skeleton

Rounded rectangle, fill `Semantic/Color/Muted`, plus a shimmer animation (in Figma: smart-animate variant pulse).

### 5.15 · Separator

Variant: `horizontal` (height 1, full width), `vertical` (width 1, full height). Fill `Semantic/Color/Border/Default`.

### 5.16 · Card (compound)

Container: bg `Semantic/Color/Card`, text `Semantic/Color/CardForeground`, radius 12 (Radius/Lg), border 1px `Semantic/Color/Border/Default`, `Shadow/Sm`. Padding 0 (subparts add their own).

Subparts:
- `Card/Header`: vertical auto-layout, gap 6, padding 24.
- `Card/Title`: text style `Text/H4` (semibold).
- `Card/Description`: text style `Text/Body/Sm`, color `Semantic/Color/MutedForeground`.
- `Card/Content`: padding 24, padding-top 0.
- `Card/Footer`: horizontal auto-layout, padding 24, padding-top 0, align-items center.

### 5.17 · Alert (compound)

Variant: `default`, `destructive`, `success`, `warning`, `info`. Radius 12 (Lg). Padding 16 × 12. Border 1px. Auto-layout horizontal, gap 12, icon size 16.

| Variant | Border | Text | Icon | Icon (lucide) |
|---|---|---|---|---|
| default | Semantic/Color/Border/Default | Semantic/Color/Text/Primary | Semantic/Color/Text/Primary | Info |
| destructive | Semantic/Color/Destructive (50%) | Semantic/Color/Destructive | Semantic/Color/Destructive | AlertCircle |
| success | Primitive/Color/Status/Success/Default (50%) | Primitive/Color/Status/Success/Default | same | CheckCircle2 |
| warning | Primitive/Color/Status/Warning/Default (50%) | Primitive/Color/Status/Warning/Default | same | TriangleAlert |
| info | Primitive/Color/Status/Info/Default (50%) | Primitive/Color/Status/Info/Default | same | Info |

Subparts: `Alert/Title` (`Text/Label/Medium`, mb 4), `Alert/Description` (`Text/Body/Sm`).

### 5.18 · Tooltip

Container: bg `Semantic/Color/Bg/Inverted`, text `Semantic/Color/Text/Inverted`, padding 12 × 6, radius 4 (Sm), text style `Text/Body/Xs`. Z-index 1400.

### 5.19 · Popover

Container: bg `Semantic/Color/Popover`, text `Semantic/Color/PopoverForeground`, border 1px `Semantic/Color/Border/Default`, radius 8 (Md), `Shadow/Lg`, padding 16. Z-index 1300.

### 5.20 · HoverCard

Identical surface to Popover. Triggered by hover instead of click — visual is the same.

### 5.21 · Form (compound)

A primitive-less wrapper. Sub-components:
- `Form/Item`: vertical auto-layout, gap 8.
- `Form/Label`: same as Label, plus `data-error="true"` state (color `Semantic/Color/Destructive`).
- `Form/Control`: the wrapped field; no visuals of its own.
- `Form/Description`: text style `Text/Body/Xs`, color `Semantic/Color/MutedForeground`.
- `Form/Message`: text style `Text/Body/Xs`, color `Semantic/Color/Destructive`. Shows on error state.

### 5.22 · Select

`SelectTrigger`: same shape as Input + a `ChevronDown` icon on the right (16×16).
`SelectContent`: same shape as Popover. Max height 384, scrollable.
`SelectItem`: padding 8 × 6, radius 4. Hover: bg `Semantic/Color/Accent`, fg `Semantic/Color/AccentForeground`. Selected: ✓ on the left (lucide Check).

### 5.23 · InputOTP

`InputOTPGroup`: horizontal auto-layout, gap 0.
`InputOTPSlot`: 40×40, border 1px `Semantic/Color/Input`, text style `Text/Body/Sm` centered. First in group: rounded-left-md. Last: rounded-right-md. Active state: ring 2px `Semantic/Color/Ring`.
`InputOTPSeparator`: a single `Dot` icon (lucide), 16×16, color `Semantic/Color/Text/Muted`.

### 5.24 · Dialog

`Dialog/Overlay`: full viewport, fill `Semantic/Color/Bg/Overlay`, backdrop-blur. Z 1200.
`Dialog/Content`: centered, max-width 512, bg `Semantic/Color/Bg/Primary`, border 1px, radius 12, padding 24, `Shadow/Lg`. Close button (lucide X, 16×16) top-right.
`Dialog/Header`: gap 6.
`Dialog/Title`: `Text/H4`.
`Dialog/Description`: `Text/Body/Sm` color `Semantic/Color/MutedForeground`.
`Dialog/Footer`: horizontal auto-layout, gap 8, justify-end.

### 5.25 · Sheet

Same surface as Dialog content, but pinned to one edge.

`side` property: `top`, `right` (default), `bottom`, `left`.
- right/left: width 384 (or 384/2 = w-3/4 max-w-sm), full height
- top/bottom: full width, auto height

### 5.26 · DropdownMenu

`DropdownMenuContent`: same as Popover, min-width 128, padding 4.
`DropdownMenuItem`: padding 8 × 6, radius 4, gap 8, text `Text/Body/Sm`. Hover: bg `Semantic/Color/Accent`. Property `inset`: when true, pad-left 32.
`DropdownMenuLabel`: padding 8 × 6, text `Text/Label/Small`, color `Semantic/Color/Text/Primary`.
`DropdownMenuSeparator`: height 1, fill `Semantic/Color/Border/Default`, margin-y 4.
`DropdownMenuShortcut`: right-aligned `Text/Body/Xs`, color `Semantic/Color/MutedForeground`.

### 5.27 · ContextMenu

Identical surface to DropdownMenu. Trigger is a wrapper element; visual content is the menu only.

### 5.28 · Menubar

Horizontal auto-layout container with multiple `MenubarMenu` triggers, each opening a dropdown of the same surface as DropdownMenuContent. Trigger: padding 12 × 6, radius 4, hover bg `Semantic/Color/Accent`.

### 5.29 · Tabs

`TabsList`: horizontal auto-layout, gap 4, padding 4, radius 8, bg `Semantic/Color/Muted`.
`TabsTrigger`: padding 12 × 4, radius 6, text `Text/Body/Sm`. Inactive: text `Semantic/Color/MutedForeground`. Active: fill `Semantic/Color/Bg/Primary`, text `Semantic/Color/Text/Primary`, `Shadow/Sm`.
`TabsContent`: padding-top 8.

### 5.30 · Accordion

`AccordionItem`: full width, border-bottom 1px `Semantic/Color/Border/Default`.
`AccordionTrigger`: horizontal auto-layout, padding 16 × 0, between-content, text `Text/Body/Base`, weight medium, chevron 16×16 right. Hover: underline.
`AccordionContent`: text `Text/Body/Sm`, padding-bottom 16. Animates open/closed.

### 5.31 · NavigationMenu

`NavigationMenuList`: horizontal auto-layout, gap 4.
`NavigationMenuItem`: contains a Trigger and Content.
`NavigationMenuTrigger`: padding 12 × 8, radius 6, text `Text/Body/Sm`, weight medium. Hover: bg `Semantic/Color/Accent`.
`NavigationMenuContent`: large absolutely-positioned panel; bg `Semantic/Color/Popover`, border, radius 8, `Shadow/Lg`, padding 16.

### 5.32 · Pagination

Horizontal auto-layout, gap 4.
`PaginationLink`: 36×36 (icon button shape). `isActive` boolean: outline variant when true, ghost when false.
`PaginationPrevious` / `PaginationNext`: wider, icon + label (`ChevronLeft` / `ChevronRight` lucide), padding 10 × 0.
`PaginationEllipsis`: 36×36 with `MoreHorizontal` icon, color `Semantic/Color/Text/Muted`.

### 5.33 · Table

`Table`: full width, text `Text/Body/Sm`.
`TableHeader`: row with TH cells, padding 16 × 12, font `Text/Label/Medium`, color `Semantic/Color/MutedForeground`, border-bottom 1px.
`TableRow`: border-bottom 1px `Semantic/Color/Border/Default`. Hover: bg `Semantic/Color/Muted`.
`TableCell`: padding 16 × 12.
`TableCaption`: padding-top 16, text `Text/Body/Sm`, color `Semantic/Color/MutedForeground`.

### 5.34 · Calendar

Container: padding 12, bg `Semantic/Color/Popover`.
Month caption: text `Text/Label/Medium`, with prev/next buttons (32×32 outline-button-like, chevron icons).
Weekday row: text `Text/Body/Xs`, color `Semantic/Color/MutedForeground`.
Day cell: 36×36, radius 6, text `Text/Body/Sm`. Selected: bg `Semantic/Color/Primary`, text `Semantic/Color/PrimaryForeground`. Today: bg `Semantic/Color/Accent`. Outside: 50% opacity.

### 5.35 · Charts

A `ChartContainer` frame (aspect 16/9, padding 16). Place a chart artwork — bar, line, or pie — using `Primitive/Color/Purple/600` for the series, `Semantic/Color/Border/Default` for the grid.
`ChartTooltipContent`: same surface as Popover, padding 8.
`ChartLegendContent`: horizontal flex, gap 16, each item with a 12×12 swatch + text.

### 5.36 · Carousel

`Carousel`: container with horizontal scroll snap.
`CarouselContent`: horizontal auto-layout, gap 16.
`CarouselItem`: variable width.
`CarouselPrevious` / `CarouselNext`: 32×32 icon buttons (outline variant), positioned -48px from the edge, vertically centered. Vertical orientation: rotated 90° at top/bottom.

### 5.37 · Command

A specialised dialog.
`CommandInput`: text-input row with `Search` icon (lucide) on the left, padding 12 × 12, border-bottom 1px.
`CommandList`: scrollable, max-height 300.
`CommandGroup`: heading is `Text/Label/Small`, padding 8 × 6.
`CommandItem`: padding 8 × 6, radius 4, gap 8. Hover/active: bg `Semantic/Color/Accent`.
`CommandSeparator`: as DropdownMenuSeparator.
`CommandShortcut`: as DropdownMenuShortcut.

### 5.38 · ResizablePanelGroup

`Group`: horizontal or vertical auto-layout (direction property).
`Panel`: bg `Semantic/Color/Bg/Primary`, default flex 1.
`Handle`: width 1 (horizontal direction) / height 1 (vertical), bg `Semantic/Color/Border/Default`. With `withHandle` boolean: render a 12×4 grip nub centered.

### 5.39 · ScrollArea

Container with custom scrollbar. Track: 12 wide, fill `Semantic/Color/Bg/Subtle`. Thumb: 8 wide, fill `Semantic/Color/Border/Strong`, radius 4.

### 5.40 · Toast

`Toast`: horizontal auto-layout, padding 16, gap 16, bg `Semantic/Color/Bg/Primary`, border 1px `Semantic/Color/Border/Default`, radius 8 (Md), `Shadow/Lg`. Close icon (X) top-right.
`ToastTitle`: `Text/Label/Medium`.
`ToastDescription`: `Text/Body/Sm`, color `Semantic/Color/MutedForeground`.
`ToastAction`: 32-high Button (sm) tucked to the right.

### Stage 4 prompts (one per batch)

```
BATCH 1 (primitives). Build the following components per section 5.0 item 1.
For each:
  - Create a frame with auto-layout matching the spec.
  - Add Variant and Size component properties as listed.
  - Bind every fill/stroke/text to the Semantic variables I listed — never raw hex.
  - Add a State property where applicable (default/hover/focus/active/disabled) and create the corresponding variant frames.
  - Use the Text Styles created in stage 3 for every text node.
  - Add a small example to the right of each component showing all variant × size combinations.

[paste sections 5.1 — 5.15 of this doc]

Stop and confirm before BATCH 2.
```

Repeat the pattern for batches 2–6, pasting the corresponding component spec sections.

---

## 6 · Stage 5 — Demo pages

Once components exist, build four demo frames that prove the system works end-to-end:

### 6.1 · "Hello" page (Card + Button + Badge + Alert)

A 768-wide centered frame. Card containing:
- Title "Welcome"
- Description "A purple-themed design system"
- A button row (default + outline)
- A row of badges (purple, success, info)
- An Alert (variant=info) at the bottom

### 6.2 · "Form" page (Form + Input + Label + Button + react-hook-form aesthetic)

A 480-wide vertical auto-layout. Three fields:
- Email — Input
- Password — Input (type=password)
- Country — Select with 5 items
A submit Button at the bottom. Show one field with an error state (Form/Message visible, red).

### 6.3 · "Data" page (Table + Pagination + Badge)

A 960-wide frame. Table with 5 rows × 4 columns (Invoice ID, Status (badge), Customer, Amount). Pagination at the bottom-right.

### 6.4 · "Overlays" page (Dialog + Sheet + Popover + DropdownMenu)

A grid of four cells, each showing one overlay component in its opened state. Include the Trigger element above each opened state.

### Stage 5 prompt

```
Create 4 frames named "Demo/Hello", "Demo/Form", "Demo/Data", "Demo/Overlays" per section 6.1–6.4.

Use only the components built in stage 4 — do not redraw anything inline. For every text node, bind a Text Style; for every fill, bind a Semantic variable. Put both Light and Dark mode versions side-by-side (use the Semantic collection mode switcher on the frame).
```

---

## 7 · Stage 6 — Validation checklist

After Figma Make finishes, walk through this list. Anything that fails — issue a fix prompt referencing the section number.

### 7.1 · Variables

- [ ] Primitive collection exists with 1 mode, 77 variables (43 colors + 19 spacing + 9 radius + 6 z).
- [ ] Semantic collection exists with 2 modes (Light, Dark).
- [ ] Every Semantic variable resolves to a Primitive variable in BOTH modes (no raw hex).
- [ ] Switching the Semantic mode on a test rectangle bound to `Bg/Primary` toggles white ↔ near-black.
- [ ] `Color/Ring` differs between Light (purple-500) and Dark (purple-400).
- [ ] `Status/Warning/Fg` in Light = neutral-900 (NOT warning-default — contrast fix).

### 7.2 · Text & Effect Styles

- [ ] 16 Text Styles exist with the exact families and sizes in section 4.1.
- [ ] Open Sans body weights 400/500/600/700 are all loaded.
- [ ] Roboto Mono heading weights 400/500/600/700 are all loaded.
- [ ] 8 Effect Styles exist; Shadow/Focus is bound to `Semantic/Color/Ring`.

### 7.3 · Components

- [ ] 40 root components present (count the list in section 5).
- [ ] Every component uses Semantic variables — open one and check that no fill or stroke has a raw color.
- [ ] Variant matrices match the code: Button has 6 variants × 4 sizes × 5 states.
- [ ] Badge has 8 variants, no size property.
- [ ] Alert has 5 variants, icons match (default→Info, destructive→AlertCircle, success→CheckCircle2, warning→TriangleAlert, info→Info).
- [ ] Card has 6 sub-components (Header/Title/Description/Content/Footer + root), NO `title`/`description` properties.
- [ ] Sheet has a `side` property with 4 options, default `right`.
- [ ] Carousel has `orientation` with 2 options.
- [ ] Toggle has `variant` (default/outline) and `size` (default/sm/lg) properties.

### 7.4 · Accessibility

- [ ] Every interactive component has a Focus state with a 2px ring using `Shadow/Focus`.
- [ ] Run Figma's contrast checker on each Badge variant against Bg/Primary in both modes. Anything below 4.5:1 for body text or 3:1 for large text → fix the binding.
- [ ] Status/Warning text against Status/Warning/Bg in Light mode is neutral-900, not warning-default.

### 7.5 · Demo pages

- [ ] All four demo pages render in both Light and Dark mode with no broken bindings.
- [ ] Form/Message error state is visible only on the error variant.
- [ ] Dialog/Overlay shows the correct overlay color in both modes (50% in Light, 70% in Dark).

---

## 8 · Naming conventions cheat sheet

| Thing | Pattern | Example |
|---|---|---|
| Variable collection | `Primitive` / `Semantic` | `Semantic` |
| Variable | `Category/Subcategory/Name` | `Semantic/Color/Bg/Primary` |
| Variable mode | Title case | `Light`, `Dark` |
| Text Style | `Text/<Scale>/<Weight?>` | `Text/Body/Sm`, `Text/H1` |
| Effect Style | `Shadow/<Size>` | `Shadow/Lg`, `Shadow/Focus` |
| Component | `PascalCase` | `Button`, `AlertDialog` |
| Component subpart | `Component/Subpart` | `Card/Header`, `Dialog/Footer` |
| Variant property | `lowercase` | `variant`, `size`, `state`, `side`, `orientation` |
| Variant value | `lowercase` | `default`, `destructive`, `sm` |
| Boolean property | `lowercase` | `inset`, `withHandle`, `isActive` |
| Page | `Demo/<Name>` | `Demo/Hello` |

---

## 9 · Reverse direction (Figma → code)

When the Figma file changes:

1. Export the Primitive collection as Variables JSON.
2. Diff against `styles/globals.css`. Anything new → add to `:root` and `.dark`.
3. Run `node scripts/generate-tokens-reference.mjs` to update `docs/tokens/reference.md`.
4. If a component's variants changed, update the matching `cva({ variants: … })` block in `packages/react/src/components/<Name>/<Name>.tsx` and run `node scripts/generate-component-docs.mjs`.

This is the contract: **`globals.css` is canonical for runtime, Figma Variables are canonical for design**, and both reflect the same primitives.

---

## 10 · One-shot mega-prompt (if Figma Make supports a single long input)

If you'd rather feed everything at once instead of staging, concatenate sections 1, 2, 3, 4, 5.0–5.40, 6.1–6.4, and 7.1–7.5, and prepend:

```
Build the entire design system below in this Figma file, in order: Variables → Styles → Components → Demo pages → Validation. Do NOT use any raw hex colors in component frames — bind every fill, stroke, and text color to a Semantic variable. After each top-level section, stop and list what you created so I can verify. Begin.
```

Staged is safer; one-shot is faster. Pick based on your Figma Make tier and your patience.

---

*Companion docs:*
- [Token reference](./tokens/reference.md) — every `--ux-*` variable enumerated
- [Component overview](./components/overview.md) — per-component pages
- [Theming](./theming/overview.md) — dark mode mechanics
- [CHANGELOG](../CHANGELOG.md) — what's changed
