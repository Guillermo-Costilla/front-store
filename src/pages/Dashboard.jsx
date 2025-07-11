import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingBag, Heart, DollarSign, TrendingUp, Package, Star, Award, User, Mail, MapPin, Globe } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { useFavoritesStore } from "../store/favoritesStore"
import { ordersAPI, authAPI } from "../lib/api"
import Swal from 'sweetalert2'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSpent: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    favoriteProducts: 0,
    recentOrders: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  const { user, isAuthenticated, isAdmin } = useAuthStore()
  const { favorites, loadFavorites, getFavoritesByCategory } = useFavoritesStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Si es admin, redirigir al panel de admin
      if (isAdmin()) {
        navigate("/admin")
        return
      }

      loadDashboardData()
      loadFavorites(user.id)
      loadProfile()
    }
  }, [isAuthenticated, user?.id, isAdmin, navigate])

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setProfile(response.data)
    } catch (error) {
      console.error("Error loading profile:", error)
    }
  }

  const loadDashboardData = async () => {
    try {
      const ordersResponse = await ordersAPI.getUserOrders()
      const orders = ordersResponse.data

      const totalSpent = orders.reduce((sum, order) => sum + Number.parseFloat(order.total), 0)
      const completedOrders = orders.filter((order) => order.estado === "entregado").length
      const pendingOrders = orders.filter((order) =>
        ["pendiente", "procesando", "enviado"].includes(order.estado),
      ).length
      const recentOrders = orders.slice(0, 5)

      setStats({
        totalSpent,
        totalOrders: orders.length,
        completedOrders,
        pendingOrders,
        favoriteProducts: favorites.length,
        recentOrders,
      })
    } catch (error) {
      Swal.fire('Error al cargar datos del dashboard', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Inicia sesión para ver tu perfil</h2>
          <Link to="/login" className="btn-primary inline-flex items-center space-x-2">
            <span>Iniciar Sesión</span>
          </Link>
        </div>
      </div>
    )
  }

  const favoritesByCategory = getFavoritesByCategory()
  const topCategory = Object.entries(favoritesByCategory).sort(([, a], [, b]) => b.length - a.length)[0]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="bg-gray-300 dark:bg-gray-600 h-12 w-12 rounded-lg mb-4"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-8 rounded mb-2"></div>
                <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mi Perfil</h1>
        <p className="text-gray-600 dark:text-gray-400">Información de tu cuenta y actividad en la tienda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información del perfil */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Información Personal</h2>
                <p className="text-gray-600 dark:text-gray-400">Datos de tu cuenta</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.nombre || user?.nombre}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Nombre completo</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.email || user?.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Correo electrónico</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.pais || "No especificado"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">País</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {profile?.localidad ? `${profile.localidad}, ${profile.codigo_postal}` : "No especificado"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Localidad y código postal</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  {profile?.rol === "admin" ? "Administrador" : "Usuario"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas y actividad */}
        <div className="lg:col-span-2">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Gastado</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Órdenes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{favorites.length}</p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completadas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Órdenes recientes */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Órdenes Recientes</h2>
              <Link to="/ordenes" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Ver todas
              </Link>
            </div>

            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                        <Package className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Orden #{order.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(order.fecha_creacion).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">${order.total}</p>
                      <p
                        className={`text-xs px-2 py-1 rounded-full ${order.estado === "entregado"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          }`}
                      >
                        {order.estado}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No tienes órdenes aún</p>
                <Link to="/productos" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Explorar productos
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
