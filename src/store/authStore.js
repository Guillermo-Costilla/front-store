import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI } from "../lib/api"
import toast from "react-hot-toast"

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(credentials)
          const { token, user } = response.data

          localStorage.setItem("token", token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("¡Bienvenido de vuelta!")
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al iniciar sesión"
          toast.error(message)
          return { success: false, error: message }
        }
      },

      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register(userData)
          const { token, user } = response.data

          localStorage.setItem("token", token)
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("¡Cuenta creada exitosamente!")
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al crear cuenta"
          toast.error(message)
          return { success: false, error: message }
        }
      },

      logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        toast.success("Sesión cerrada")
      },

      checkAuth: async () => {
        const token = localStorage.getItem("token")
        if (!token) return

        try {
          const response = await authAPI.getProfile()
          set({
            user: response.data,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },

      updateProfile: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.updateProfile(userData)
          set({
            user: response.data,
            isLoading: false,
          })
          toast.success("Perfil actualizado exitosamente")
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al actualizar perfil"
          toast.error(message)
          return { success: false, error: message }
        }
      },

      isAdmin: () => {
        const { user } = get()
        return user?.rol === "admin"
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
