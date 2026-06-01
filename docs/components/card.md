# Card

Compound surface for grouped content. There is **no `title` or `description` prop** — use the sub-components.

## Import

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ux/react"
```

## Example

```tsx
<Card>
  <CardHeader>
    <CardTitle>Project</CardTitle>
    <CardDescription>Status and recent activity.</CardDescription>
  </CardHeader>
  <CardContent>Body of the card.</CardContent>
  <CardFooter className="justify-end gap-2">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Source

- `packages/react/src/components/Card/Card.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
