"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Edit, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { ordersAPI } from "../../lib/api"
import toast from "react-hot-toast"

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll()
      setOrders(response.data)
    } catch (error) {
      toast.error("Error al cargar órdenes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus)
      toast.success("Estado de la orden actualizado")
      loadOrders()
    } catch (error) {
      toast.error("Error al actualizar el estado")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente":
        return <Package className="h-5 w-5 text-yellow-500" />
      case "procesando":
        return <Edit className="h-5 w-5 text-blue-500" />
      case "enviado":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "entregado":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelado":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "procesando":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "enviado":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "entregado":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "cancelado":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.usuario?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.estado === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "procesando", label: "Procesando" },
    { value: "enviado", label: "Enviado" },
    { value: "entregado", label: "Entregado" },
    { value: "cancelado", label: "Cancelado" },
  ]

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded"></div>
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gestión de Órdenes</h1>
        <p className="text-gray-600 dark:text-gray-400">{orders.length} órdenes en total</p>
      </div>

      {/* Filtros */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input min-w-[150px]"
            >
              <option value="all">Todos los estados</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  {getStatusIcon(order.estado)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Orden #{order.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cliente: {order.usuario?.name || "Usuario"} ({order.usuario?.email || "email@ejemplo.com"})
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                    {statusOptions.find((s) => s.value === order.estado)?.label || order.estado}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.estado_pago === "pagado"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    {order.estado_pago === "pagado" ? "Pagado" : "Pendiente"}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">${order.total}</p>
                  {order.descuento > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400">Descuento: -${order.descuento}</p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowModal(true)
                    }}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Ver detalles"
                  >
                    <Eye className="h-5 w-5" />
                  </button>

                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items preview */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{order.items?.length || 0} productos</span>
                {order.cupon_aplicado && (
                  <span className="text-green-600 dark:text-green-400">Cupón: {order.cupon_aplicado}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No se encontraron órdenes que coincidan con los filtros</p>
        </div>
      )}

      {/* Modal de detalles */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Detalles de la Orden #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Información del cliente */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Información del Cliente</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white">
                      <strong>Nombre:</strong> {selectedOrder.usuario?.name || "Usuario"}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      <strong>Email:</strong> {selectedOrder.usuario?.email || "email@ejemplo.com"}
                    </p>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Productos Ordenados</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <img
                          src={item.producto?.image || "/placeholder.svg?height=50&width=50"}
                          alt={item.producto?.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.producto?.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Cantidad: {item.cantidad} × ${item.precio}
                          </p>
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${(item.cantidad * item.precio).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resumen de pago */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Resumen de Pago</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        $
                        {(
                          Number.parseFloat(selectedOrder.total) + Number.parseFloat(selectedOrder.descuento || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    {selectedOrder.descuento > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Descuento ({selectedOrder.cupon_aplicado}):</span>
                        <span>-${selectedOrder.descuento}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${selectedOrder.total}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estado de pago:</span>
                      <span
                        className={`font-medium ${
                          selectedOrder.estado_pago === "pagado"
                            ? "text-green-600 dark:text-green-400"
                            : "text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {selectedOrder.estado_pago === "pagado" ? "Pagado" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cambiar estado */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Cambiar Estado de la Orden</h3>
                  <select
                    value={selectedOrder.estado}
                    onChange={(e) => {
                      handleStatusChange(selectedOrder.id, e.target.value)
                      setSelectedOrder({ ...selectedOrder, estado: e.target.value })
                    }}
                    className="input w-full"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
