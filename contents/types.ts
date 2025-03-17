export type Vitals = "LCP" | "CLS" | "INP"
export type Rating = "good" | "needs-improvement" | "poor"

export interface SEOWebVitals {
  rating: Rating
  value: number
}

export interface SEOData {
  // Web Vitals
  LCP?: SEOWebVitals
  CLS?: SEOWebVitals
  INP?: SEOWebVitals

  // Base
  url: string
  canonical: string
  title: string
  description: string
  keywords: string
  h1s: string[]

  // Open Graph
  ogType: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  ogSiteName: string

  // JSON-LD
  jsonLDs: string[]
}
