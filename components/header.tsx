import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun } from "lucide-react"
import React from "react"

import { WebVitalsBadge } from "~/components/web-vitals-badge"
import type { SEOData } from "~types/seoData"

interface HeaderProps {
  seoData: SEOData
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

export function Header({
  seoData,
  darkMode,
  setDarkMode
}: HeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-2xl font-bold dark:text-white">
        SEO Star
      </CardTitle>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          {seoData.CLS && (
            <WebVitalsBadge
              label="CLS"
              value={seoData.CLS.value}
              rating={seoData.CLS.rating}
            />
          )}
          {seoData.INP && (
            <WebVitalsBadge
              label="INP"
              value={seoData.INP.value}
              rating={seoData.INP.rating}
            />
          )}
          {seoData.LCP && (
            <WebVitalsBadge
              label="LCP"
              value={seoData.LCP.value}
              rating={seoData.LCP.rating}
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Switch
            checked={darkMode}
            onCheckedChange={setDarkMode}
            aria-label="Toggle dark mode"
          />
          <Moon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
    </div>
  )
}
