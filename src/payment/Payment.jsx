import { useState, useCallback, useEffect, useRef } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import useCartStore from "../store/storeCart"
import CheckoutForm from "./CheckoutForm"
import { createPaymentIntent, getStripePublicKey } from "./paymentService"
import { handlePaymentError } from "./errorHandler"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { ShoppingCart, AlertCircle, Wifi, WifiOff } from "lucide-react"

// Inicializar Stripe con la clave pública
let stripePromise = null



const StripePayment = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [clientSecret, setClientSecret] = useState("")
    const [paymentIntentId, setPaymentIntentId] = useState("")
    const [error, setError] = useState(null)
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    const cartItems = useCartStore((state) => state.cartItems)
    const clearCart = useCartStore((state) => state.clearCart)
    const navigate = useNavigate()
    const initializedRef = useRef(false)

    // Inicializar Stripe
    useEffect(() => {
        const initializeStripe = async () => {
            try {
                if (!stripePromise) {
                    const publicKey = await getStripePublicKey()
                    stripePromise = loadStripe(publicKey)
                }
                setIsLoading(false)
            } catch (error) {
                console.error("Error inicializando Stripe:", error)
                setError("Error al inicializar el sistema de pagos")
                setIsLoading(false)
            }
        }

        initializeStripe()
    }, [])

    // Monitorear conexión a internet
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener("online", handleOnline)
        window.addEventListener("offline", handleOffline)

        return () => {
            window.removeEventListener("online", handleOnline)
            window.removeEventListener("offline", handleOffline)
        }
    }, [])

    // Crear Payment Intent cuando el componente se monta
    useEffect(() => {
        if (!initializedRef.current && cartItems.length > 0 && !clientSecret) {
            initializedRef.current = true
            initializePayment()
        }
    }, [cartItems, clientSecret])

    useEffect(() => {
        console.log("🧠 useEffect montado – clientSecret:", clientSecret)
    }, [clientSecret])





    const initializePayment = async () => {
        if (cartItems.length === 0 || isLoading || clientSecret) return

        try {
            setIsLoading(true)
            setError(null)

            const amount = Math.round(
                cartItems.reduce((total, item) => total + item.precio * item.quantity, 0) * 100
            )

            const paymentData = {
                amount,
                currency: "usd",
                items: cartItems,
                customer: {
                    email: "temp@example.com",
                    name: "Cliente",
                    region: "US",
                },
            }

            const response = await createPaymentIntent(paymentData)
            console.log("📦 createPaymentIntent response:", response)
            const { data } = await createPaymentIntent(paymentData)
            console.log("📦 data recibida del backend:", data)


            if (response.success && response.client_secret) {
                setClientSecret(response.client_secret)
                setPaymentIntentId(response.payment_intent_id)
            } else {
                throw new Error("No se pudo crear el Payment Intent")
            }
        } catch (error) {
            console.error("Error inicializando pago:", error)
            const errorInfo = handlePaymentError(error)
            setError(errorInfo)
        } finally {
            setIsLoading(false)
        }
    }

    const processPayment = useCallback(
        async (paymentResult) => {
            if (!paymentResult || paymentResult.error) {
                const errorInfo = handlePaymentError(paymentResult?.error || new Error("Error en el pago"))

                await Swal.fire({
                    title: errorInfo.title,
                    text: errorInfo.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                    customClass: {
                        popup: "rounded-xl",
                        confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg",
                    },
                })
                return
            }

            try {
                setIsProcessing(true)

                // Mostrar confirmación de pago exitoso
                const result = await Swal.fire({
                    title: "¡Pago Exitoso! 🎉",
                    html: `
                    <div class="text-center">
                        <div class="mb-4">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <p class="text-gray-600">Tu pago se ha procesado correctamente.</p>
                            <p class="text-sm text-gray-500 mt-2">ID de transacción: ${paymentResult.paymentIntent?.id || "N/A"}</p>
                        </div>
                    </div>
                `,
                    icon: "success",
                    confirmButtonText: "Ir al Inicio",
                    showCancelButton: true,
                    cancelButtonText: "Ver Detalles",
                    customClass: {
                        popup: "rounded-xl",
                        confirmButton: "bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mr-2",
                        cancelButton: "bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg",
                    },
                })

                if (result.isConfirmed) {
                    clearCart()
                    navigate("/")
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Mostrar detalles del pago
                    await Swal.fire({
                        title: "Detalles del Pago",
                        html: `
                        <div class="text-left">
                            <p><strong>ID de Transacción:</strong> ${paymentResult.paymentIntent?.id || "N/A"}</p>
                            <p><strong>Estado:</strong> ${paymentResult.paymentIntent?.status || "Completado"}</p>
                            <p><strong>Monto:</strong> $${((paymentResult.paymentIntent?.amount || 0) / 100).toFixed(2)}</p>
                            <p><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</p>
                        </div>
                    `,
                        confirmButtonText: "Cerrar",
                        customClass: {
                            popup: "rounded-xl",
                            confirmButton: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg",
                        },
                    })
                }
            } catch (error) {
                console.error("Error procesando resultado del pago:", error)
                const errorInfo = handlePaymentError(error)

                await Swal.fire({
                    title: errorInfo.title,
                    text: errorInfo.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                    customClass: {
                        popup: "rounded-xl",
                        confirmButton: "bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg",
                    },
                })
            } finally {
                setIsProcessing(false)
            }
        },
        [clearCart, navigate],
    )

    // Verificar si el carrito está vacío
    if (cartItems.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 mt-20"
            >
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrito Vacío</h2>
                    <p className="text-gray-600 mb-6">Agrega productos a tu carrito antes de proceder al pago.</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Ir a Comprar
                    </button>
                </div>
            </motion.div>
        )
    }

    // Mostrar error de conexión
    if (!isOnline) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 mt-20"
            >
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin Conexión</h2>
                    <p className="text-gray-600 mb-6">Necesitas conexión a internet para procesar el pago.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            </motion.div>
        )
    }

    // Mostrar error de inicialización
    if (error && !isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 mt-20"
            >
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{error.title}</h2>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    <div className="space-y-2">
                        <button
                            onClick={initializePayment}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Reintentar
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </div>
            </motion.div>
        )
    }

    // Mostrar loading
    if (isLoading || !stripePromise || !clientSecret) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex items-center justify-center bg-gray-50 mt-20"
            >
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Inicializando Pago</h2>
                    <p className="text-gray-600">Preparando el sistema de pagos seguro...</p>
                    <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                        <Wifi className="w-4 h-4 mr-2" />
                        Conexión segura establecida
                    </div>
                </div>
            </motion.div>
        )
    }

    // Opciones para Stripe Elements
    const stripeOptions = {
        clientSecret,
        appearance: {
            theme: "stripe",
            variables: {
                colorPrimary: "#4f46e5",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, sans-serif",
                spacingUnit: "4px",
                borderRadius: "8px",
            },
            rules: {
                ".Input": {
                    border: "1px solid #d1d5db",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                },
                ".Input:focus": {
                    border: "1px solid #4f46e5",
                    boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
                },
            },
        },
        locale: "es",
    }

    return clientSecret ? (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm
                    processPayment={processPayment}
                    cartItems={cartItems}
                    isProcessing={isProcessing}
                    paymentIntentId={paymentIntentId}
                />
            </Elements>
        </motion.div>
    ) : (
        <p>⏳ Inicializando Pago... Preparando el sistema de pagos seguro.</p>
    )
}

export default StripePayment
