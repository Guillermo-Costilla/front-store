"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Filter } from "lucide-react"
import { useFavoritesStore } from "../store/favoritesStore"
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"

export default function Favorites() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  const { favoriteProducts, loadFavorites, removeFavorite, getFavoritesByCategory } = useFavoritesStore()
  const { addItem } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFavorites(user.id).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, user?.id, loadFavorites])

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product.id,
      name: product.nombre,
      description: product.descripcion,
      price: product.precio_descuento || product.precio,
      image: product.imagen,
      stock: product.stock || 999,
    }
    addItem(cartProduct)
  }

  const handleRemoveFavorite = async (product) => {
    await removeFavorite(user.id, product.id)
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Inicia sesión para ver tus favoritos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Guarda tus productos favoritos para encontrarlos fácilmente más tarde
          </p>
          <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Heart className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No tienes favoritos aún</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Explora nuestros productos y agrega tus favoritos haciendo clic en el corazón ❤️
          </p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Explorar Productos</span>
          </Link>
        </div>
      </div>
    )
  }

  const favoritesByCategory = getFavoritesByCategory()
  const categories = Object.keys(favoritesByCategory)

  const filteredFavorites = selectedCategory === "all" ? favoriteProducts : favoritesByCategory[selectedCategory] || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Favoritos ❤️</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {favoriteProducts.length} producto{favoriteProducts.length !== 1 ? "s" : ""} guardado
            {favoriteProducts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Filtro por categoría */}
        {categories.length > 1 && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input min-w-[150px]"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category} ({favoritesByCategory[category].length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Estadísticas por categoría */}
      {categories.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <div
              key={category}
              className={`card p-4 cursor-pointer transition-colors ${selectedCategory === category
                  ? "ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              onClick={() => setSelectedCategory(category)}
            >
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{category}</h3>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {favoritesByCategory[category].length}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFavorites.map((product) => (
          <div key={product.id} className="card p-4 group hover:shadow-lg transition-shadow duration-300">
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <Link to={`/producto/${product.id}`}>
                <img
                  src={product.imagen || "/placeholder.svg?height=200&width=200"}
                  alt={product.nombre}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Badge de descuento */}
              {product.descuento > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  -{product.descuento}%
                </div>
              )}

              <button
                onClick={() => handleRemoveFavorite(product)}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>

            <div className="space-y-2">
              <Link to={`/producto/${product.id}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-primary-600">
                  {product.nombre}
                </h3>
              </Link>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.descripcion}</p>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  ${product.precio_descuento || product.precio}
                </span>
                {product.descuento > 0 && <span className="text-sm text-gray-500 line-through">${product.precio}</span>}
              </div>

              {product.categoria && (
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
                  {product.categoria}
                </span>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium btn-primary hover:bg-primary-700 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay favoritos en la categoría seleccionada */}
      {filteredFavorites.length === 0 && selectedCategory !== "all" && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No tienes favoritos en la categoría "{selectedCategory}"</p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-primary-600 hover:text-primary-700 font-medium mt-2"
          >
            Ver todos los favoritos
          </button>
        </div>
      )}
    </div>
  )
}
