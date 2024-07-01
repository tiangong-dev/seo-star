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
      <th
        className={`ta:l d:f colmg-4px ${content ? "cur:p" : "op-.6"}`}
        onClick={() => {
          if (content) copyToClipboard(content)
        }}
        title={`Copy ${label}`}>
        <span>{copied ? "✅" : "📄"}</span>
        {label}
      </th>
      <td className="ov:h">{content ? children ?? content : ""}</td>
    </tr>
  )
}
function IndexPopup() {
  const [seoData, setSeoData] = useStorage("seoData", (val) => val ?? {})

  const [jsonLD, setJsonLD] = useState(undefined)

  useEffect(() => {
    if (!seoData.jsonLdScript) {
      setJsonLD(undefined)
      return
    }
    try {
      setJsonLD(JSON.parse(seoData.jsonLdScript))
    } catch (e) {
      // nothing
    }
  }, [seoData])

  return (
    <main className="w-480px">
      <header className="d:f jc:fe">
        <a href="https://github.com/tiangong-dev/seo-star" target="_blank">
          <h1 className="c-#ff2121 fz-12px lh-16px">SEO Star</h1>
        </a>
      </header>
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
            <DataItem label="og:type" content={seoData.ogType} />
            <DataItem label="og:title" content={seoData.ogTitle} />
            <DataItem label="og:description" content={seoData.ogDescription} />
            <DataItem label="og:image" content={seoData.ogImage}>
              <img
                src={seoData.ogImage}
                alt="og:image"
                className="w-100% mah-120px"
                style={{
                  objectFit: "contain"
                }}
              />
            </DataItem>
            <tr className="hr"></tr>
            <DataItem label="H1" content={seoData.h1?.[0]} />
            <tr className="hr"></tr>
            <DataItem label="JSON-LD" content={seoData.jsonLdScript}>
              {jsonLD && (
                <JsonView
                  data={jsonLD}
                  shouldExpandNode={allExpanded}
                  style={defaultStyles}
                />
              )}
            </DataItem>
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default IndexPopup
