import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react"
import { productsAPI } from "../lib/api"
import { useAuthStore } from "../store/authStore"
import { useCartStore } from "../store/cartStore"
import { useFavoritesStore } from "../store/favoritesStore"
import ProductCard from "../components/ProductCard"
import Swal from 'sweetalert2'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { user, isAuthenticated } = useAuthStore()
  const { addItem } = useCartStore()
  const { addFavorite, removeFavorite, isFavorite, favorites } = useFavoritesStore()

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      const response = await productsAPI.getById(id)
      const productData = response.data

      // Procesar imágenes
      const processedProduct = {
        ...productData,
        imagesParsed: productData.imagenes ? JSON.parse(productData.imagenes) : [productData.imagen],
      }

      setProduct(processedProduct)
      loadRelatedProducts(productData.categoria)
    } catch (error) {
      Swal.fire('Error al cargar el producto', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const loadRelatedProducts = async (category) => {
    try {
      const response = await productsAPI.getAll({ category })
      const related = response.data.filter((p) => p.id !== id).slice(0, 4)

      setRelatedProducts(related)
    } catch (error) {
      console.error("Error loading related products:", error)
    }
  }

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      name: product.nombre,
      description: product.descripcion,
      price: product.precio_descuento || product.precio,
      image: product.imagen,
      stock: product.stock,
    }
    addItem(cartProduct, quantity)
  }

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      Swal.fire('Debes iniciar sesión para agregar favoritos', '', 'error')
      return
    }

    const isCurrentlyFavorite = isFavorite(product.id)

    if (isCurrentlyFavorite) {
      const favorite = favorites.find((fav) => fav.producto_id === product.id)
      await removeFavorite(favorite.id, product.id)
    } else {
      await addFavorite(product, user.id)
    }
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.imagesParsed.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.imagesParsed.length) % product.imagesParsed.length)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 dark:bg-gray-600 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 dark:bg-gray-600 h-8 rounded w-3/4"></div>
              <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-1/2"></div>
              <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded"></div>
              <div className="bg-gray-300 dark:bg-gray-600 h-12 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Producto no encontrado</h2>
        <Link to="/productos" className="btn-primary">
          Ver todos los productos
        </Link>
      </div>
    )
  }

  const displayPrice = product.precio_descuento || product.precio
  const hasDiscount = product.descuento > 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
        <Link to="/" className="hover:text-primary-600">
          Inicio
        </Link>
        <span>/</span>
        <Link to="/productos" className="hover:text-primary-600">
          Productos
        </Link>
        {product.categoria && (
          <>
            <span>/</span>
            <Link to={`/productos?category=${product.categoria}`} className="hover:text-primary-600">
              {product.categoria}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{product.nombre}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.imagesParsed[currentImageIndex] || "/placeholder.svg?height=500&width=500"}
              alt={product.nombre}
              className="w-full h-96 object-cover rounded-lg"
            />

            {product.imagesParsed.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Badge de descuento */}
            {product.descuento > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                -{product.descuento}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.imagesParsed.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.imagesParsed.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex ? "border-primary-500" : "border-gray-200 dark:border-gray-700"
                    }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.nombre} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.nombre}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.puntuacion || 0)}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  ({product.puntuacion || 0}) • {product.views || 0} vistas
                </span>
              </div>

              {product.categoria && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {product.categoria}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">${Number(displayPrice).toFixed(0)}</span>
              {hasDiscount && <span className="text-xl text-gray-500 line-through">${Number(product.precio).toFixed(0)}</span>}
              {product.descuento > 0 && (
                <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 px-2 py-1 rounded-md text-sm font-semibold">
                  Ahorra {product.descuento}%
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.descripcion}</p>
          </div>

          {/* Stock */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Disponibilidad:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
            >
              {product.stock > 0 ? `${product.stock} en stock` : "Agotado"}
            </span>
          </div>

          {/* Cantidad y botones */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad:</label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${product.stock === 0 ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed" : "btn-primary"
                  }`}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{product.stock === 0 ? "Agotado" : "Agregar al Carrito"}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleToggleFavorite}
                  className={`p-3 rounded-lg border transition-colors ${isFavorite(product.id)
                    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                >
                  <Heart className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Beneficios */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="h-5 w-5 text-green-600" />
                <span>Envío gratis +$500</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Compra protegida</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span>30 días devolución</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
