# Resizable

Resizable split panels built on `react-resizable-panels`. Use `ResizableHandle withHandle` for a visible drag indicator.

## Import

```tsx
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@ux/react"
```

## Example

```tsx
<ResizablePanelGroup direction="horizontal" className="rounded-lg border">
  <ResizablePanel defaultSize={25}>Sidebar</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={75}>Content</ResizablePanel>
</ResizablePanelGroup>
```

## Source

- `packages/react/src/components/Resizable/Resizable.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
