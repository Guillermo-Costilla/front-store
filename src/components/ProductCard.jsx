"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { useFavoritesStore } from "../store/favoritesStore"
import toast from "react-hot-toast"

export default function ProductCard({ product, compact = false }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()

  // Usar los campos correctos de la API 
  const displayPrice = product.precio_descuento || product.precio
  const hasDiscount = product.descuento > 0

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Crear objeto compatible con el carrito usando los campos de la API
    const cartProduct = {
      id: product.id,
      name: product.nombre,
      description: product.descripcion,
      price: displayPrice,
      image: product.imagen,
      stock: product.stock,
    }

    addItem(cartProduct)
    setIsLoading(false)
  }

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar favoritos")
      return
    }

    setIsFavoriteLoading(true)
    const isCurrentlyFavorite = isFavorite(product.id)

    try {
      if (isCurrentlyFavorite) {
        await removeFavorite(user.id, product.id)
      } else {
        await addFavorite(product, user.id)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  if (compact) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isLoading || product.stock === 0}
        className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${product.stock === 0
          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
          : "btn-primary hover:bg-primary-700"
          }`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            <span>{product.stock === 0 ? "Agotado" : "Agregar"}</span>
          </>
        )}
      </button>
    )
  }

  return (
    <Link to={`/producto/${product.id}`} className="block">
      <div className="card p-4 group hover:shadow-lg transition-shadow duration-300 animate-fade-in">
        {/* Imagen del producto */}
        <div className="relative mb-4 overflow-hidden rounded-lg">
          <img
            src={product.imagen || "/placeholder.svg?height=200&width=200"}
            alt={product.nombre}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge de descuento */}
          {product.descuento > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{product.descuento}%
            </div>
          )}

          {/* Botón de favoritos */}
          {isAuthenticated && (
            <button
              onClick={handleToggleFavorite}
              disabled={isFavoriteLoading}
              className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isFavorite(product.id)
                ? "bg-red-500 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-red-500"
                } ${isFavoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isFavoriteLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Overlay con botón de vista rápida */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
                <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </div>
            </div>
          </div>

          {/* Badge de stock bajo */}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
              ¡Últimas {product.stock} unidades!
            </div>
          )}

          {/* Badge sin stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold">Agotado</span>
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{product.nombre}</h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.descripcion}</p>

          {/* Rating */}
          {product.puntuacion && (
            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(Math.floor(product.puntuacion))}</div>
              <span className="text-sm text-gray-600 dark:text-gray-400">({product.puntuacion})</span>
            </div>
          )}

          {/* Precio */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">${(displayPrice).toFixed(2)}</span>
            {hasDiscount && <span className="text-sm text-gray-500 line-through">${product.precio}</span>}
          </div>

          {/* Categoría */}
          {product.categoria && (
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md text-xs">
              {product.categoria}
            </span>
          )}
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || product.stock === 0}
          className={`w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${product.stock === 0
            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
            : "btn-primary hover:bg-primary-700"
            }`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>{product.stock === 0 ? "Agotado" : "Agregar al Carrito"}</span>
            </>
          )}
        </button>
      </div>
    </Link>
  )
}
