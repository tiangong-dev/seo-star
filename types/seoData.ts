import type { Metric } from "web-vitals"

export type SEOData = {
  LCP?: Partial<Metric>
  CLS?: Partial<Metric>
  INP?: Partial<Metric>

  url?: string
  canonical?: string
  title?: string
  description?: string
  keywords?: string
  ogType?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogSiteName?: string

  h1s?: string[]
  jsonLDs?: string[]
}
