import { debounce } from "radash"

import { Storage } from "@plasmohq/storage"

import type { SEOData } from "../types"

const storage = new Storage()

export const storeSEOData = async (seoData: SEOData): Promise<void> => {
  if (document.visibilityState === "visible") {
    await storage.set("seoData", seoData)
  }
}

export const createDebouncedStorageFunction = (
  getSEODataFn: () => SEOData,
  delay = 200
) => {
  return debounce({ delay }, async () => {
    const seoData = getSEODataFn()
    await storeSEOData(seoData)
    return seoData
  })
}

export const getSEODataFromStorage = async (): Promise<SEOData | undefined> => {
  return await storage.get<SEOData>("seoData")
}
