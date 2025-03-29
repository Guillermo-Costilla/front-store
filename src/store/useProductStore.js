import { create } from 'zustand'
import { axiosInstance, fakeStoreApi } from '../api/axios'

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const { data } = await fakeStoreApi.get('/products')
      set({ products: data, loading: false })
      return { success: true }
    } catch (error) {
      set({ loading: false, error: 'Error al cargar los productos' })
      return { success: false, error: 'Error al cargar los productos' }
    }
  },

  createProduct: async (productData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axiosInstance.post('/products', productData)
      set((state) => ({
        products: [...state.products, data],
        loading: false
      }))
      return { success: true, product: data }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Error al crear el producto' 
      })
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al crear el producto' 
      }
    }
  },

  updateProduct: async (id, productData) => {
    set({ loading: true, error: null })
    try {
      const { data } = await axiosInstance.put(`/products/${id}`, productData)
      set((state) => ({
        products: state.products.map(p => p.id === id ? data : p),
        loading: false
      }))
      return { success: true, product: data }
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Error al actualizar el producto' 
      })
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al actualizar el producto' 
      }
    }
  }
}))

export default useProductStore 