"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppShell } from "@/components/AppShell/AppShell"

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
)
Sidebar.displayName = "Sidebar"

// ─── Logo area ────────────────────────────────────────────────────────────────

export interface SidebarLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SidebarLogo = React.forwardRef<HTMLDivElement, SidebarLogoProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed } = useAppShell()
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border px-4",
          collapsed && "justify-center px-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarLogo.displayName = "SidebarLogo"

// ─── Nav wrapper ─────────────────────────────────────────────────────────────

export interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

const SidebarNav = React.forwardRef<HTMLElement, SidebarNavProps>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-3", className)}
      {...props}
    >
      {children}
    </nav>
  )
)
SidebarNav.displayName = "SidebarNav"

// ─── Nav section label ────────────────────────────────────────────────────────

export interface SidebarNavSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
}

const SidebarNavSection = React.forwardRef<HTMLDivElement, SidebarNavSectionProps>(
  ({ className, label, children, ...props }, ref) => {
    const { collapsed } = useAppShell()
    return (
      <div ref={ref} className={cn("mb-1", className)} {...props}>
        {label && !collapsed && (
          <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
        )}
        {children}
      </div>
    )
  }
)
SidebarNavSection.displayName = "SidebarNavSection"

// ─── Nav item ─────────────────────────────────────────────────────────────────

export interface SidebarNavItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Lucide icon or any ReactNode */
  icon?: React.ReactNode
  label: string
  active?: boolean
  badge?: string | number
  href?: string
  /** Render as an anchor when href is provided */
  asChild?: boolean
}

const SidebarNavItem = React.forwardRef<HTMLButtonElement, SidebarNavItemProps>(
  ({ className, icon, label, active, badge, href, onClick, ...props }, ref) => {
    const { collapsed } = useAppShell()

    const content = (
      <>
        {icon && (
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center",
              active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {icon}
          </span>
        )}
        {!collapsed && (
          <span className="flex-1 truncate text-sm">{label}</span>
        )}
        {!collapsed && badge !== undefined && (
          <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
            {badge}
          </span>
        )}
      </>
    )

    const sharedClassName = cn(
      "group flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left",
      "transition-colors duration-100",
      active
        ? "bg-primary/10 font-medium text-primary"
        : "text-foreground/70 hover:bg-accent hover:text-foreground",
      collapsed && "justify-center px-0",
      className
    )

    if (href) {
      return (
        <a href={href} className={sharedClassName} title={collapsed ? label : undefined}>
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={sharedClassName}
        title={collapsed ? label : undefined}
        {...props}
      >
        {content}
      </button>
    )
  }
)
SidebarNavItem.displayName = "SidebarNavItem"

// ─── Footer ───────────────────────────────────────────────────────────────────

export interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-auto shrink-0 border-t border-border", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SidebarFooter.displayName = "SidebarFooter"

// ─── Promo banner (optional, like Hotjar's "40% off" strip) ──────────────────

export interface SidebarPromoProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const SidebarPromo = React.forwardRef<HTMLDivElement, SidebarPromoProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed } = useAppShell()
    if (collapsed) return null
    return (
      <div
        ref={ref}
        className={cn(
          "mx-2 my-2 rounded-lg bg-primary/8 p-3 text-xs text-foreground/80",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarPromo.displayName = "SidebarPromo"

// ─── Collapse toggle ──────────────────────────────────────────────────────────

export interface SidebarCollapseToggleProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

const SidebarCollapseToggle = React.forwardRef<
  HTMLButtonElement,
  SidebarCollapseToggleProps
>(({ className, ...props }, ref) => {
  const { collapsed, setCollapsed } = useAppShell()
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setCollapsed(!collapsed)}
      className={cn(
        "flex w-full items-center gap-2 px-4 py-3 text-xs text-muted-foreground",
        "hover:bg-accent hover:text-foreground transition-colors",
        collapsed && "justify-center px-0",
        className
      )}
      {...props}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <>
          <ChevronLeft className="h-4 w-4" />
          <span>Collapse</span>
        </>
      )}
    </button>
  )
})
SidebarCollapseToggle.displayName = "SidebarCollapseToggle"

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  Sidebar,
  SidebarLogo,
  SidebarNav,
  SidebarNavSection,
  SidebarNavItem,
  SidebarFooter,
  SidebarPromo,
  SidebarCollapseToggle,
}
