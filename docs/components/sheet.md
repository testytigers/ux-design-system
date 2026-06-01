# Sheet

Side-drawer dialog. Built on Radix Dialog with positioned content. Choose `side` on `<SheetContent>`.

## Import

```tsx
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `side` (on `SheetContent`) | `top` · `right` · `bottom` · `left` (default: `right`) |

## Example

```tsx
<Sheet>
  <SheetTrigger asChild><Button>Open</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Source

- `packages/react/src/components/Sheet/Sheet.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
