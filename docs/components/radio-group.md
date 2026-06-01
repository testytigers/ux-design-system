# Radio Group

See [components overview](./overview.md) for the full taxonomy.

## Import

```tsx
import {
  RadioGroup,
  RadioGroupItem,
} from "@ux/react"
```

## Example

```tsx
<RadioGroup defaultValue="card">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="card" id="card" />
    <Label htmlFor="card">Card</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="paypal" id="paypal" />
    <Label htmlFor="paypal">PayPal</Label>
  </div>
</RadioGroup>
```

## Source

- `packages/react/src/components/RadioGroup/RadioGroup.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
