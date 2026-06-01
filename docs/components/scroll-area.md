# Scroll Area

See [components overview](./overview.md) for the full taxonomy.

## Import

```tsx
import {
  ScrollArea,
  ScrollBar,
} from "@ux/react"
```

## Example

```tsx
<ScrollArea className="h-72 w-48 rounded-md border">
  <div className="p-4">
    {Array.from({ length: 50 }).map((_, i) => (
      <div key={i}>Row {i + 1}</div>
    ))}
  </div>
</ScrollArea>
```

## Source

- `packages/react/src/components/ScrollArea/ScrollArea.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
