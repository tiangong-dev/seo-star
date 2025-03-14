import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import {
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Info,
  Moon,
  Search,
  Sun,
  X
} from "lucide-react"
import { omit } from "radash"
import React, { useEffect, useMemo, useState } from "react"
import {
  allExpanded,
  darkStyles,
  defaultStyles,
  JsonView
} from "react-json-view-lite"

import "react-json-view-lite/dist/index.css"
import "@/styles/globals.css"
import "./popup.css"

import { useStorage } from "@plasmohq/storage/hook"

import type { SEOData } from "~types/seoData"

const titleMap = {
  url: "URL",
  canonical: "Canonical URL",
  title: "Title",
  description: "Description",
  keywords: "Keywords",
  h1s: "H1",
  ogType: "og:type",
  ogTitle: "og:title",
  ogDescription: "og:description",
  ogImage: "og:image",
  ogUrl: "og:url",
  ogSiteName: "og:site_name",
  jsonLDs: "JSON-LD"
}

function useStringToJSON(str: string) {
  const [json, setJson] = useState<Object | undefined>(undefined)
  useEffect(() => {
    try {
      setJson(JSON.parse(str))
    } catch (e) {
      setJson(undefined)
    }
  }, [])
  return json
}

function JsonLDContent({
  content,
  isDark
}: {
  content: string
  isDark: boolean
}) {
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

function IndexPopup() {
  const [seoData] = useStorage<SEOData>("seoData", (data) => {
    return data ?? {}
  })

  const [darkMode, setDarkMode] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const filterSeoData = (data: SEOData, term: string): SEOData => {
    const filteredData: SEOData = {}

    Object.entries(data)
      .filter(([key, value]) => {
        if (key.includes(term)) {
          return true
        }
        if (
          typeof value === "string" &&
          value.toLowerCase().includes(term.toLowerCase())
        ) {
          return true
        }
        if (
          typeof value === "object" &&
          JSON.stringify(value).toLowerCase().includes(term.toLowerCase())
        ) {
          return true
        }

        return false
      })
      .forEach(([key, value]) => {
        filteredData[key] = value
      })

    return filteredData
  }
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSeoData = useMemo(() => {
    const data = omit(seoData, ["CLS", "INP", "LCP"])
    if (!searchTerm) {
      return data
    }
    return filterSeoData(data, searchTerm)
  }, [searchTerm, seoData])

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="w-[720px] bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <Card className="max-w-4xl mx-auto dark:bg-gray-800">
        <CardHeader className="flex flex-col space-y-4 pb-2">
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSearch(!showSearch)}
                className="dark:bg-gray-700 dark:text-white">
                {showSearch ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search SEO data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="mt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}

function ListItem({
  title,
  content,
  info
}: {
  title: string
  content: string | React.ReactNode
  info?: string
}) {
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

function MetricBadge({
  label,
  value,
  info,
  className
}: {
  label: string
  value: string | number
  info?: string
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={className + " flex items-center gap-2  cursor-pointer"}>
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

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false)

  const copyContent = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={copyContent}
      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      title={copied ? "Copied" : "Copy"}>
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

function WebVitalsBadge({
  label,
  value,
  rating
}: {
  label: string
  value: string | number
  rating: string
}) {
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

function EmptyStatus({ message }) {
  return (
    <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-400">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export default IndexPopup
