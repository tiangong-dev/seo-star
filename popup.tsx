import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { Check, Copy, ExternalLink, Info, Moon, Sun } from "lucide-react"
import React, { useEffect, useState } from "react"
import {
  allExpanded,
  darkStyles,
  defaultStyles,
  JsonView
} from "react-json-view-lite"

import "@/styles/globals.css"
import "./popup.css"

import { useStorage } from "@plasmohq/storage/hook"

import type { SEOData } from "~types/seoData"

function useStringToJSON(str: string) {
  const [json, setJson] = useState(undefined)
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
        <JsonView
          data={jsonLD}
          shouldExpandNode={allExpanded}
          style={isDark ? darkStyles : defaultStyles}
        />
      )}
    </>
  )
}

function IndexPopup() {
  const [seoData] = useStorage<SEOData>("seoData", (data) => {
    return data ?? {}
  })
  const [darkMode, setDarkMode] = useState(false)
  const [copiedKeyword, setCopiedKeyword] = useState("")

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const copyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword)
    setCopiedKeyword(keyword)
    setTimeout(() => setCopiedKeyword(""), 2000)
  }

  return (
    <div className="w-[720px] bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <Card className="max-w-4xl mx-auto dark:bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold dark:text-white">
            SEO Star
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {seoData.CLS && (
                <WebVitalsBadge
                  value={seoData.CLS.value}
                  rating={seoData.CLS.rating}
                />
              )}
              {seoData.INP && (
                <WebVitalsBadge
                  value={seoData.INP.value}
                  rating={seoData.INP.rating}
                />
              )}
              {seoData.LCP && (
                <WebVitalsBadge
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
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <ListItem title="URL" content={seoData.url} />
            <ListItem title="Canonical URL" content={seoData.canonical} />
            <ListItem title="Title" content={seoData.title} />
            <ListItem title="Description" content={seoData.description} />
            <ListItem
              title="Keywords"
              content={
                <div className="flex flex-wrap gap-2">
                  {seoData.keywords &&
                    seoData.keywords?.split(",").map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="secondary"
                        className="dark:bg-gray-700 dark:text-gray-200 flex items-center space-x-1 pr-1">
                        <span>{keyword}</span>
                        <CopyButton content={keyword} />
                      </Badge>
                    ))}
                </div>
              }
            />
            <ListItem title="H1" content={seoData.h1s} />
            <ListItem title="og:type" content={seoData.ogType} />
            <ListItem title="og:title" content={seoData.ogTitle} />
            <ListItem title="og:description" content={seoData.ogDescription} />
            <ListItem title="og:site_name" content={seoData.ogSiteName} />
            <ListItem
              title="og:image"
              content={
                <img
                  src={seoData.ogImage}
                  alt="OG Image"
                  className="w-full max-w-xs h-auto rounded-lg shadow-md"
                />
              }
            />
            {/* <ListItem
                title="Robots.txt"
                content={
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs whitespace-pre-wrap dark:text-gray-200">
                    {seoData.robotsTxt}
                  </pre>
                }
              />
              <ListItem title="Sitemap" content={seoData.sitemap} />
              <ListItem
                title="SSL Certificate"
                content={
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 dark:text-green-400 dark:border-green-400">
                    {seoData.sslCertificate}
                  </Badge>
                }
              /> */}
            <ListItem
              title="JSON-LD"
              content={
                <>
                  {seoData.jsonLDs?.map((jsonLd) => {
                    return (
                      <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-x-auto whitespace-pre-wrap dark:text-gray-200">
                        <JsonLDContent content={jsonLd} isDark={darkMode} />
                      </pre>
                    )
                  })}
                </>
              }
            />
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
        {typeof content === "string" ? (
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
              {content}
            </p>
            <CopyButton content={content} />
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
        ) : (
          content
        )}
      </div>
    </li>
  )
}

function MetricBadge({
  label,
  value,
  color
}: {
  label: string
  value: string | number
  color: string
}) {
  return (
    <Badge
      variant="outline"
      className={`text-${color}-600 border-${color}-600 dark:text-${color}-400 dark:border-${color}-400`}>
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
      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}

function WebVitalsBadge({
  value,
  rating
}: {
  value: string | number
  rating: string
}) {
  const getColor = (rating: string) => {
    switch (rating) {
      case "good":
        return "green"
      case "needs-improvement":
        return "yellow"
      default:
        return "red"
    }
  }

  return <MetricBadge label={value} value={rating} color={getColor(rating)} />
}

export default IndexPopup
