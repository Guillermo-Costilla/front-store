import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authAPI } from "../lib/api"
import Swal from 'sweetalert2'

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

          Swal.fire('¡Bienvenido de vuelta!', '', 'success')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al iniciar sesión"
          Swal.fire(message, '', 'error')
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

          Swal.fire('¡Cuenta creada exitosamente!', '', 'success')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al crear cuenta"
          Swal.fire(message, '', 'error')
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
        Swal.fire('Sesión cerrada', '', 'success')
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
          Swal.fire('Perfil actualizado exitosamente', '', 'success')
          return { success: true }
        } catch (error) {
          set({ isLoading: false })
          const message = error.response?.data?.message || "Error al actualizar perfil"
          Swal.fire(message, '', 'error')
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
