import { useEffect } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export function useThemeMode() {
  const prefersDarkMode =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false

  const [darkMode, setDarkMode] = useStorage<boolean>(
    "darkMode",
    prefersDarkMode
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e) => {
      const darkModeFromStorage = localStorage.getItem(
        "plasmo_storage_darkMode"
      )
      if (darkModeFromStorage === null) {
        setDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return { darkMode, setDarkMode }
}
