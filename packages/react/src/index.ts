/**
 * @ux/react — Barrel export
 * All Shadcn-based components with purple theme
 * Fonts: Roboto Mono (headings) + Open Sans (body) + JetBrains Mono (code)
 * Primary color: Purple-600 (#9333ea)
 */

// Tokens (re-exported from @ux/tokens)
export * from "@ux/tokens"

// ─── Utility ───────────────────────────────────────────────────────
export { cn } from "./lib/utils"

// ─── Core Components ───────────────────────────────────────────────
export { Button, buttonVariants } from "./components/Button"
export { Input } from "./components/Input"
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "./components/Card"
export { Badge } from "./components/Badge"
export { Alert, AlertTitle, AlertDescription } from "./components/Alert"

// ─── Form Components ───────────────────────────────────────────────
export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "./components/InputOtp"
export { Checkbox } from "./components/Checkbox"
export { RadioGroup, RadioGroupItem } from "./components/RadioGroup"
export { Slider } from "./components/Slider"
export { Switch } from "./components/Switch"
export { Label } from "./components/Label"
export { Textarea } from "./components/Textarea"
export { Separator } from "./components/Separator"
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from "./components/Form"

// ─── Data Components ───────────────────────────────────────────────
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableCell,
  TableCaption
} from "./components/Table"
export { Calendar } from "./components/Calendar"
export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "./components/Charts"

// ─── Overlays ──────────────────────────────────────────────────────
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "./components/Dialog"
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription
} from "./components/Sheet"
export { Popover, PopoverTrigger, PopoverContent } from "./components/Popover"
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./components/HoverCard"
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup
} from "./components/ContextMenu"
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction
} from "./components/Toast"
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup
} from "./components/DropdownMenu"

// ─── Navigation ────────────────────────────────────────────────────
export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./components/Tooltip"
export {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup
} from "./components/Menubar"
export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport
} from "./components/NavigationMenu"
export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from "./components/Pagination"

// ─── Interactive ───────────────────────────────────────────────────
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "./components/Accordion"
export { Toggle, toggleVariants } from "./components/Toggle"
export { Progress } from "./components/Progress"
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/Tabs"
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton
} from "./components/Select"
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
} from "./components/Command"

// ─── Display ───────────────────────────────────────────────────────
export { Avatar, AvatarImage, AvatarFallback } from "./components/Avatar"
export { Skeleton } from "./components/Skeleton"
export { AspectRatio } from "./components/AspectRatio"
export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "./components/Carousel"

// ─── Layout ────────────────────────────────────────────────────────
export { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./components/Resizable"
export { ScrollArea, ScrollBar } from "./components/ScrollArea"

// ─── Blocks (Layer 2) ─────────────────────────────────────────────
// Composed UI patterns built on top of Layer-1 components.
// See docs/composition-mcp.md for the architecture.
export * from "./blocks"

// ─── Templates (Layer 3) ──────────────────────────────────────────
// Full-page compositions. Driven by props; safe for MCP composition.
export * from "./templates"
