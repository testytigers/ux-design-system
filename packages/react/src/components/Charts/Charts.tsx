import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex aspect-video justify-center text-sm", className)}
      {...props}
    />
  )
)
ChartContainer.displayName = "ChartContainer"

// Recharts' Tooltip / Legend accept a `content` prop that takes a render function
// or a React element. We expose thin wrappers that let consumers pass `className`
// and other styling without colliding with Recharts' own props.
const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  indicator?: "line" | "dot" | "dashed"
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ className, indicator: _indicator = "line", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-popover p-2 shadow-sm",
        className
      )}
      {...props}
    />
  )
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

interface ChartLegendContentProps extends React.HTMLAttributes<HTMLDivElement> {
  payload?: Array<{ value: string; dataKey: string }>
  propertyName?: string
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, payload: _payload, propertyName: _propertyName, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
      {...props}
    />
  )
)
ChartLegendContent.displayName = "ChartLegendContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent }
