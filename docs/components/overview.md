# Components

40 components, all sourced from Shadcn UI patterns and built on Radix UI primitives. Every component is a React forwardRef (where applicable), accepts a `className`, and styles itself via the design tokens — so a `bg-primary` token swap rethemes everything.

## How to import

The package has a single barrel:

```ts
import {
  Button, Card, CardHeader, CardTitle, CardContent,
  Badge, Alert, AlertTitle, AlertDescription,
  Dialog, DialogTrigger, DialogContent,
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage,
} from "@ux/react"
```

> Subpath imports like `@ux/react/button` are not currently exposed. Tree-shaking via the barrel relies on `"sideEffects": false` in `package.json`, which is set.

## Component reference

### Form & input

| Component | Import | Variants | Notes |
|---|---|---|---|
| **Button** | `Button`, `buttonVariants`, `ButtonProps` | `variant`: `default` · `destructive` · `outline` · `secondary` · `ghost` · `link` <br> `size`: `default` (h-9) · `sm` (h-8) · `lg` (h-10) · `icon` (h-9 w-9) | `asChild` prop renders via Radix `<Slot>` for polymorphism |
| **Input** | `Input` | — | Standard `<input>`-shaped element. Token-styled border, focus ring, placeholder. |
| **Textarea** | `Textarea` | — | Multi-line equivalent of `Input`. |
| **Label** | `Label` | — | Built on Radix `Label`; pairs with `Input`/`Textarea`/`Checkbox`/etc. |
| **Checkbox** | `Checkbox` | — | Radix Checkbox with check icon (lucide). |
| **RadioGroup** | `RadioGroup`, `RadioGroupItem` | — | Compound. Use `<RadioGroup value=… onValueChange=…><RadioGroupItem value=… /></RadioGroup>`. |
| **Select** | `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` | — | Compound. Mirrors Radix Select. |
| **Switch** | `Switch` | — | Two-state toggle. `data-[state=checked]:bg-primary`. |
| **Slider** | `Slider` | — | Single-value or range slider. |
| **InputOTP** | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` | — | OTP / 2FA input built on `input-otp`. |
| **Form** | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`, `useFormField` | — | Real `react-hook-form` integration. `Form` is `FormProvider`; `FormField` wraps `Controller`; `FormMessage` reads errors out of context. |

### Display

| Component | Import | Variants | Notes |
|---|---|---|---|
| **Card** | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | — | Compound. **No `title`/`description` prop** — use sub-components. |
| **Badge** | `Badge`, `badgeVariants` | `variant`: `default` · `secondary` · `destructive` · `outline` · `purple` · `success` · `warning` · `info` | No `size` prop. |
| **Alert** | `Alert`, `AlertTitle`, `AlertDescription` | `variant`: `default` · `destructive` · `success` · `warning` · `info` | Icons auto-pick from variant; override with `icon` prop. |
| **Avatar** | `Avatar`, `AvatarImage`, `AvatarFallback` | — | Shows initials when image fails. |
| **Skeleton** | `Skeleton` | — | Shimmer loading placeholder. |
| **Separator** | `Separator` | `orientation`: `horizontal` (default) · `vertical` | |
| **AspectRatio** | `AspectRatio` | — | Wrap content with a fixed `ratio={16/9}`. |
| **Progress** | `Progress` | — | `value` prop (0–100). |

### Overlay

| Component | Import | Variants | Notes |
|---|---|---|---|
| **Dialog** | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` | — | Modal dialog. Built on Radix Dialog. Has built-in close button. |
| **Sheet** | `Sheet`, `SheetTrigger`, `SheetPortal`, `SheetOverlay`, `SheetClose`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription` | `side` (on `SheetContent`): `top` · `right` (default) · `bottom` · `left` | Side-drawer dialog. |
| **Popover** | `Popover`, `PopoverTrigger`, `PopoverContent` | — | Click-triggered floating panel. |
| **HoverCard** | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | — | Hover-triggered floating panel. |
| **Tooltip** | `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent` | — | Wrap your tree in `<TooltipProvider>` once at the root. |
| **DropdownMenu** | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuGroup`, `DropdownMenuPortal`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuRadioGroup` | — | `Item`, `SubTrigger`, `Label` accept `inset?: boolean` for icon-aligned spacing. |
| **ContextMenu** | `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`, `ContextMenuCheckboxItem`, `ContextMenuRadioItem`, `ContextMenuLabel`, `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`, `ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubContent`, `ContextMenuSubTrigger`, `ContextMenuRadioGroup` | — | Right-click menu. Same shape as DropdownMenu. |
| **Toast** | `ToastProvider`, `ToastViewport`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastClose`, `ToastAction` | — | Wrap your app in `<ToastProvider>`; render `<ToastViewport>` once. |

### Navigation

| Component | Import | Variants | Notes |
|---|---|---|---|
| **Tabs** | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | — | Use `defaultValue` or controlled `value`/`onValueChange`. |
| **Accordion** | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | `type`: `single` · `multiple` | One-or-many expandable sections. |
| **NavigationMenu** | `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`, `navigationMenuTriggerStyle` | — | Mega-menu pattern. |
| **Menubar** | `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem`, `MenubarCheckboxItem`, `MenubarSeparator`, `MenubarShortcut`, `MenubarGroup`, `MenubarPortal`, `MenubarSub`, `MenubarRadioGroup` | — | Application menu bar (File / Edit / View …). |
| **Pagination** | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis` | — | Compose your page-number layout from these primitives. |
| **Toggle** | `Toggle`, `toggleVariants` | `variant`: `default` · `outline` <br> `size`: `default` (h-9) · `sm` (h-8) · `lg` (h-10) | Single binary button (icon-toolbar style). |

