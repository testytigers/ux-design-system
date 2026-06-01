import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-0 border-b border-border bg-background", className)}
      {...props}
    >
      {children}
    </div>
  )
)
PageHeader.displayName = "PageHeader"

// ─── Title row (title + optional badge + right actions) ──────────────────────

export interface PageHeaderTitleRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const PageHeaderTitleRow = React.forwardRef<HTMLDivElement, PageHeaderTitleRowProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 px-6 pt-5 pb-3", className)}
      {...props}
    >
      {children}
    </div>
  )
)
PageHeaderTitleRow.displayName = "PageHeaderTitleRow"

// ─── Title ────────────────────────────────────────────────────────────────────

export interface PageHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

const PageHeaderTitle = React.forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn("font-heading text-xl font-semibold text-foreground", className)}
      {...props}
    >
      {children}
    </h1>
  )
)
PageHeaderTitle.displayName = "PageHeaderTitle"

// ─── Description ──────────────────────────────────────────────────────────────

export interface PageHeaderDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const PageHeaderDescription = React.forwardRef<
  HTMLParagraphElement,
  PageHeaderDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
))
PageHeaderDescription.displayName = "PageHeaderDescription"

// ─── Actions (right-aligned) ──────────────────────────────────────────────────

export interface PageHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const PageHeaderActions = React.forwardRef<HTMLDivElement, PageHeaderActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("ml-auto flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
PageHeaderActions.displayName = "PageHeaderActions"

// ─── Tab bar ──────────────────────────────────────────────────────────────────

export interface PageHeaderTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const PageHeaderTabs = React.forwardRef<HTMLDivElement, PageHeaderTabsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-0 overflow-x-auto px-6",
        "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
PageHeaderTabs.displayName = "PageHeaderTabs"

// ─── Individual tab ───────────────────────────────────────────────────────────

export interface PageHeaderTabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: React.ReactNode
}

const PageHeaderTab = React.forwardRef<HTMLButtonElement, PageHeaderTabProps>(
  ({ className, active, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "relative shrink-0 px-3 pb-3 pt-1 text-sm transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "font-medium text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:bg-primary"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
PageHeaderTab.displayName = "PageHeaderTab"

// ─── Filter bar ───────────────────────────────────────────────────────────────

export interface PageHeaderFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const PageHeaderFilters = React.forwardRef<HTMLDivElement, PageHeaderFiltersProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 border-t border-border px-6 py-2.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
PageHeaderFilters.displayName = "PageHeaderFilters"

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  PageHeader,
  PageHeaderTitleRow,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderTabs,
  PageHeaderTab,
  PageHeaderFilters,
}
