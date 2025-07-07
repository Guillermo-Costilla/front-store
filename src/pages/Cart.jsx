import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from "../store/cartStore"
import { useAuthStore } from "../store/authStore"
import toast from "react-hot-toast"

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, getTotalWithTax } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [isUpdating, setIsUpdating] = useState(false)

  const { subtotal, tax, total } = getTotalWithTax()

  const handleQuantityChange = async (productId, newQuantity) => {
    setIsUpdating(true)
    updateQuantity(productId, newQuantity)
    setIsUpdating(false)
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para continuar con la compra")
      navigate("/login")
      return
    }
    navigate("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex flex-col items-center justify-center space-y-6">
          <ShoppingBag className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tu carrito está vacío</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Parece que aún no has agregado productos a tu carrito. Explora nuestra tienda para encontrar lo que buscas.
          </p>
          <Link to="/productos" className="btn-primary">
            Explorar Productos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                    <img
                      src={item.image || item.imagen}
                      alt={item.name || item.nombre}
                      className="w-full sm:w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 px-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">{item.name || item.nombre}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category && <span className="mr-2">{item.category || item.categoria}</span>}
                      {item.stock > 0 ? (
                        <span className="text-green-600">En stock</span>
                      ) : (
                        <span className="text-red-600">Agotado</span>
                      )}
                    </p>
                    <div className="mt-1 flex items-center">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        ${isNaN(Number(item.price)) ? "0.00" : Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isUpdating}
                        className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-md"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isUpdating || item.quantity >= item.stock}
                        className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-md"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resumen del Pedido</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium">${isNaN(Number(subtotal)) ? "0.00" : Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">IVA (16%)</span>
                <span className="font-medium">${isNaN(Number(tax)) ? "0.00" : Number(tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Envío</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-primary-600">${isNaN(Number(total)) ? "0.00" : Number(total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary mt-6 flex items-center justify-center space-x-2"
            >
              <span>Proceder al Pago</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="mt-6 text-center">
              <Link to="/productos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