### Data

| Component | Import | Variants | Notes |
|---|---|---|---|
| **Table** | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` | — | Semantic HTML, styled. |
| **Calendar** | `Calendar` | — | Built on `react-day-picker` v9. Pass `mode="single" \| "range" \| "multiple"`, `selected`, `onSelect`. |
| **Charts** | `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent` | — | Recharts wrappers with token-styled tooltip + legend. |
| **Carousel** | `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` | `orientation` (on `Carousel`): `horizontal` (default) · `vertical` | Built on `embla-carousel-react`. |
| **Command** | `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandShortcut`, `CommandSeparator` | — | ⌘K-style command palette built on `cmdk`. |

### Layout

| Component | Import | Variants | Notes |
|---|---|---|---|
| **ResizablePanelGroup** | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | `direction`: `horizontal` · `vertical` | Built on `react-resizable-panels`. |
| **ScrollArea** | `ScrollArea`, `ScrollBar` | — | Custom scrollbars (Radix ScrollArea). |

## Shared conventions

### `className` is always honoured

Every component merges its built-in classes with the consumer's `className` via `cn()` (clsx + tailwind-merge). Conflicting Tailwind classes resolve correctly (e.g. `<Button className="bg-fuchsia-600">` overrides the default `bg-primary`).

```tsx
import { cn, Button } from "@ux/react"

<Button className={cn("rounded-full px-6", isLoading && "opacity-50")}>
  Save
</Button>
```

### `asChild` for polymorphism (Button)

`Button` accepts `asChild` (Radix `<Slot>` pattern). With it, the props apply to the child element instead of rendering a `<button>`:

```tsx
import Link from "next/link"

<Button asChild>
  <Link href="/sign-in">Sign in</Link>
</Button>
```

### Compound components

Many components are compound — `Card`, `Dialog`, `Sheet`, `Popover`, `Select`, `DropdownMenu`, `ContextMenu`, `Menubar`, `NavigationMenu`, `Tabs`, `Accordion`, `Form`, `Carousel`, `Pagination`, `Resizable`, `Toast`, `Command`, `Charts`, `Table`. The pattern is consistent: a container plus sub-parts.

```tsx
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Refs

All primitive-like components use `React.forwardRef`. You can attach refs and use `useImperativeHandle` if you need to.

### Dark mode

Every component renders correctly in both light and dark mode by going through the semantic tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-popover`, etc.). Toggle the `dark` class on `<html>` — see [Theming](../theming/overview.md).

## Per-component pages

Click through for full prop tables and examples:

- [Accordion](./accordion.md) · [Alert](./alert.md) · [AspectRatio](./aspect-ratio.md) · [Avatar](./avatar.md)
- [Badge](./badge.md) · [Button](./button.md)
- [Calendar](./calendar.md) · [Card](./card.md) · [Carousel](./carousel.md) · [Charts](./charts.md) · [Checkbox](./checkbox.md) · [Command](./command.md) · [ContextMenu](./context-menu.md)
- [Dialog](./dialog.md) · [DropdownMenu](./dropdown-menu.md)
- [Form](./form.md)
- [HoverCard](./hover-card.md)
- [Input](./input.md) · [InputOTP](./input-otp.md)
- [Label](./label.md)
- [Menubar](./menubar.md)
- [NavigationMenu](./navigation-menu.md)
- [Pagination](./pagination.md) · [Popover](./popover.md) · [Progress](./progress.md)
- [RadioGroup](./radio-group.md) · [Resizable](./resizable.md)
- [ScrollArea](./scroll-area.md) · [Select](./select.md) · [Separator](./separator.md) · [Sheet](./sheet.md) · [Skeleton](./skeleton.md) · [Slider](./slider.md) · [Switch](./switch.md)
- [Table](./table.md) · [Tabs](./tabs.md) · [Textarea](./textarea.md) · [Toast](./toast.md) · [Toggle](./toggle.md) · [Tooltip](./tooltip.md)
