import type { Metric } from "web-vitals"

export interface SEOWebVitals {
  rating: "good" | "needs-improvement" | "poor"
  value: number
}

export type SEOData = {
  LCP?: SEOWebVitals | Partial<Metric>
  CLS?: SEOWebVitals | Partial<Metric>
  INP?: SEOWebVitals | Partial<Metric>

  url?: string
  canonical?: string
  title?: string
  description?: string
  keywords?: string

  h1s?: string[]

  ogType?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogSiteName?: string

  jsonLDs?: string[]
}
