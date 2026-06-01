# Alert

Inline informational, success, warning, error, or info message. Icon picks itself from the variant; pass `icon` to override.

## Import

```tsx
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `variant` | `default` · `destructive` · `success` · `warning` · `info` |

## Example

```tsx
<Alert variant="info">
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>
    You can override the icon by passing <code>icon</code>.
  </AlertDescription>
</Alert>
```

## Source

- `packages/react/src/components/Alert/Alert.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
