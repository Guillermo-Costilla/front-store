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

        if (newTheme) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      },

      initTheme: () => {
        const { isDark } = get()
        if (isDark) {
          document.documentElement.classList.add("dark")
        }
      },
    }),
    {
      name: "theme-storage",
    },
  ),
)
