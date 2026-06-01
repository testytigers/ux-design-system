# Tooltip

Hover/focus tooltip. Wrap your tree in `<TooltipProvider>` once.

## Import

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ux/react"
```

## Example

```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild><Button variant="outline">Hover me</Button></TooltipTrigger>
    <TooltipContent>Tooltip content</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Source

- `packages/react/src/components/Tooltip/Tooltip.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
