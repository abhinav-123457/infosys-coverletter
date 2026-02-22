'use client'

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const THEME_KEY = "covercraft_theme"

type Theme = "dark" | "light"

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Server-side rendering guard
    if (typeof window === "undefined") return "light"

    const stored = localStorage.getItem(THEME_KEY) as Theme | null

    if (stored && (stored === "dark" || stored === "light")) {
      return stored
    }

    // Fallback to system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement

    // Clean up both classes first
    root.classList.remove("light", "dark")

    // Apply the chosen theme
    root.classList.add(theme)

    // Persist choice
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  // Listen for system theme changes (only if user hasn't set a manual preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if there's no stored user preference
      if (localStorage.getItem(THEME_KEY) === null) {
        setTheme(e.matches ? "dark" : "light")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  const isDark = theme === "dark"

  return (
    <Button
      id="tour-theme-toggle"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 relative overflow-hidden"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ease-in-out ${
          isDark ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ease-in-out ${
          isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        }`}
      />
    </Button>
  )
}

export default ThemeToggle