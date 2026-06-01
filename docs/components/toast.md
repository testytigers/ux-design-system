# Toast

Notifications built on Radix Toast. Wrap your app in `<ToastProvider>` and render `<ToastViewport>` once.

## Import

```tsx
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `variant` | `default` · `destructive` · `success` |

## Example

```tsx
// Wrap your app once
<ToastProvider>
  {children}
  <ToastViewport />
</ToastProvider>

// Then somewhere in your tree
<Toast>
  <div className="grid gap-1">
    <ToastTitle>Saved</ToastTitle>
    <ToastDescription>Your changes have been saved.</ToastDescription>
  </div>
  <ToastClose />
</Toast>
```

## Source

- `packages/react/src/components/Toast/Toast.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
