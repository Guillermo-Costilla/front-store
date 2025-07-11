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

  useEffect(() => {
    loadProducts()
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
            <div className="animate-slide-up">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"
                alt="Hero"
                className="w-full h-auto rounded-lg shadow-2xl"
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
