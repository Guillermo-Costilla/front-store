import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { axiosInstance } from '../api/axios'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (userData) => set({ user: userData }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      
      login: async (credentials) => {
        try {
          const { data } = await axiosInstance.post('/users/login', credentials)
          set({ user: data.user, token: data.token, isAuthenticated: true })
          return { success: true }
        } catch (error) {
          console.error('Error de login:', error.response?.data || error.message);
          return { 
            success: false, 
            error: error.response?.data?.message || 'Error al iniciar sesión' 
          }
        }
      },

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      updateProfile: async (userData) => {
        try {
          console.log('Enviando actualización de perfil:', userData);
          const { data } = await axiosInstance.put('/users/profile', {
            nombre: userData.nombre,
            email: userData.email,
            imagen: userData.imagen
          })
          console.log('Respuesta de actualización:', data);
          
          set((state) => ({ 
            user: { 
              ...state.user, 
              nombre: data.user.nombre,
              email: data.user.email,
              imagen: data.user.imagen
            } 
          }))
          return { success: true }
        } catch (error) {
          console.error('Error al actualizar perfil:', error.response?.data || error.message);
          return { 
            success: false, 
            error: error.response?.data?.message || 'Error al actualizar el perfil' 
          }
        }
      },

      register: async (userData) => {
        try {
          const { data } = await axiosInstance.post('/users/register', userData);
          return { success: true, user: data.user };
        } catch (error) {
          console.error('Error de registro:', error.response?.data || error.message);
          return { success: false, error: error.response?.data?.message || 'Error al registrar el usuario' };
        }
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore 