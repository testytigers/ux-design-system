"use client"
import * as React from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/Button/Button"
import { Badge } from "@/components/Badge/Badge"

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name]
  return Cmp ? <Cmp className={className ?? "h-4 w-4"} /> : null
}

export interface PageHeaderAction {
  label: string
  icon?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  href?: string
}

export interface PageHeaderProps {
  title: string
  description?: string
  badge?: { label: string; variant?: "default" | "secondary" | "destructive" | "outline" | "purple" | "success" | "warning" | "info" }
  breadcrumbs?: { label: string; href?: string }[]
  actions?: PageHeaderAction[]
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  className,
}) => (
  <header className={cn("mb-6 flex flex-col gap-4", className)}>
    {breadcrumbs && breadcrumbs.length > 0 && (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground">
        {breadcrumbs.map((b, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span aria-hidden="true">/</span>}
            {b.href ? (
              <a href={b.href} className="hover:text-foreground">
                {b.label}
              </a>
            ) : (
              <span className="text-foreground">{b.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>
    )}

    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
          {badge && <Badge variant={badge.variant ?? "secondary"}>{badge.label}</Badge>}
        </div>
        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((a, i) => (
            <Button
              key={i}
              variant={a.variant ?? (i === 0 ? "default" : "outline")}
              onClick={a.href ? () => (window.location.href = a.href!) : undefined}
            >
              <Icon name={a.icon} className="h-4 w-4" />
              {a.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  </header>
)
PageHeader.displayName = "PageHeader"
