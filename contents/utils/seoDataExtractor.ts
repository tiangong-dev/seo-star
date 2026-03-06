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

const getTwitterMeta = (tag: string): string =>
  document
    .querySelector(`meta[name='twitter:${tag}'], meta[property='twitter:${tag}']`)
    ?.getAttribute("content") || ""

export const extractTwitterData = (): Pick<
  SEOData,
  "twitterCard" | "twitterTitle" | "twitterDescription" | "twitterImage"
> => ({
  twitterCard: getTwitterMeta("card"),
  twitterTitle: getTwitterMeta("title"),
  twitterDescription: getTwitterMeta("description"),
  twitterImage: getTwitterMeta("image")
})

export const extractRobotsData = (): Pick<SEOData, "robots" | "googlebot"> => ({
  robots:
    document
      .querySelector("meta[name='robots']")
      ?.getAttribute("content") || "",
  googlebot:
    document
      .querySelector("meta[name='googlebot']")
      ?.getAttribute("content") || ""
})

export const extractHreflangData = (): Pick<SEOData, "hreflangs"> => ({
  hreflangs: Array.from(
    document.querySelectorAll("link[rel='alternate'][hreflang]")
  ).map(
    (el) => `${el.getAttribute("hreflang")}: ${el.getAttribute("href") || ""}`
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
    ...extractTwitterData(),
    ...extractRobotsData(),
    ...extractJSONLDData(),
    ...extractHeadingData(),
    ...extractHreflangData(),
    ...webVitals
  }
}
