# Badge

Compact label for status, tag, and counts.

## Import

```tsx
import {
  Badge,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `variant` | `default` · `secondary` · `destructive` · `outline` · `purple` · `success` · `warning` · `info` |

## Example

```tsx
<div className="flex flex-wrap gap-2">
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="purple">Purple</Badge>
  <Badge variant="success">Active</Badge>
  <Badge variant="warning">Pending</Badge>
  <Badge variant="info">Note</Badge>
  <Badge variant="destructive">Error</Badge>
  <Badge variant="outline">Tag</Badge>
</div>
```

## Source

- `packages/react/src/components/Badge/Badge.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
