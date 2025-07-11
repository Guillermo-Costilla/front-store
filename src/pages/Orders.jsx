import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Package, Clock, XCircle, Eye, Truck } from "lucide-react"
import { ordersAPI } from "../lib/api"
import { useAuthStore } from "../store/authStore"
import Swal from 'sweetalert2'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders()
    }
  }, [isAuthenticated])

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getUserOrders()
      setOrders(response.data)
    } catch (error) {
      Swal.fire('Error al cargar las órdenes', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente_envio":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "enviado":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "cancelado":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      pendiente_envio: "Pendiente de Envío",
      enviado: "Enviado",
      cancelado: "Cancelado",
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente_envio":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "enviado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pagado":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Inicia sesión para ver tus órdenes</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Accede a tu historial de compras y seguimiento de envíos
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-32"></div>
                    <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-24"></div>
                  </div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-20"></div>
                </div>
                <div className="bg-gray-300 dark:bg-gray-600 h-16 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No tienes órdenes aún</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">¡Realiza tu primera compra y aparecerá aquí!</p>
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <span>Explorar Productos</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Órdenes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Historial de {orders.length} orden{orders.length !== 1 ? "es" : ""}
        </p>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Orden #{order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.fecha_creacion).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.estado)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                    {getStatusText(order.estado)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.pago)}`}>
                    {order.pago === "pagado" ? "Pagado" : order.pago === "pendiente" ? "Pendiente" : "Cancelado"}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">${order.total}</p>
                </div>
              </div>
            </div>

            {/* Items de la orden */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.productos?.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{item.nombre}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cantidad: {item.cantidad} × ${item.precio}
                      </p>
                    </div>
                  </div>
                ))}
                {order.productos?.length > 3 && (
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="text-sm">+{order.productos.length - 3} más</span>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className="btn-secondary inline-flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>{selectedOrder === order.id ? "Ocultar" : "Ver"} Detalles</span>
                </button>

                {order.estado === "enviado" && (
                  <button className="btn-primary inline-flex items-center justify-center space-x-2">
                    <Truck className="h-4 w-4" />
                    <span>Rastrear Envío</span>
                  </button>
                )}

                {order.pago === "pagado" && (
                  <button className="btn-secondary inline-flex items-center justify-center space-x-2">
                    <span>Volver a Comprar</span>
                  </button>
                )}
              </div>
            </div>

            {/* Detalles expandidos */}
            {selectedOrder === order.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información de Pago</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estado de pago:</span>
                        <span
                          className={`font-medium ${order.pago === "pagado"
                            ? "text-green-600 dark:text-green-400"
                            : "text-yellow-600 dark:text-yellow-400"
                            }`}
                        >
                          {order.pago === "pagado" ? "Pagado" : "Pendiente"}
                        </span>
                      </div>
                      {order.stripe_payment_intent_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">ID de pago:</span>
                          <span className="font-medium text-xs">{order.stripe_payment_intent_id}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Método de pago:</span>
                        <span className="font-medium">Tarjeta de crédito</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Información de Envío</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                        <span className="font-medium">{getStatusText(order.estado)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Fecha estimada:</span>
                        <span className="font-medium">
                          {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lista completa de productos */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Productos</h4>
                  <div className="space-y-3">
                    {order.productos?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.nombre}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cantidad: {item.cantidad}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">${item.subtotal}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">${item.precio} c/u</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
