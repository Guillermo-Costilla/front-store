import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,

      toggleTheme: () => {
        const { isDark } = get()
        const newTheme = !isDark

        set({ isDark: newTheme })

        // Aplicar el tema al documento
        if (newTheme) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },

      setTheme: (isDark) => {
        set({ isDark })

        // Aplicar el tema al documento
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },

      initTheme: () => {
        const { isDark } = get()

        // Aplicar el tema inicial
        if (isDark) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({
        isDark: state.isDark,
      }),
    },
  ),
)
