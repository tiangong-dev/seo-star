import { Card, CardContent, CardHeader } from "@/components/ui/card"
import React from "react"

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

  const { darkMode, setDarkMode } = useThemeMode()
  const { searchTerm, setSearchTerm, filteredSeoData, clearSearch } =
    useSearch(seoData)

  return (
    <div className="w-[720px] bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-200">
      <Card className="max-w-4xl mx-auto dark:bg-gray-800">
        <CardHeader className="flex flex-col space-y-4 pb-2">
          <Header
            seoData={seoData}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </CardHeader>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          clearSearch={clearSearch}
        />

        <CardContent className="mt-4">
          <SEOContent filteredSeoData={filteredSeoData} darkMode={darkMode} />
        </CardContent>
      </Card>
    </div>
  )
}

export default IndexPopup
