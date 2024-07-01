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

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

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
            <tr>
              <th>URL</th>
              <td>
                <a href={seoData.url}>{seoData.url}</a>
              </td>
            </tr>
            <tr>
              <th>Canonical URL</th>
              <td>
                <a href={seoData.canonical}>{seoData.canonical}</a>
              </td>
            </tr>
            <tr>
              <th>Title</th>
              <td>{seoData.title}</td>
            </tr>
            <tr>
              <th>Description</th>
              <td>{seoData.description}</td>
            </tr>
            <tr>
              <th>Keywords</th>
              <td>{seoData.keywords}</td>
            </tr>
            <tr className="hr"></tr>
            <tr>
              <th>og:type</th>
              <td>{seoData.ogType}</td>
            </tr>
            <tr>
              <th>og:title</th>
              <td>{seoData.ogTitle}</td>
            </tr>
            <tr>
              <th>og:description</th>
              <td>{seoData.ogDescription}</td>
            </tr>
            <tr>
              <th>og:image</th>
              <td>{seoData.ogImage}</td>
            </tr>
            <tr className="hr"></tr>
            <tr>
              <th>H1</th>
              <td>{seoData.h1?.[0]}</td>
            </tr>
            <tr className="hr"></tr>
            <tr>
              <th>JSON-LD</th>
              <td>
                {jsonLD && (
                  <JsonView
                    data={jsonLD}
                    shouldExpandNode={allExpanded}
                    style={defaultStyles}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default IndexPopup
