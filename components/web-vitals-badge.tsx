import React from "react"

import { MetricBadge } from "./metric-badge"

interface WebVitalsBadgeProps {
  label: string
  value: string | number
  rating: string
}

export function WebVitalsBadge({ label, value, rating }: WebVitalsBadgeProps) {
  const getColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
      case "needs-improvement":
        return "text-yellow-600 border-yellow-600 dark:text-yellow-400 dark:border-yellow-400"
      default:
        return "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400"
    }
  }

  return (
    <MetricBadge
      label={label}
      value={value}
      info={rating}
      className={getColor(rating)}
    />
  )
}
