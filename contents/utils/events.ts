export const registerNavigationListeners = (
  callback: () => void
): (() => void) => {
  const handleNavigation = () => callback()

  window.addEventListener("popstate", handleNavigation)

  return () => {
    window.removeEventListener("popstate", handleNavigation)
  }
}

export const registerVisibilityListener = (
  callback: () => void
): (() => void) => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      callback()
    }
  }

  window.addEventListener("visibilitychange", handleVisibilityChange)

  return () => {
    window.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}

export const registerAllEventListeners = (
  callback: () => void
): (() => void)[] => {
  const cleanupFunctions = [
    registerNavigationListeners(callback),
    registerVisibilityListener(callback)
  ]

  return cleanupFunctions
}
