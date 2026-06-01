"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppShellContextValue {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  sidebarWidth: number
  collapsedWidth: number
}

const AppShellContext = React.createContext<AppShellContextValue>({
  collapsed: false,
  setCollapsed: () => {},
  sidebarWidth: 200,
  collapsedWidth: 56,
})

export function useAppShell() {
  return React.useContext(AppShellContext)
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full sidebar width in px. Default: 200 */
  sidebarWidth?: number
  /** Icon-only sidebar width when collapsed. Default: 56 */
  collapsedWidth?: number
  /** Controlled collapsed state */
  collapsed?: boolean
  /** Default collapsed state (uncontrolled) */
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  children: React.ReactNode
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  (
    {
      className,
      sidebarWidth = 200,
      collapsedWidth = 56,
      collapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed)
    const collapsed = controlledCollapsed ?? internalCollapsed

    const setCollapsed = React.useCallback(
      (v: boolean) => {
        setInternalCollapsed(v)
        onCollapsedChange?.(v)
      },
      [onCollapsedChange]
    )

    const currentWidth = collapsed ? collapsedWidth : sidebarWidth

    return (
      <AppShellContext.Provider
        value={{ collapsed, setCollapsed, sidebarWidth, collapsedWidth }}
      >
        <div
          ref={ref}
          className={cn("flex h-screen w-full overflow-hidden bg-background", className)}
          style={
            {
              "--shell-sidebar-width": `${currentWidth}px`,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </AppShellContext.Provider>
    )
  }
)
AppShell.displayName = "AppShell"

// ─── Sidebar slot ─────────────────────────────────────────────────────────────

export interface AppShellSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AppShellSidebar = React.forwardRef<HTMLDivElement, AppShellSidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { collapsed, sidebarWidth, collapsedWidth } = useAppShell()
    return (
      <div
        ref={ref}
        style={{ width: collapsed ? collapsedWidth : sidebarWidth }}
        className={cn(
          "relative flex h-full shrink-0 flex-col overflow-hidden",
          "border-r border-border bg-background",
          "transition-[width] duration-200 ease-in-out",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AppShellSidebar.displayName = "AppShellSidebar"

// ─── Main slot ────────────────────────────────────────────────────────────────

export interface AppShellMainProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const AppShellMain = React.forwardRef<HTMLDivElement, AppShellMainProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex min-w-0 flex-1 flex-col overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AppShellMain.displayName = "AppShellMain"

// ─── Exports ──────────────────────────────────────────────────────────────────

export { AppShell, AppShellSidebar, AppShellMain }
