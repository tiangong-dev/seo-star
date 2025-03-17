import React from "react"
import {
  allExpanded,
  darkStyles,
  defaultStyles,
  JsonView
} from "react-json-view-lite"

import { CopyButton } from "~/components/copy-button"
import { useStringToJSON } from "~/hooks/useStringToJSON"

interface JsonLDContentProps {
  content: string
  isDark: boolean
}

export function JsonLDContent({ content, isDark }: JsonLDContentProps) {
  const jsonLD = useStringToJSON(content)

  return (
    <>
      {jsonLD && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 overflow-hidden">
            <JsonView
              data={jsonLD}
              shouldExpandNode={allExpanded}
              style={isDark ? darkStyles : defaultStyles}
            />
          </div>
          <CopyButton content={JSON.stringify(jsonLD, null, 2)} />
        </div>
      )}
    </>
  )
}
