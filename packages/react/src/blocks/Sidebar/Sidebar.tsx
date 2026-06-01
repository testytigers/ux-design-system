"use client"
import * as React from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/Separator/Separator"

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name]
  return Cmp ? <Cmp className={className ?? "h-4 w-4"} /> : null
}

export interface SidebarItem {
  icon?: string                  // lucide name
  label: string
  href: string
  active?: boolean
  badge?: string                 // optional count chip
}

export interface SidebarSection {
  heading?: string
  items: SidebarItem[]
}

export interface SidebarProps {
  sections: SidebarSection[]
  footer?: React.ReactNode
  width?: number                 // px, defaults to 240
  className?: string
}

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ sections, footer, width = 240, className }, ref) => (
    <aside
      ref={ref}
      style={{ width }}
      className={cn(
        "flex h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-border bg-background",
        className
      )}
    >
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className={cn(sIdx > 0 && "mt-6")}>
            {section.heading && (
              <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.heading}
              </div>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item, iIdx) => (
                <li key={iIdx}>
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      item.active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon name={item.icon} className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {footer && (
        <>
          <Separator />
          <div className="p-3">{footer}</div>
        </>
      )}
    </aside>
  )
)
Sidebar.displayName = "Sidebar"
