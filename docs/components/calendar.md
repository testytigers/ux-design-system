# Calendar

Date picker built on `react-day-picker` v9.

## Import

```tsx
import {
  Calendar,
} from "@ux/react"
```

## Example

```tsx
const [date, setDate] = useState<Date | undefined>(new Date())

return <Calendar mode="single" selected={date} onSelect={setDate} />
```

## Source

- `packages/react/src/components/Calendar/Calendar.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
