import { omit } from "radash"
import { useMemo, useRef } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { SEOData } from "~types/seoData"

export function useSearch(seoData: SEOData) {
  const [searchTerm, setSearchTerm] = useStorage<string>("searchTerm", "")
  const cacheRef = useRef<Map<string, SEOData>>(new Map())

  const filterSeoData = (data: SEOData, term: string): SEOData => {
    const cacheKey = JSON.stringify(data) + ":" + term
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey) as SEOData
    }

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

    cacheRef.current.set(cacheKey, filteredData)
    return filteredData
  }

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

  return {
    searchTerm,
    setSearchTerm,
    filteredSeoData,
    clearSearch
  }
}
