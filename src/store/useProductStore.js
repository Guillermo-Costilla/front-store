import { create } from "zustand"
import { axiosInstance, fakeStoreApi } from "../api/axios"

const useProductStore = create((set) => ({
  products: [],
  userProducts: [], // Nuevo estado para los productos del usuario
  loading: false,
  error: null,

  // Mantener el fetchProducts original de la fake store API
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await fakeStoreApi.get("/products")
      set({ products: data, loading: false })
      return { success: true }
    } catch (error) {
      set({ loading: false, error: "Error al cargar los productos" })
      return { success: false, error: "Error al cargar los productos" }
    }
  },

  // Nuevo método para obtener los productos del usuario
  fetchUserProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await axiosInstance.get("/products")
      set({ userProducts: data, loading: false })
      return { success: true, products: data }
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al cargar tus productos",
      })
      return {
        success: false,
        error: error.response?.data?.message || "Error al cargar tus productos",
      }
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axiosInstance.post("/products", productData)
      set((state) => ({
        userProducts: [...state.userProducts, data], // Actualizar los productos del usuario
        loading: false,
      }))
      return { success: true, product: data }
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al crear el producto",
      })
      return {
        success: false,
        error: error.response?.data?.message || "Error al crear el producto",
      }
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axiosInstance.put(`/products/${id}`, productData)
      set((state) => ({
        userProducts: state.userProducts.map((p) => (p.id === id ? data : p)),
        loading: false,
      }))
      return { success: true, product: data }
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al actualizar el producto",
      })
      return {
        success: false,
        error: error.response?.data?.message || "Error al actualizar el producto",
      }
    }
  },

  // Agregar método para eliminar producto
  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      await axiosInstance.delete(`/products/${id}`)
      set((state) => ({
        userProducts: state.userProducts.filter((p) => p.id !== id),
        loading: false,
      }))
      return { success: true }
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || "Error al eliminar el producto",
      })
      return {
        success: false,
        error: error.response?.data?.message || "Error al eliminar el producto",
      }
    }
  },
}))

export default useProductStore

