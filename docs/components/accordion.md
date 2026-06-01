# Accordion

See [components overview](./overview.md) for the full taxonomy.

## Import

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `type` | `single` · `multiple` |

## Example

```tsx
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes. It uses Radix Accordion under the hood.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Source

- `packages/react/src/components/Accordion/Accordion.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
