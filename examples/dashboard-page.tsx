"use client"

import * as React from "react"
import { DashboardTemplate } from "@ux/react"

export default function DashboardPage() {
  return (
    <DashboardTemplate
      {...{
        "title": "Analytics",
        "description": "Real-time metrics for the last 30 days",
        "stats": [
          {
            "label": "MRR",
            "value": "$48,210",
            "delta": "+12.4%",
            "positive": true,
            "icon": "DollarSign"
          },
          {
            "label": "Active users",
            "value": "12,840",
            "delta": "+3.1%",
            "positive": true,
            "icon": "Users"
          },
          {
            "label": "Churn",
            "value": "2.1%",
            "delta": "-0.4%",
            "positive": true,
            "icon": "TrendingDown"
          },
          {
            "label": "Trials",
            "value": "284",
            "delta": "+22",
            "positive": true,
            "icon": "Sparkles"
          }
        ],
        "actions": [
          {
            "label": "Export",
            "icon": "Download"
          }
        ],
        "appShell": {
          "header": {
            "brand": "Acme",
            "brandIcon": "Sparkles"
          },
          "sidebar": {
            "sections": [
              {
                "items": [
                  {
                    "icon": "LayoutDashboard",
                    "label": "Overview",
                    "href": "/",
                    "active": true
                  },
                  {
                    "icon": "Users",
                    "label": "Customers",
                    "href": "/customers"
                  },
                  {
                    "icon": "Receipt",
                    "label": "Billing",
                    "href": "/billing"
                  },
                  {
                    "icon": "Settings",
                    "label": "Settings",
                    "href": "/settings"
                  }
                ]
              }
            ]
          }
        }
      }}
    />
  )
}
