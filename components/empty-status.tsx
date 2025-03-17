import { AlertCircle } from "lucide-react"
import React from "react"

interface EmptyStatusProps {
  message: string
}

export function EmptyStatus({ message }: EmptyStatusProps) {
  return (
    <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-400">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">{message}</span>
    </div>
  )
}
