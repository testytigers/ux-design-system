# Charts

Recharts wrappers with token-styled tooltip and legend. Drop-in with any Recharts chart type.

## Import

```tsx
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@ux/react"
```

## Example

```tsx
<ChartContainer>
  <BarChart data={data}>
    <XAxis dataKey="month" />
    <YAxis />
    <Bar dataKey="revenue" fill="var(--ux-color-purple-600)" />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
  </BarChart>
</ChartContainer>
```

## Source

- `packages/react/src/components/Charts/Charts.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
