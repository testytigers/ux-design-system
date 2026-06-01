# Form

Real `react-hook-form` integration. `Form` is `FormProvider`, `FormField` wraps `Controller`, and `FormMessage` reads errors out of context.

## Import

```tsx
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@ux/react"
```

## Example

```tsx
import { useForm } from "react-hook-form"

type Values = { email: string }

const form = useForm<Values>({ defaultValues: { email: "" } })

<Form {...form}>
  <form onSubmit={form.handleSubmit(values => console.log(values))} className="space-y-4">
    <FormField
      control={form.control}
      name="email"
      rules={{ required: "Required" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" {...field} /></FormControl>
          <FormDescription>We will not share it.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Submit</Button>
  </form>
</Form>
```

## Source

- `packages/react/src/components/Form/Form.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
