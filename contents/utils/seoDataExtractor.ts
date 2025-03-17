import type { SEOData, SEOWebVitals } from "../types"

export const extractBasicSEOData = (): Pick<
  SEOData,
  "url" | "canonical" | "title" | "description" | "keywords"
> => ({
  url: window.location.href,
  canonical:
    document.querySelector("link[rel='canonical']")?.getAttribute("href") || "",
  title: document.title,
  description:
    document
      .querySelector("meta[name='description']")
      ?.getAttribute("content") || "",
  keywords:
    document.querySelector("meta[name='keywords']")?.getAttribute("content") ||
    ""
})

export const extractOGData = (): Pick<
  SEOData,
  "ogType" | "ogTitle" | "ogDescription" | "ogImage" | "ogUrl" | "ogSiteName"
> => ({
  ogType:
    document
      .querySelector("meta[property='og:type']")
      ?.getAttribute("content") || "",
  ogTitle:
    document
      .querySelector("meta[property='og:title']")
      ?.getAttribute("content") || "",
  ogDescription:
    document
      .querySelector("meta[property='og:description']")
      ?.getAttribute("content") || "",
  ogImage:
    document
      .querySelector("meta[property='og:image']")
      ?.getAttribute("content") || "",
  ogUrl:
    document
      .querySelector("meta[property='og:url']")
      ?.getAttribute("content") || "",
  ogSiteName:
    document
      .querySelector("meta[property='og:site_name']")
      ?.getAttribute("content") || ""
})

export const extractJSONLDData = (): Pick<SEOData, "jsonLDs"> => ({
  jsonLDs: Array.from(
    document.querySelectorAll("script[type='application/ld+json']")
  ).map((element) => element.textContent || "")
})

export const extractHeadingData = (): Pick<SEOData, "h1s"> => ({
  h1s: Array.from(document.querySelectorAll("h1")).map(
    (element) => element.innerText
  )
})

export const getSEOData = (webVitals: {
  LCP?: SEOWebVitals
  CLS?: SEOWebVitals
  INP?: SEOWebVitals
}): SEOData => {
  return {
    ...extractBasicSEOData(),
    ...extractOGData(),
    ...extractJSONLDData(),
    ...extractHeadingData(),
    ...webVitals
  }
}
