import { useState, useEffect } from "react"
import { Search, Filter, Eye, Edit, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { adminAPI } from "../../lib/api"
import Swal from 'sweetalert2'

export default function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [openDropdownOrderId, setOpenDropdownOrderId] = useState(null);

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await adminAPI.getOrders()
      setOrders(response.data.ordenes || response.data)
    } catch (error) {
      Swal.fire('Error al cargar órdenes', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus, newPaymentStatus) => {
    try {
      const statusData = {}
      if (newStatus) statusData.estado = newStatus
      if (newPaymentStatus) statusData.pago = newPaymentStatus

      await adminAPI.updateOrderStatus(orderId, statusData)
      Swal.fire('Estado de la orden actualizado', '', 'success')
      loadOrders()
    } catch (error) {
      Swal.fire('Error al actualizar el estado', '', 'error')
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pendiente_envio":
        return <Package className="h-5 w-5 text-yellow-500" />
      case "enviado":
        return <Truck className="h-5 w-5 text-blue-500" />
      case "cancelado":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
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

  const getStatusText = (status) => {
    const statusMap = {
      pendiente_envio: "Pendiente de Envío",
      enviado: "Enviado",
      cancelado: "Cancelado",
    }
    return statusMap[status] || status
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || order.estado === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { value: "pendiente_envio", label: "Pendiente de Envío" },
    { value: "enviado", label: "Enviado" },
    { value: "cancelado", label: "Cancelado" },
  ]

  const paymentStatusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "pagado", label: "Pagado" },
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
                    Cliente: {order.cliente?.nombre || "Usuario"} ({order.cliente?.email || "email@ejemplo.com"})
                  </p>
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

              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                    {getStatusText(order.estado)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.pago === "pagado"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      }`}
                  >
                    {order.pago === "pagado" ? "Pagado" : order.pago === "pendiente" ? "Pendiente" : "Cancelado"}
                  </span>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">${order.total}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setOpenDropdownOrderId(openDropdownOrderId === order.id ? null : order.id)}
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

                  <select
                    value={order.pago}
                    onChange={(e) => handleStatusChange(order.id, null, e.target.value)}
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {paymentStatusOptions.map((status) => (
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
                <span>{order.productos?.length || 0} productos</span>
                {order.direccion && (
                  <span className="text-blue-600 dark:text-blue-400">
                    Envío: {order.direccion}, {order.localidad}
                  </span>
                )}
              </div>
            </div>
            {openDropdownOrderId === order.id && (
              <div className="mt-2 ml-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-full max-w-md text-sm z-10">
                <div className="mb-2">
                  <span className="font-semibold">Usuario:</span> {order.cliente?.nombre || "N/A"}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Email:</span> {order.cliente?.email || "N/A"}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Dirección:</span> {order.direccion}, {order.localidad}, {order.provincia}, {order.codigo_postal}
                </div>
                <div>
                  <span className="font-semibold">Productos:</span>
                  <ul className="ml-4 mt-1 space-y-1">
                    {order.productos?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.nombre}</span>
                        <span className="text-gray-500">x{item.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No se encontraron órdenes que coincidan con los filtros</p>
        </div>
      )}
    </div>
  )
}
