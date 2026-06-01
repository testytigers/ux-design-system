# Carousel

Carousel built on `embla-carousel-react`. Supports horizontal and vertical orientation.

## Import

```tsx
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ux/react"
```

## Props of note

| Prop | Values |
|---|---|
| `orientation` | `horizontal` · `vertical` (default: `horizontal`) |

## Example

```tsx
<Carousel className="w-full max-w-md">
  <CarouselContent>
    {[1, 2, 3].map(n => (
      <CarouselItem key={n}>
        <Card><CardContent className="flex h-40 items-center justify-center">{n}</CardContent></Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

## Source

- `packages/react/src/components/Carousel/Carousel.tsx`

---

[← All components](./overview.md) · [Tokens](../tokens/overview.md) · [Theming](../theming/overview.md)
