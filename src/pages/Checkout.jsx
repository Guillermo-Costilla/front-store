import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { CreditCard, Lock, Tag, MapPin, ShoppingBag } from 'lucide-react'
import { getStripe } from "../lib/stripe"
import { useCartStore } from "../store/cartStore"
import { useCouponsStore } from "../store/couponsStore"
import { useAuthStore } from "../store/authStore"
import { paymentsAPI, ordersAPI } from "../lib/api"
import Swal from 'sweetalert2'

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()

  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [couponCode, setCouponCode] = useState("")
  const [shippingInfo, setShippingInfo] = useState({
    direccion: "",
    localidad: "",
    provincia: "",
    codigo_postal: "",
  })
  const [createdOrderId, setCreatedOrderId] = useState(null)
  const [polling, setPolling] = useState(false)

  const { items, getTotalWithTax, clearCart } = useCartStore()
  const { appliedCoupon, applyCoupon, removeCoupon, calculateDiscount } = useCouponsStore()
  const { user, isAuthenticated } = useAuthStore()

  const { subtotal, tax, total } = getTotalWithTax()
  const discount = calculateDiscount(subtotal)
  const finalTotal = total - discount

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    if (items.length === 0) {
      navigate("/ordenes")
      return
    }
  }, [isAuthenticated, items.length, navigate])

  // Flujo correcto: primero crear la orden, luego procesar el pago
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validar información de envío
    if (!shippingInfo.direccion || !shippingInfo.localidad || !shippingInfo.provincia || !shippingInfo.codigo_postal) {
      Swal.fire('Por favor completa toda la información de envío', '', 'error')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Crear la orden en el backend primero (sin payment_intent_id)
      const orderData = {
        productos: items.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
        })),
        direccion: shippingInfo.direccion,
        localidad: shippingInfo.localidad,
        provincia: shippingInfo.provincia,
        codigo_postal: shippingInfo.codigo_postal,
      }

      console.log("Creando orden con datos:", orderData)
      console.log("Items del carrito:", items)
      console.log("Productos mapeados:", items.map((item) => ({
        producto_id: item.id,
        cantidad: item.quantity,
      })))
      console.log("Formato esperado según README:", {
        productos: [
          { producto_id: "uuid1", cantidad: 2 },
          { producto_id: "uuid2", cantidad: 1 }
        ],
        direccion: "Av. Corrientes 1234",
        localidad: "Buenos Aires",
        provincia: "Buenos Aires",
        codigo_postal: "1043"
      })

      const orderResponse = await ordersAPI.create(orderData)

      console.log("Respuesta de creación de orden:", orderResponse)
      console.log("Respuesta completa de orden:", orderResponse.data)
      console.log("Keys de la respuesta de orden:", Object.keys(orderResponse.data || {}))

      // Según la documentación, debería devolver un objeto con id
      const orderId = orderResponse.data?.id

      console.log("Order ID encontrado:", orderId)

      if (!orderId) {
        console.error("Respuesta incompleta de la orden:", orderResponse.data)
        throw new Error("No se pudo crear la orden")
      }

      setCreatedOrderId(orderId)

      // 2. Crear PaymentIntent con Stripe
      const paymentIntentData = {
        amount: Math.round(finalTotal * 100), // Convertir a centavos
        currency: "usd",
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        customer: {
          email: user?.email || "",
          name: user?.nombre || user?.name || ""
        }
      }

      console.log("Creando PaymentIntent con datos:", paymentIntentData)
      console.log("Total final:", finalTotal)
      console.log("Amount en centavos:", Math.round(finalTotal * 100))
      console.log("Items mapeados para PaymentIntent:", items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })))
      console.log("Formato esperado según README:", {
        amount: 5000,
        currency: "usd",
        items: [
          { id: "uuid1", name: "Producto 1", price: 1000, quantity: 2 },
          { id: "uuid2", name: "Producto 2", price: 2000, quantity: 1 }
        ],
        customer: { email: "juan@mail.com", name: "Juan" }
      })

      const paymentIntentResponse = await paymentsAPI.createPaymentIntent(paymentIntentData)

      console.log("Respuesta de PaymentIntent:", paymentIntentResponse)
      console.log("Respuesta completa:", paymentIntentResponse.data)
      console.log("Keys de la respuesta:", Object.keys(paymentIntentResponse.data || {}))

      // Según la documentación, debería devolver client_secret y payment_intent_id
      const clientSecret = paymentIntentResponse.data?.client_secret
      const paymentIntentId = paymentIntentResponse.data?.payment_intent_id

      console.log("Client Secret encontrado:", clientSecret)
      console.log("Payment Intent ID encontrado:", paymentIntentId)

      if (!clientSecret || !paymentIntentId) {
        console.error("Respuesta incompleta del PaymentIntent:", paymentIntentResponse.data)
        throw new Error("No se pudo crear el PaymentIntent")
      }

      setClientSecret(clientSecret)

      // 3. Confirmar el pago con Stripe
      const cardElement = elements.getElement(CardElement)

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.nombre || user?.name || "",
            email: user?.email || "",
            address: {
              line1: shippingInfo.direccion,
              city: shippingInfo.localidad,
              state: shippingInfo.provincia,
              postal_code: shippingInfo.codigo_postal,
              country: "AR", // Argentina por defecto
            },
          },
        },
      })

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          Swal.fire(error.message, '', 'error')
        } else if (error.code === "PAYMENT_METHOD_REJECTED" || paymentIntent?.status === "requires_payment_method") {
          Swal.fire('La tarjeta fue rechazada. Por favor, intenta con otra tarjeta.', '', 'error')
        } else {
          Swal.fire('Error inesperado en el pago', '', 'error')
        }
        return
      }

      if (paymentIntent.status === "succeeded") {
        // 4. Confirmar el pago en el backend
        try {
          await paymentsAPI.confirmPayment({
            payment_intent_id: paymentIntentId,
            payment_method_id: paymentIntent.payment_method,
            order_id: orderId
          })
        } catch (confirmError) {
          console.error("Error confirmando pago:", confirmError)
          // No fallar aquí, el pago ya fue exitoso en Stripe
        }

        // Limpiar carrito y cupones
        clearCart()
        removeCoupon()
        Swal.fire('¡Pago procesado exitosamente!', '', 'success')
        setPolling(true)
        // Redirigir a órdenes después de polling
      }
    } catch (error) {
      console.error("Error processing order:", error)
      console.error("Error response:", error.response)
      console.error("Error data:", error.response?.data)
      console.error("Error status:", error.response?.status)
      console.error("Error message:", error.message)

      let errorMessage = 'Error al procesar la orden'

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }

      Swal.fire(errorMessage, '', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (couponCode.trim()) {
      await applyCoupon(couponCode, subtotal)
    }
  }

  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1f2937", // Gris oscuro para modo claro
        "::placeholder": {
          color: "#9ca3af",
        },
        ":-webkit-autofill": {
          color: "#1f2937",
        },
      },
      invalid: {
        color: "#ef4444",
      },
    },
  }

  // Polling para actualizar el estado de la orden
  useEffect(() => {
    let interval
    if (polling && createdOrderId) {
      interval = setInterval(async () => {
        try {
          const response = await ordersAPI.getUserOrders()
          const order = response.data.find((o) => o.id === createdOrderId)
          if (order && order.pago === "pagado") {
            Swal.fire('¡El pago de tu orden fue confirmado!', '', 'success')
            setPolling(false)
            navigate("/ordenes")
          }
        } catch (error) {
          // Ignorar errores de polling
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [polling, createdOrderId, navigate])

  if (!isAuthenticated || items.length === 0) {
    return null // Los useEffect manejarán la redirección
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de checkout */}
        <div className="space-y-6">
          {/* Información de envío */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información de Envío</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={shippingInfo.direccion}
                  onChange={handleShippingChange}
                  required
                  className="input"
                  placeholder="Calle, número, colonia"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Localidad</label>
                  <input
                    type="text"
                    name="localidad"
                    value={shippingInfo.localidad}
                    onChange={handleShippingChange}
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Provincia</label>
                  <input
                    type="text"
                    name="provincia"
                    value={shippingInfo.provincia}
                    onChange={handleShippingChange}
                    required
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Código Postal
                </label>
                <input
                  type="text"
                  name="codigo_postal"
                  value={shippingInfo.codigo_postal}
                  onChange={handleShippingChange}
                  required
                  className="input"
                />
              </div>
            </div>
          </div>

          {/* Información de pago */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Información de Pago</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Información de la Tarjeta
                </label>
                <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 stripe-card-element">
                  <CardElement options={cardElementOptions} />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="h-4 w-4" />
                <span>Tu información está protegida con encriptación SSL</span>
              </div>

              <button
                type="submit"
                disabled={!stripe || isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${isProcessing ? "bg-gray-400 cursor-not-allowed" : "btn-primary"
                  }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Procesando...</span>
                  </div>
                ) : (
                  `Pagar $${finalTotal.toFixed(2)}`
                )}
              </button>
            </form>
          </div>

          {/* Cupones */}
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Tag className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cupón de Descuento</h2>
            </div>

            {appliedCoupon ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Cupón aplicado: {appliedCoupon.code}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Descuento: ${Number(discount).toFixed(2)}</p>

                  </div>
                  <button onClick={removeCoupon} className="text-red-600 hover:text-red-700 font-medium">
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Código del cupón"
                  className="flex-1 input"
                />
                <button type="button" onClick={handleApplyCoupon} className="btn-secondary">
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <div className="card p-6">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resumen del Pedido</h2>
            </div>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image || "/placeholder.svg?height=50&width=50"}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cantidad: {item.quantity} • ${Number(item.price).toFixed(2)} c/u
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium">${Number(subtotal).toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>-${Number(discount).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">IVA (16%):</span>
                <span className="font-medium">${Number(tax).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Envío:</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span className="text-primary-600">${Number(finalTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card p-6 mt-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Información de Envío</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Envío gratis en todas las compras</p>
              <p>• Entrega en 48 horas hábiles</p>
              <p>• Seguimiento incluido</p>
              <p>• Garantía de satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Checkout() {
  const [stripePromise, setStripePromise] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStripe = async () => {
      try {
        const stripe = await getStripe()
        setStripePromise(stripe)
      } catch (error) {
        console.error("Error loading Stripe:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStripe()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="bg-gray-300 dark:bg-gray-600 h-32 rounded"></div>
                </div>
              ))}
            </div>
            <div className="card p-6">
              <div className="bg-gray-300 dark:bg-gray-600 h-64 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error al cargar el sistema de pagos</h1>
          <p className="text-gray-600 dark:text-gray-400">Por favor, intenta recargar la página</p>
        </div>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
