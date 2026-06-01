import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const TopBar = React.forwardRef<HTMLElement, TopBarProps>(
  ({ className, children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4",
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
)
TopBar.displayName = "TopBar"

// ─── Brand / logo slot ────────────────────────────────────────────────────────

export interface TopBarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TopBarBrand = React.forwardRef<HTMLDivElement, TopBarBrandProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex shrink-0 items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
TopBarBrand.displayName = "TopBarBrand"

// ─── Center / site-selector area ─────────────────────────────────────────────

export interface TopBarCenterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TopBarCenter = React.forwardRef<HTMLDivElement, TopBarCenterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-1 items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
)
TopBarCenter.displayName = "TopBarCenter"

// ─── Status badge ─────────────────────────────────────────────────────────────

export type TopBarStatusVariant = "trial" | "active" | "warning" | "error"

const statusStyles: Record<TopBarStatusVariant, string> = {
  trial:   "bg-amber-100 text-amber-700 border-amber-200",
  active:  "bg-green-100 text-green-700 border-green-200",
  warning: "bg-orange-100 text-orange-700 border-orange-200",
  error:   "bg-red-100 text-red-700 border-red-200",
}

export interface TopBarStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TopBarStatusVariant
  label: string
}

const TopBarStatusBadge = React.forwardRef<HTMLSpanElement, TopBarStatusBadgeProps>(
  ({ className, variant = "trial", label, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[variant],
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
)
TopBarStatusBadge.displayName = "TopBarStatusBadge"

// ─── Right actions ────────────────────────────────────────────────────────────

export interface TopBarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const TopBarActions = React.forwardRef<HTMLDivElement, TopBarActionsProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("ml-auto flex shrink-0 items-center gap-1", className)}
      {...props}
    >
      {children}
    </div>
  )
)
TopBarActions.displayName = "TopBarActions"

// ─── Icon action button ───────────────────────────────────────────────────────

export interface TopBarIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  "aria-label": string
}

const TopBarIconButton = React.forwardRef<HTMLButtonElement, TopBarIconButtonProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground",
        "hover:bg-accent hover:text-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
TopBarIconButton.displayName = "TopBarIconButton"

// ─── Avatar button ────────────────────────────────────────────────────────────

export interface TopBarAvatarProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Single letter or image src */
  src?: string
  fallback?: string
}

const TopBarAvatar = React.forwardRef<HTMLButtonElement, TopBarAvatarProps>(
  ({ className, src, fallback = "U", ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground text-xs font-semibold",
        "hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={fallback} className="h-full w-full rounded-full object-cover" />
      ) : (
        fallback.charAt(0).toUpperCase()
      )}
    </button>
  )
)
TopBarAvatar.displayName = "TopBarAvatar"

// ─── Divider ──────────────────────────────────────────────────────────────────

const TopBarDivider = () => (
  <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
)
TopBarDivider.displayName = "TopBarDivider"

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  TopBar,
  TopBarBrand,
  TopBarCenter,
  TopBarStatusBadge,
  TopBarActions,
  TopBarIconButton,
  TopBarAvatar,
  TopBarDivider,
}
