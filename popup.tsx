import React, { useEffect, useState } from "react"
import {
  allExpanded,
  darkStyles,
  defaultStyles,
  JsonView
} from "react-json-view-lite"

import "react-json-view-lite/dist/index.css"
import "./uno.css"
import "./popup.css"

import { useStorage } from "@plasmohq/storage/hook"

import type { SEOData } from "~types/seoData"

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)
  let timeout = null
  function copyToClipboard(content: string) {
    setCopied(true)
    clearTimeout(timeout)
    timeout = setTimeout(() => setCopied(false), 1000)
    navigator.clipboard.writeText(content)
  }

  return { copied, copyToClipboard }
}

function useIsDarkMode() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const [isDark, setIsDark] = useState(prefersDark)
  return isDark
}

function useStringToJSON(str: string) {
  const [json, setJson] = useState(undefined)
  useEffect(() => {
    try {
      setJson(JSON.parse(str))
    } catch (e) {
      setJson(undefined)
    }
  }, [])
  return json
}

function DataItem({
  label,
  content,
  children
}: {
  label: string
  content?: string
  children?: React.ReactElement
}) {
  const { copied, copyToClipboard } = useCopyToClipboard()

  return (
    <tr>
      <th className={`d:f ${content ? "" : "op-.6"}`}>{label}</th>
      <td className="ov:h pos:r d:f ai:fs colmg-4px">
        {content && (
          <button
            className="copy"
            title={`Copy ${label}`}
            onClick={() => {
              copyToClipboard(content)
            }}>
            {copied ? "✅" : "📄"}
          </button>
        )}
        <div>{children ?? content}</div>
      </td>
    </tr>
  )
}

function PerformanceItem({
  name,
  value,
  rating
}: {
  name: string
  value?: number
  rating?: "good" | "needs-improvement" | "poor"
}) {
  const [color, setColor] = useState("c-#aaa")
  useEffect(() => {
    switch (rating) {
      case "good":
        setColor("c-#0f0")
        break
      case "needs-improvement":
        setColor("c-#ff0")
        break
      case "poor":
        setColor("c-#f00")
        break
      default:
        setColor("c-#aaa")
    }
  }, [rating])
  return (
    <p className={`${color} d:f colmg-4px`}>
      {name}
      <span>{value ?? "-"}</span>
    </p>
  )
}

function JsonLDContent({
  content,
  isDark
}: {
  content: string
  isDark: boolean
}) {
  const jsonLD = useStringToJSON(content)
  return (
    <>
      {jsonLD && (
        <JsonView
          data={jsonLD}
          shouldExpandNode={allExpanded}
          style={isDark ? darkStyles : defaultStyles}
        />
      )}
    </>
  )
}

function IndexPopup() {
  const [seoData] = useStorage<SEOData>("seoData", (data) => {
    return data ?? {}
  })
  const isDark = useIsDarkMode()
  return (
    <main className="w-480px d:f fxd:c">
      <header className="d:f jc:fe">
        <a
          className="td:n"
          href="https://github.com/tiangong-dev/seo-star"
          target="_blank">
          <h1 className="c-#ff2121 fz-12px lh-16px">SEO Star</h1>
        </a>
      </header>
      {seoData.CLS?.value || seoData.INP?.value || seoData.LCP?.value ? (
        <section className="mt-6px">
          <ul className="d:f colmg-6px">
            <li>
              <PerformanceItem
                name="CLS"
                value={seoData.CLS?.value}
                rating={seoData.CLS?.rating}
              />
            </li>
            <li>
              <PerformanceItem
                name="INP"
                value={seoData.INP?.value}
                rating={seoData.INP?.rating}
              />
            </li>
            <li>
              <PerformanceItem
                name="LCP"
                value={seoData.LCP?.value}
                rating={seoData.LCP?.rating}
              />
            </li>
          </ul>
        </section>
      ) : undefined}

      <section className="mt-6px">
        <table>
          <tbody>
            <DataItem label="URL" content={seoData.url}>
              <a href={seoData.url}>{seoData.url}</a>
            </DataItem>

            <DataItem label="Canonical URL" content={seoData.canonical}>
              <a href={seoData.canonical}>{seoData.canonical}</a>
            </DataItem>

            <DataItem label="Title" content={seoData.title} />

            <DataItem label="Description" content={seoData.description} />
            <DataItem label="Keywords" content={seoData.keywords} />
            <tr className="hr"></tr>
            {!seoData.ogType &&
            !seoData.ogTitle &&
            !seoData.ogImage &&
            !seoData.ogDescription &&
            !seoData.ogSiteName ? (
              <tr className="miss"> Miss OG Metadata</tr>
            ) : (
              <>
                {/* Basic Metadata */}
                <DataItem label="og:type" content={seoData.ogType} />
                <DataItem label="og:title" content={seoData.ogTitle} />
                <DataItem label="og:image" content={seoData.ogImage}>
                  <p>
                    <a href={seoData.ogImage}>{seoData.ogImage}</a>
                    <img
                      src={seoData.ogImage}
                      alt="og:image"
                      className="mt-6px w-100% mah-120px"
                      style={{
                        objectFit: "contain"
                      }}
                    />
                  </p>
                </DataItem>
                {/* Optional Metadata */}
                <DataItem
                  label="og:description"
                  content={seoData.ogDescription}
                />
                <DataItem
                  label="og:site_name"
                  content={seoData.ogDescription}
                />
              </>
            )}

            <tr className="hr"></tr>
            <DataItem label="H1" content={seoData.h1s?.[0]}>
              <ul>
                {seoData.h1s?.map((content, index) => (
                  <li key={index} className={`${index > 0 ? "c-f00" : ""}`}>
                    {content}
                  </li>
                ))}
              </ul>
            </DataItem>
            <tr className="hr"></tr>
            <DataItem
              label="JSON-LD"
              content={
                seoData.jsonLDs?.length > 0
                  ? seoData.jsonLDs.join("\n")
                  : undefined
              }>
              <ul className="d:f fxd:c">
                {seoData.jsonLDs?.map((content, index) => (
                  <li key={index} className="mb-6px">
                    <JsonLDContent content={content} isDark={isDark} />
                  </li>
                ))}
              </ul>
            </DataItem>
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default IndexPopup
