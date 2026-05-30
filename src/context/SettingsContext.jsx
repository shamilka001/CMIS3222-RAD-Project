"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  // 1. Initialize states with defaults or localStorage values
  const [theme, setTheme] = useState("dark")
  const [fontSize, setFontSize] = useState("normal")
  const [twoFactor, setTwoFactor] = useState(false)
  
  const [visibleComponents, setVisibleComponents] = useState({
    metrics: true,
    charts: true,
    ledger: true,
    aside: true,
  })

  // 2. Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin_theme") || "dark"
    const savedFontSize = localStorage.getItem("admin_font_size") || "normal"
    const saved2FA = localStorage.getItem("admin_2fa") === "true"
    const savedComponents = localStorage.getItem("admin_visible_components")

    setTheme(savedTheme)
    setFontSize(savedFontSize)
    setTwoFactor(saved2FA)
    if (savedComponents) setVisibleComponents(JSON.parse(savedComponents))
  }, [])

  // 3. Side effects to apply accessibility changes instantly to the HTML document
  useEffect(() => {
    // Handle Dark/Light Mode
    const root = window.document.documentElement
    if (theme === "light") {
      root.classList.add("light")
      root.style.setProperty("--bg-app", "#F8F9FA")
      root.style.setProperty("--bg-card", "#FFFFFF")
      root.style.setProperty("--text-main", "#1A1D20")
      root.style.setProperty("--border-main", "rgba(0, 0, 0, 0.06)")
    } else {
      root.classList.remove("light")
      root.style.setProperty("--bg-app", "#090A0B")
      root.style.setProperty("--bg-card", "#121417")
      root.style.setProperty("--text-main", "#F4F4F5")
      root.style.setProperty("--border-main", "rgba(255, 255, 255, 0.04)")
    }
    localStorage.setItem("admin_theme", theme)
  }, [theme])

  useEffect(() => {
    // Handle Global Font Scaling
    const root = window.document.documentElement
    if (fontSize === "small") root.style.fontSize = "13px"
    if (fontSize === "normal") root.style.fontSize = "15px"
    if (fontSize === "large") root.style.fontSize = "17px"
    localStorage.setItem("admin_font_size", fontSize)
  }, [fontSize])

  // 4. Persistence wrappers
  const toggleComponent = (key) => {
    setVisibleComponents((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      localStorage.setItem("admin_visible_components", JSON.stringify(updated))
      return updated
    })
  }

  const updateTwoFactor = (val) => {
    setTwoFactor(val)
    localStorage.setItem("admin_2fa", val)
  }

  return (
    <SettingsContext.Provider value={{
      theme, setTheme,
      fontSize, setFontSize,
      twoFactor, setTwoFactor: updateTwoFactor,
      visibleComponents, toggleComponent
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)