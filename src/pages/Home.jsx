import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, TrendingUp, Zap, Shield, Truck } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { productsAPI } from "../lib/api"
import Swal from 'sweetalert2'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [offers, setOffers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [])

  // Carrusel automático con transición suave
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCarouselIndex((prev) => (prev + 1) % imagenes.length)
        setFade(true)
      }, 400) // duración del fade-out
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll({ limit: 8 })
      const products = response.data

      setFeaturedProducts(products.slice(0, 4))
      setOffers(products.filter((p) => p.discount).slice(0, 4))
    } catch (error) {
      Swal.fire('Error al cargar productos', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const imagenes = [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    "https://i5.walmartimages.com/asr/6403388f-2eac-407f-bd23-c79cea9c5e3c.0fa7d11b6d3043bff5c207ff39e6a16b.jpeg",
    "https://i5.walmartimages.com/seo/Furbo-360-Rotating-Treat-Tossing-1080p-WiFi-Pet-Camera-with-2-Way-Audio-Barking-Alerts_249a15e6-443b-4b0c-ac47-87e5ff47b2b7.fe9da9838fb87afd2b54ad142fedbfde.jpeg",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    "https://nextgames.com.ar/img/Public/1040-producto-switch-neon-2-1455.jpg",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
  ]

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary-600" />,
      title: "Envío Gratis",
      description: "En compras mayores a $500",
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Compra Segura",
      description: "Protección total en tus pagos",
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-600" />,
      title: "Entrega Rápida",
      description: "Recibe tus productos en 24-48h",
    },
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Descubre los
                <span className="block text-yellow-300">Mejores Productos</span>
              </h1>
              <p className="text-xl text-primary-100">
                Encuentra todo lo que necesitas con la mejor calidad y precios increíbles. ¡Envío gratis en compras
                mayores a $500!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/productos"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <span>Ver Productos</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/ofertas"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center space-x-2"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Ver Ofertas</span>
                </Link>
              </div>
            </div>
            <div className="animate-slide-up flex items-center justify-center">
              <img
                src={imagenes[carouselIndex]}
                alt={`Hero ${carouselIndex + 1}`}
                className={`w-full h-auto rounded-lg shadow-2xl transition-opacity duration-700 ${fade ? 'opacity-100' : 'opacity-0'}`}
                style={{ maxHeight: 400, objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Productos Destacados</h2>
          <Link
            to="/productos"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Ofertas Especiales */}
      {offers.length > 0 && (
        <section className="bg-gray-100 dark:bg-gray-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🔥 Ofertas Especiales</h2>
              <Link
                to="/ofertas"
                className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center space-x-1"
              >
                <span>Ver todas las ofertas</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¡No te pierdas nuestras ofertas!</h2>
          <p className="text-xl text-primary-100 mb-8">
            Suscríbete a nuestro newsletter y recibe descuentos exclusivos
          </p>
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
      </section>
    </div>
  )
}
