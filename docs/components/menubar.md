# Menubar

See [components overview](./overview.md) for the full taxonomy.

## Import

```tsx
import {
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRadioGroup,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarTrigger,
} from "@ux/react"
```

## Example

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
      <MenubarItem>Open</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Save</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## Source

- `packages/react/src/components/Menubar/Menubar.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
