import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { ExternalLink, Info } from "lucide-react"
import React from "react"

import { CopyButton } from "~/components/copy-button"

interface ListItemProps {
  title: string
  content: string | React.ReactNode
  info?: string
}

export function ListItem({ title, content, info }: ListItemProps) {
  const contentItems = Array.isArray(content) ? content : [content]

  return (
    <li className="flex flex-col sm:flex-row sm:items-center border-b border-gray-200 dark:border-gray-700 pb-2">
      <div className="w-full sm:w-1/3 flex items-center">
        <h3 className="text-sm font-medium mr-1 dark:text-white">{title}</h3>
        {info && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{info}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="w-full sm:w-2/3 mt-1 sm:mt-0">
        {contentItems.map((content, idx) => {
          if (typeof content === "string") {
            return (
              <div className="flex items-center space-x-2" key={idx}>
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  {content}
                </p>
                {content && <CopyButton content={content} />}
                {content.startsWith("http") && (
                  <a
                    href={content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            )
          }

          if (React.isValidElement(content)) {
            return <div key={idx}>{content}</div>
          }

          return <div key={idx}>{JSON.stringify(content, null, 2)}</div>
        })}
      </div>
    </li>
  )
}
