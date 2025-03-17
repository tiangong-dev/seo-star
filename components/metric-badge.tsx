import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import React from "react"

interface MetricBadgeProps {
  label: string
  value: string | number
  info?: string
  className?: string
}

export function MetricBadge({
  label,
  value,
  info,
  className = ""
}: MetricBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={className + " flex items-center gap-2 cursor-pointer"}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{info}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {label} {value}
    </Badge>
  )
}
