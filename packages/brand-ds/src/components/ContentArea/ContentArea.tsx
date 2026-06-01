import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Scrollable content wrapper ───────────────────────────────────────────────

export interface ContentAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Inner padding preset.
   * - "none"    — no padding (useful when you want full-bleed sub-sections)
   * - "sm"      — px-4 py-4
   * - "md"      — px-6 py-5  (default — matches Hotjar's content spacing)
   * - "lg"      — px-8 py-6
   */
  padding?: "none" | "sm" | "md" | "lg"
  children: React.ReactNode
}

const paddingMap: Record<NonNullable<ContentAreaProps["padding"]>, string> = {
  none: "",
  sm:   "px-4 py-4",
  md:   "px-6 py-5",
  lg:   "px-8 py-6",
}

const ContentArea = React.forwardRef<HTMLDivElement, ContentAreaProps>(
  ({ className, padding = "md", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex-1 overflow-y-auto bg-background",
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ContentArea.displayName = "ContentArea"

// ─── Metric / stat cards row ──────────────────────────────────────────────────

export interface MetricsRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const MetricsRow = React.forwardRef<HTMLDivElement, MetricsRowProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid auto-cols-fr grid-flow-col gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
MetricsRow.displayName = "MetricsRow"

// ─── Single metric card ───────────────────────────────────────────────────────

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: React.ReactNode
  delta?: React.ReactNode
  /** Small sparkline or trend chart */
  trend?: React.ReactNode
  /** Icon displayed on the right */
  icon?: React.ReactNode
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, delta, trend, icon, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 rounded-xl border border-border bg-card px-5 py-4",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        )}
      </div>
      <p className="font-heading text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {(delta || trend) && (
        <div className="flex items-center justify-between gap-2">
          {delta && <span className="text-xs text-muted-foreground">{delta}</span>}
          {trend && <div className="h-8 flex-1">{trend}</div>}
        </div>
      )}
    </div>
  )
)
MetricCard.displayName = "MetricCard"

// ─── Dashboard grid ───────────────────────────────────────────────────────────

export interface DashboardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Number of columns. Default: 2 */
  cols?: 1 | 2 | 3 | 4
}

const colsMap: Record<NonNullable<DashboardGridProps["cols"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

const DashboardGrid = React.forwardRef<HTMLDivElement, DashboardGridProps>(
  ({ className, cols = 2, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-4", colsMap[cols], className)}
      {...props}
    >
      {children}
    </div>
  )
)
DashboardGrid.displayName = "DashboardGrid"

// ─── Widget card (the panels in Hotjar's dashboard) ───────────────────────────

export interface WidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Widget = React.forwardRef<HTMLDivElement, WidgetProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Widget.displayName = "Widget"

export interface WidgetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  actions?: React.ReactNode
}

const WidgetHeader = React.forwardRef<HTMLDivElement, WidgetHeaderProps>(
  ({ className, title, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-5 py-3.5",
        className
      )}
      {...props}
    >
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      {actions && (
        <div className="flex items-center gap-1 text-muted-foreground">{actions}</div>
      )}
    </div>
  )
)
WidgetHeader.displayName = "WidgetHeader"

export interface WidgetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const WidgetBody = React.forwardRef<HTMLDivElement, WidgetBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 p-5", className)} {...props}>
      {children}
    </div>
  )
)
WidgetBody.displayName = "WidgetBody"

export interface WidgetFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const WidgetFooter = React.forwardRef<HTMLDivElement, WidgetFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t border-border px-5 py-3", className)}
      {...props}
    >
      {children}
    </div>
  )
)
WidgetFooter.displayName = "WidgetFooter"

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  ContentArea,
  MetricsRow,
  MetricCard,
  DashboardGrid,
  Widget,
  WidgetHeader,
  WidgetBody,
  WidgetFooter,
}
