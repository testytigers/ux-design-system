import * as React from "react"
import { AppShell, type AppShellProps } from "@/blocks/AppShell/AppShell"
import { PageHeader, type PageHeaderProps } from "@/blocks/PageHeader/PageHeader"
import { StatsRow, type Stat } from "@/blocks/StatsRow/StatsRow"

export interface DashboardTemplateProps {
  title: string
  description?: string
  badge?: PageHeaderProps["badge"]
  breadcrumbs?: PageHeaderProps["breadcrumbs"]
  actions?: PageHeaderProps["actions"]
  stats?: Stat[]
  statsCols?: 1 | 2 | 3 | 4 | 5 | 6
  /** Free-form content below the stats row — charts, tables, etc. */
  children?: React.ReactNode
  appShell?: Omit<AppShellProps, "children">
}

/**
 * Dashboard layout: AppShell (header + sidebar) → PageHeader → StatsRow → children.
 *
 * Driven entirely by props; safe to assemble via the MCP `compose_page` tool.
 */
export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  stats,
  statsCols,
  children,
  appShell,
}) => (
  <AppShell {...(appShell ?? {})}>
    <PageHeader
      title={title}
      description={description}
      badge={badge}
      breadcrumbs={breadcrumbs}
      actions={actions}
    />
    {stats && stats.length > 0 && <StatsRow stats={stats} cols={statsCols} />}
    {children && <div className="mt-6 grid gap-6">{children}</div>}
  </AppShell>
)
DashboardTemplate.displayName = "DashboardTemplate"
