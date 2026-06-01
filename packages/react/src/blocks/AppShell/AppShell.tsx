import * as React from "react"
import { cn } from "@/lib/utils"
import { Header, type HeaderProps } from "@/blocks/Header/Header"
import { Sidebar, type SidebarProps } from "@/blocks/Sidebar/Sidebar"

export interface AppShellProps {
  header?: HeaderProps
  sidebar?: SidebarProps
  children: React.ReactNode
  /** When set, sidebar is hidden — full-width layout. */
  noSidebar?: boolean
  className?: string
}

/**
 * The standard app frame: header on top, optional sidebar on the left,
 * scrollable main on the right. SSR-safe wrapper around the two interactive
 * sub-blocks.
 */
export const AppShell: React.FC<AppShellProps> = ({
  header,
  sidebar,
  children,
  noSidebar,
  className,
}) => (
  <div className={cn("flex min-h-screen flex-col bg-background text-foreground", className)}>
    <Header {...(header ?? {})} />
    <div className="flex flex-1">
      {!noSidebar && sidebar && <Sidebar {...sidebar} />}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-6 py-6">{children}</div>
      </main>
    </div>
  </div>
)
AppShell.displayName = "AppShell"
