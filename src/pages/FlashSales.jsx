import { useState, useEffect } from "react"
import { Clock, Zap, FlameIcon as Fire } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { productsAPI } from "../lib/api"
import Swal from 'sweetalert2'

export default function FlashSales() {
  const [flashSales, setFlashSales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    loadFlashSales()

    // Simular countdown para flash sale
    const endTime = new Date()
    endTime.setHours(23, 59, 59, 999) // Hasta el final del día

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loadFlashSales = async () => {
    try {
      const response = await productsAPI.getAll()
      const products = response.data

      // Usar productos con descuento real de la API
      const flashProducts = products
        .filter((product) => product.descuento > 0)
        .slice(0, 8)
        .map((product) => ({
          ...product,
          flashSaleEnd: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
          soldCount: Math.floor(Math.random() * 50) + 10,
          totalStock: product.stock,
        }))

      setFlashSales(flashProducts)
    } catch (error) {
      Swal.fire('Error al cargar ofertas flash', '', 'error')
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header con countdown */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Fire className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Flash Sales</h1>
          <Zap className="h-8 w-8 text-yellow-500" />
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">¡Ofertas increíbles por tiempo limitado!</p>

        {/* Countdown */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6" />
            <span className="text-lg font-semibold">Termina en:</span>
          </div>

          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.hours.toString().padStart(2, "0")}</div>
              <div className="text-sm opacity-90">Horas</div>
            </div>
            <div className="text-3xl font-bold">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.minutes.toString().padStart(2, "0")}</div>
              <div className="text-sm opacity-90">Min</div>
            </div>
            <div className="text-3xl font-bold">:</div>
            <div className="text-center">
              <div className="text-3xl font-bold">{timeLeft.seconds.toString().padStart(2, "0")}</div>
              <div className="text-sm opacity-90">Seg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flashSales.map((product) => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>

      {/* Banner promocional */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Te perdiste las ofertas?</h2>
        <p className="text-lg mb-6">Suscríbete para recibir notificaciones de nuestras próximas flash sales</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Tu email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
          />
          <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
            Suscribirse
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente especializado para productos en flash sale
function FlashSaleCard({ product }) {
  const progressPercentage = (product.soldCount / product.totalStock) * 100
  const displayPrice = product.precio_descuento || product.precio
  const hasDiscount = product.descuento > 0

  return (
    <div className="card p-4 group hover:shadow-lg transition-shadow duration-300 animate-fade-in relative overflow-hidden">
      {/* Badge de flash sale */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-md text-xs font-bold z-10">
        FLASH SALE
      </div>

      {/* Badge de descuento */}
      {product.descuento > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold z-10">
          -{product.descuento}%
        </div>
      )}

      {/* Imagen del producto */}
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <img
          src={product.imagen || "/placeholder.svg?height=200&width=200"}
          alt={product.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{product.nombre}</h3>

        {/* Precios */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-red-600 dark:text-red-400">${(displayPrice).toFixed(2)}</span>
            {hasDiscount && <span className="text-sm text-gray-500 line-through">${product.precio}</span>}
          </div>
          {hasDiscount && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
              Ahorras ${(product.precio - displayPrice).toFixed(2)}
            </div>
          )}
        </div>

        {/* Progreso de ventas */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Vendidos: {product.soldCount}</span>
            <span>Disponibles: {product.totalStock - product.soldCount}</span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>

          <div className="text-xs text-center text-gray-600 dark:text-gray-400">
            {progressPercentage >= 80 ? "¡Casi agotado!" : `${progressPercentage.toFixed(0)}% vendido`}
          </div>
        </div>

        {/* Botón de compra */}
        <ProductCard product={product} compact={true} />
      </div>
    </div>
  )
}
