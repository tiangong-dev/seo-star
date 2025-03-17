import { Badge } from "@/components/ui/badge"
import React from "react"

import { CopyButton } from "~/components/copy-button"
import { EmptyStatus } from "~/components/empty-status"
import { JsonLDContent } from "~/components/json-ld-content"
import { ListItem } from "~/components/list-item"
import { titleMap } from "~/constants/seo"
import type { SEOData } from "~types/seoData"

interface SEOContentProps {
  filteredSeoData: SEOData
  darkMode: boolean
}

export function SEOContent({ filteredSeoData, darkMode }: SEOContentProps) {
  return (
    <ul className="space-y-4">
      {Object.keys(filteredSeoData).map((key) => {
        const content = filteredSeoData[key]
        const title = titleMap[key] || key

        if (!content || content.length === 0) {
          return (
            <ListItem
              key={key}
              title={title}
              content={<EmptyStatus message={`Empty`} />}
            />
          )
        }

        if (key === "keywords") {
          return (
            <ListItem
              key={key}
              title={title}
              content={
                <div className="flex flex-wrap gap-2">
                  {content.split(",").map((keyword, idx) => (
                    <Badge
                      key={keyword + idx}
                      variant="secondary"
                      className="dark:bg-gray-700 dark:text-gray-200 flex items-center space-x-1 pr-1">
                      <span>{keyword}</span>
                      <CopyButton content={keyword} />
                    </Badge>
                  ))}
                </div>
              }
            />
          )
        }

        if (key === "ogImage") {
          return (
            <ListItem
              key={key}
              title={title}
              content={
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={content}
                    alt="OG Image"
                    className="max-w-full max-h-[120px] w-auto rounded-lg shadow-md object-contain"
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                      {content}
                    </p>
                    <CopyButton content={content} />
                  </div>
                </div>
              }
            />
          )
        }

        if (key === "jsonLDs") {
          return (
            <ListItem
              key={key}
              title={title}
              content={
                <>
                  {content.map((jsonLd, index) => (
                    <pre
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap dark:text-gray-200">
                      <JsonLDContent content={jsonLd} isDark={darkMode} />
                    </pre>
                  ))}
                </>
              }
            />
          )
        }

        return <ListItem key={key} title={title} content={content} />
      })}
    </ul>
  )
}
