export const createHeadObserver = (callback: () => void): MutationObserver => {
  const observer = new MutationObserver(() => callback())

  observer.observe(document.head, {
    childList: true,
    attributes: true,
    subtree: true
  })

  return observer
}

export const createHeadingTagsObserver = (
  callback: () => void
): MutationObserver => {
  const isHeadingElement = (element: Element): boolean =>
    /^h[1-6]$/i.test(element.tagName)

  const containsHeadingElement = (element: Element): boolean =>
    element.querySelector("h1, h2, h3, h4, h5, h6") !== null

  const isHeadingRelated = (node: Node): boolean => {
    if (node.nodeType !== Node.ELEMENT_NODE) return false

    const element = node as Element
    return isHeadingElement(element) || containsHeadingElement(element)
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const addedHeadingRelated = Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE && isHeadingRelated(node)
        )

        const removedHeadingRelated = Array.from(mutation.removedNodes).some(
          (node) =>
            node.nodeType === Node.ELEMENT_NODE && isHeadingRelated(node)
        )

        if (addedHeadingRelated || removedHeadingRelated) {
          callback()
          break
        }
      }

      if (mutation.type === "characterData") {
        const parent = mutation.target.parentElement
        if (parent && isHeadingElement(parent)) {
          callback()
          break
        }
      }
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  })

  return observer
}

export const observeExistingHeadings = (callback: () => void): void => {
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

  headings.forEach((heading) => {
    const observer = new MutationObserver(() => callback())

    observer.observe(heading, {
      characterData: true,
      childList: true,
      subtree: true
    })
  })
}

export const createObserverCleaner = (
  observers: MutationObserver[]
): (() => void) => {
  return () => observers.forEach((observer) => observer.disconnect())
}
