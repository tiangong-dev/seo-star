import { debounce } from "radash"
import { onCLS, onINP, onLCP } from "web-vitals/attribution"

import { Storage } from "@plasmohq/storage"

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

const getSEODataFromHTML = () => {
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

  // json-ld
  const jsonLdScript = document.querySelector(
    "script[type='application/ld+json']"
  )?.textContent

  let h1 = []
  document.querySelectorAll("h1").forEach((h1Element) => {
    h1.push(h1Element.innerText)
  })
  const seoData = {
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
    h1,
    jsonLdScript
  }

  return seoData
}

const storage = new Storage()
const getSEODataAndStore = debounce({ delay: 100 }, () => {
  const seoData = getSEODataFromHTML()
  if (document.visibilityState === "visible") {
    storage.set("seoData", seoData)
  }
  return seoData
})

getSEODataAndStore()

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => getSEODataAndStore())
})
observer.observe(document.head, {
  childList: true,
  attributes: true,
  subtree: true
})

window.addEventListener("popstate", getSEODataAndStore)
window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    getSEODataAndStore()
  }
})
