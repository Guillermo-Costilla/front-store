"use client"

import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Header from "./Header"
import Footer from "./Footer"
import { useAuthStore } from "../../store/authStore"
import { useThemeStore } from "../../store/themeStore"
import { useCartStore } from "../../store/cartStore"

export default function Layout() {
  const { checkAuth } = useAuthStore()
  const { initTheme } = useThemeStore()


  useEffect(() => {
    checkAuth()
    initTheme()


    // Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_title: document.title,
        page_location: window.location.href,
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
          },
        }}
      />
    </div>
  )
}
