import { create } from "zustand"
import { persist } from "zustand/middleware"
import { favoritesAPI, productsAPI } from "../lib/api"
import toast from "react-hot-toast"

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // IDs de productos favoritos
      favoriteProducts: [], // Productos completos
      isLoading: false,
      error: null,

      // Cargar favoritos del usuario
      loadFavorites: async (userId) => {
        if (!userId) return

        set({ isLoading: true })
        try {
          const response = await favoritesAPI.getByUserId(userId)
          const favoriteItems = response.data || []

          // Extraer IDs de productos
          const favoriteIds = favoriteItems.map((item) => item.producto_id)
          set({ favorites: favoriteIds })

          // Cargar detalles de productos
          const favoriteProducts = []
          for (const productId of favoriteIds) {
            try {
              const productResponse = await productsAPI.getById(productId)
              if (productResponse.data) {
                favoriteProducts.push(productResponse.data)
              }
            } catch (error) {
              console.error(`Error loading product ${productId}:`, error)
            }
          }

          set({
            favoriteProducts,
            isLoading: false,
          })
        } catch (error) {
          console.error("Error loading favorites:", error)
          set({ isLoading: false })
        }
      },

      // Añadir un producto a favoritos
      addFavorite: async (userId, productId) => {
        if (!userId || !productId) return

        try {
          await favoritesAPI.add({
            usuario_id: userId,
            producto_id: productId,
          })

          // Actualizar estado local
          const { favorites } = get()
          if (!favorites.includes(productId)) {
            set({ favorites: [...favorites, productId] })

            // Cargar detalles del producto
            const productResponse = await productsAPI.getById(productId)
            if (productResponse.data) {
              set((state) => ({
                favoriteProducts: [...state.favoriteProducts, productResponse.data],
              }))
            }
          }

          toast.success("Producto agregado a favoritos")
        } catch (error) {
          if (error.response?.status === 409) {
            toast.error("El producto ya está en favoritos")
          } else {
            console.error("Error adding favorite:", error)
            toast.error("Error al agregar a favoritos")
          }
        }
      },

      // Eliminar un producto de favoritos
      removeFavorite: async (userId, productId) => {
        if (!userId || !productId) return

        try {
          await favoritesAPI.remove({
            usuario_id: userId,
            producto_id: productId,
          })

          // Actualizar estado local
          const { favorites, favoriteProducts } = get()
          set({
            favorites: favorites.filter((id) => id !== productId),
            favoriteProducts: favoriteProducts.filter((product) => product.id !== productId),
          })

          toast.success("Producto eliminado de favoritos")
        } catch (error) {
          console.error("Error removing favorite:", error)
          toast.error("Error al eliminar de favoritos")
        }
      },

      // Verificar si un producto está en favoritos
      isFavorite: (productId) => {
  const state = get()
  const favorites = Array.isArray(state.favorites) ? state.favorites : []
  return favorites.includes(productId)
},


      // Alternar estado de favorito
      toggleFavorite: async (userId, productId) => {
        const { isFavorite } = get()

        if (isFavorite(productId)) {
          await get().removeFavorite(userId, productId)
        } else {
          await get().addFavorite(userId, productId)
        }
      },

      // Limpiar favoritos
      clearFavorites: () => {
        set({
          favorites: [],
          favoriteProducts: [],
        })
      },

      // Obtener productos favoritos por categoría
      getFavoritesByCategory: () => {
        const { favoriteProducts } = get()
        const categories = {}

        favoriteProducts.forEach((product) => {
          const category = product.categoria || "Sin categoría"
          if (!categories[category]) {
            categories[category] = []
          }
          categories[category].push(product)
        })

        return categories
      },
    }),
    {
      name: "favorites-storage",
    },
  ),
)
