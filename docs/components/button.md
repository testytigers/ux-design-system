# Button

The primary interactive element. Six visual variants, four sizes, and an `asChild` prop for polymorphism.

## Import

```tsx
import {
  Button,
  buttonVariants,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `variant` | `default` · `destructive` · `outline` · `secondary` · `ghost` · `link` |
| `size` | `default` · `sm` · `lg` · `icon` |
| `asChild` | `boolean` — render via Radix `<Slot>` |

## Example

```tsx
<div className="flex flex-wrap items-center gap-2">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="link">Link</Button>
  <Button size="sm">Small</Button>
  <Button size="lg">Large</Button>
  <Button size="icon" aria-label="Settings"><SettingsIcon /></Button>
  <Button asChild><a href="/sign-in">As a link</a></Button>
</div>
```

## Source

- `packages/react/src/components/Button/Button.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
