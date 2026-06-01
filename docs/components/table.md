# Table

See [components overview](./overview.md) for the full taxonomy.

## Import

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
} from "@ux/react"
```

## Example

```tsx
<Table>
  <TableCaption>Recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell><Badge variant="success">Paid</Badge></TableCell>
      <TableCell className="text-right">$250</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Source

- `packages/react/src/components/Table/Table.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
