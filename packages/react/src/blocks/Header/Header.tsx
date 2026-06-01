"use client"
import * as React from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar/Avatar"
import { Button } from "@/components/Button/Button"
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/DropdownMenu/DropdownMenu"

// Lucide icon resolver. Icons are passed as strings so the MCP can serialise them.
function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name]
  return Cmp ? <Cmp className={className ?? "h-4 w-4"} /> : null
}

export interface HeaderNavItem {
  label: string
  href: string
  active?: boolean
}

export interface HeaderUserMenuItem {
  label: string
  icon?: string       // lucide name
  href?: string
  destructive?: boolean
}

export interface HeaderProps {
  brand?: string
  brandIcon?: string                       // lucide name
  navItems?: HeaderNavItem[]
  user?: {
    name: string
    email?: string
    avatar?: string                        // image URL
    menu?: HeaderUserMenuItem[]
  }
  className?: string
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({ brand = "App", brandIcon, navItems = [], user, className }, ref) => (
    <header
      ref={ref}
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-6 border-b border-border bg-background/95 px-6 backdrop-blur",
        className
      )}
    >
      <a href="/" className="flex items-center gap-2 font-heading text-base font-semibold">
        {brandIcon && <Icon name={brandIcon} className="h-5 w-5 text-primary" />}
        <span>{brand}</span>
      </a>

      {navItems.length > 0 && (
        <nav className="hidden gap-1 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden text-foreground md:inline">{user.name}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(user.menu ?? []).map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  className={cn(item.destructive && "text-destructive focus:text-destructive")}
                  onSelect={() => item.href && (window.location.href = item.href)}
                >
                  <Icon name={item.icon} />
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm">Sign in</Button>
        )}
      </div>
    </header>
  )
)
Header.displayName = "Header"
