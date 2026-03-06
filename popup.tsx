import { Card, CardContent, CardHeader } from "@/components/ui/card"
import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import "react-json-view-lite/dist/index.css"
import "@/styles/globals.css"
import "./popup.css"

import { Header } from "~/components/header"
import { SearchBar } from "~/components/search-bar"
import { SEOContent } from "~/components/seo-content"
import type { SEOData } from "~types/seoData"

import { useSearch } from "./hooks/useSearch"
import { useThemeMode } from "./hooks/useThemeMode"

function IndexPopup() {
  const [seoData] = useStorage<SEOData>("seoData", (data) => {
    return data ?? {}
  })
  const [tabUrl, setTabUrl] = useState<string>("")

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (!tab?.id || !tab.url) return

      setTabUrl(tab.url)

      chrome.tabs.sendMessage(tab.id, { type: "SEO_STAR_REFRESH" }, () => {
        void chrome.runtime.lastError
      })
    })
  }, [])

  const validSeoData =
    tabUrl && seoData?.url && seoData.url !== tabUrl ? {} : seoData

  const { darkMode, setDarkMode } = useThemeMode()
  const { searchTerm, setSearchTerm, filteredSeoData, clearSearch } =
    useSearch(validSeoData)

  return (
    <div className="w-[720px] bg-gray-100 dark:bg-gray-900 p-2 transition-colors duration-200">
      <Card className="max-w-4xl mx-auto dark:bg-gray-800">
        <CardHeader className="flex flex-col space-y-2 pb-1">
          <Header
            seoData={validSeoData}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </CardHeader>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearSearch={clearSearch}
        />

        <CardContent className="mt-2">
          <SEOContent filteredSeoData={filteredSeoData} darkMode={darkMode} />
        </CardContent>
      </Card>
    </div>
  )
}

export default IndexPopup
