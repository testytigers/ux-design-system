# Command

⌘K-style command palette built on `cmdk`. Use `CommandDialog` for the dialog variant.

## Import

```tsx
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@ux/react"
```

## Example

```tsx
<Command>
  <CommandInput placeholder="Type a command…" />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search emoji</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Source

- `packages/react/src/components/Command/Command.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
