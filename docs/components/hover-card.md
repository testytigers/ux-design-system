# Hover Card

Floating panel. Triggers on hover/focus.

## Import

```tsx
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@ux/react"
```

## Example

```tsx
<HoverCard>
  <HoverCardTrigger asChild><Button variant="link">@vercel</Button></HoverCardTrigger>
  <HoverCardContent>
    The React framework, by Vercel.
  </HoverCardContent>
</HoverCard>
```

## Source

- `packages/react/src/components/HoverCard/HoverCard.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
