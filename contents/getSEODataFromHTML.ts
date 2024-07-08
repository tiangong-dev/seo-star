import { debounce } from "radash"
import { onCLS, onINP, onLCP } from "web-vitals/attribution"

import { Storage } from "@plasmohq/storage"

import type { SEOData } from "~types/seoData"

let LCP = undefined
let CLS = undefined
let INP = undefined

onLCP((res) => {
  LCP = {
    rating: res.rating,
    value: Math.floor(res.value)
  }
  getSEODataAndStore()
})
onCLS((res) => {
  CLS = {
    rating: res.rating,
    value: Math.floor(res.value)
  }
  getSEODataAndStore()
})
onINP((res) => {
  INP = {
    rating: res.rating,
    value: Math.floor(res.value)
  }
  getSEODataAndStore()
})

function getSEODataFromHTML() {
  const url = window.location.href
  const canonical =
    document.querySelector("link[rel='canonical']")?.getAttribute("href") || ""

  // base
  const title = document.title
  const description =
    document
      .querySelector("meta[name='description']")
      ?.getAttribute("content") || ""
  const keywords =
    document.querySelector("meta[name='keywords']")?.getAttribute("content") ||
    ""

  // og
  const ogType =
    document
      .querySelector("meta[property='og:type']")
      ?.getAttribute("content") || ""
  const ogTitle =
    document
      .querySelector("meta[property='og:title']")
      ?.getAttribute("content") || ""
  const ogDescription =
    document
      .querySelector("meta[property='og:description']")
      ?.getAttribute("content") || ""
  const ogImage =
    document
      .querySelector("meta[property='og:image']")
      ?.getAttribute("content") || ""
  const ogUrl =
    document
      .querySelector("meta[property='og:url']")
      ?.getAttribute("content") || ""
  const ogSiteName =
    document
      .querySelector("meta[property='og:site_name']")
      ?.getAttribute("content") || ""

  // json-ld
  const jsonLDs = Array.from(
    document.querySelectorAll("script[type='application/ld+json']")
  ).map((element) => element.textContent)

  let h1s = Array.from(document.querySelectorAll("h1")).map(
    (element) => element.innerText
  )

  const seoData: SEOData = {
    LCP,
    CLS,
    INP,

    url,
    canonical,
    title,
    description,
    keywords,
    ogType,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogSiteName,
    h1s,
    jsonLDs
  }

  return seoData
}

const storage = new Storage()
const getSEODataAndStore = debounce({ delay: 200 }, async () => {
  const seoData = getSEODataFromHTML()
  if (document.visibilityState === "visible") {
    await storage.set("seoData", seoData)
  }
  return seoData
})

getSEODataAndStore()

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => getSEODataAndStore())
})
observer.observe(document.head, {
  childList: true,
  attributes: true,
  subtree: true
})

window.addEventListener("popstate", getSEODataAndStore)

window.addEventListener("popstate", getSEODataAndStore)

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    getSEODataAndStore()
  }
})
