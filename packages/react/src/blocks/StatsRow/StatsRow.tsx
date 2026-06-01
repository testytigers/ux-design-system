import * as React from "react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/Card/Card"

function Icon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null
  const Cmp = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name]
  return Cmp ? <Cmp className={className ?? "h-4 w-4"} /> : null
}

export interface Stat {
  label: string
  value: string | number
  delta?: string                  // e.g. "+12.4%"
  positive?: boolean              // controls delta colour
  icon?: string                   // lucide name
  description?: string
}

export interface StatsRowProps {
  stats: Stat[]
  /** Optional grid columns override; defaults to responsive 1→2→4. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

const colsClass = (n?: number) => {
  switch (n) {
    case 1: return "grid-cols-1"
    case 2: return "grid-cols-1 sm:grid-cols-2"
    case 3: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    case 4: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    case 5: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
    case 6: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
  }
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats, cols, className }) => (
  <div className={cn("grid gap-4", colsClass(cols), className)}>
    {stats.map((s, i) => (
      <Card key={i}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
          <Icon name={s.icon} className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-heading text-2xl font-semibold">{s.value}</div>
          {(s.delta || s.description) && (
            <p className="mt-1 text-xs">
              {s.delta && (
                <span className={cn(
                  "font-medium",
                  s.positive === false
                    ? "text-destructive"
                    : s.positive === true
                      ? "text-status-success"
                      : "text-muted-foreground"
                )}>
                  {s.delta}
                </span>
              )}
              {s.delta && s.description && <span className="text-muted-foreground"> · </span>}
              {s.description && <span className="text-muted-foreground">{s.description}</span>}
            </p>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
)
StatsRow.displayName = "StatsRow"
