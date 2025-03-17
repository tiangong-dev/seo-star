import type { SEOData } from "./types"
import { registerAllEventListeners } from "./utils/events"
import {
  createHeadingTagsObserver,
  createHeadObserver,
  createObserverCleaner,
  observeExistingHeadings
} from "./utils/observers"
import { getSEOData } from "./utils/seoDataExtractor"
import { createDebouncedStorageFunction } from "./utils/storage"
import { createWebVitalsObserver } from "./utils/webVitals"

let vitalsState = {
  LCP: undefined,
  CLS: undefined,
  INP: undefined
}

const getSEODataFn = (): SEOData => getSEOData(vitalsState)

const debouncedStoreSEOData = createDebouncedStorageFunction(getSEODataFn)

const handleWebVitalsUpdate = (state) => {
  vitalsState = state
  debouncedStoreSEOData()
}

const cleanupFunctions: Array<() => void> = []

const initSEOApp = () => {
  createWebVitalsObserver(handleWebVitalsUpdate)

  const headObserver = createHeadObserver(debouncedStoreSEOData)
  const headingObserver = createHeadingTagsObserver(debouncedStoreSEOData)

  observeExistingHeadings(debouncedStoreSEOData)

  const eventCleanupFunctions = registerAllEventListeners(debouncedStoreSEOData)

  cleanupFunctions.push(
    createObserverCleaner([headObserver, headingObserver]),
    ...eventCleanupFunctions
  )

  debouncedStoreSEOData()
}

const cleanup = () => {
  cleanupFunctions.forEach((cleanupFn) => cleanupFn())
}

initSEOApp()

export { cleanup }
