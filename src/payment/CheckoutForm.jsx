"use client"

import { useState, useEffect } from "react"
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js"
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Mail, Globe, ShieldCheck, Lock, AlertCircle, CheckCircle, ArrowLeft, Loader2 } from "lucide-react"

const CheckoutForm = ({ processPayment, cartItems, isProcessing, paymentIntentId }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [isPaymentElementReady, setIsPaymentElementReady] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        saveInfo: false,
    })

    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => total + item.precio * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 10
    const tax = subtotal * 0.21 // 21% de impuesto
    const total = subtotal + shipping + tax

    useEffect(() => {
        if (!stripe) return

        const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret")

        if (!clientSecret) return

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("¡Pago exitoso!")
                    break
                case "processing":
                    setMessage("Tu pago se está procesando.")
                    break
                case "requires_payment_method":
                    setMessage("Tu pago no se completó, intenta nuevamente.")
                    break
                default:
                    setMessage("Algo salió mal.")
                    break
            }
        })
    }, [stripe])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    // Agregar esta función antes del handleSubmit:
    const updatePaymentIntentWithCustomerData = async () => {
        try {
            // Aquí podrías hacer una llamada al backend para actualizar el Payment Intent
            // con los datos reales del cliente si es necesario
            console.log("Datos del cliente:", formData)
        } catch (error) {
            console.error("Error actualizando Payment Intent:", error)
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) {
            return
        }

        setIsLoading(true)
        setMessage("")

        try {
            // Actualizar Payment Intent con datos del cliente
            await updatePaymentIntentWithCustomerData()

            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment-success`,
                    receipt_email: formData.email,
                    payment_method_data: {
                        billing_details: {
                            name: formData.name,
                            email: formData.email,
                        },
                    },
                },
                redirect: "if_required",
            })

            if (error) {
                if (error.type === "card_error" || error.type === "validation_error") {
                    setMessage(error.message)
                } else {
                    setMessage("Ocurrió un error inesperado.")
                }
            } else if (paymentIntent && paymentIntent.status === "succeeded") {
                await processPayment({ paymentIntent })
            }
        } catch (err) {
            console.error("Error en el pago:", err)
            setMessage("Error al procesar el pago. Intenta nuevamente.")
        } finally {
            setIsLoading(false)
        }
    }

    const paymentElementOptions = {
        layout: "tabs",
        paymentMethodOrder: ["card", "apple_pay", "google_pay"],
        fields: {
            billingDetails: {
                name: "auto",
                email: "auto",
                phone: "auto",
                address: {
                    country: "auto",
                    line1: "auto",
                    line2: "auto",
                    city: "auto",
                    state: "auto",
                    postalCode: "auto",
                },
            },
        },
        terms: {
            card: "auto",
        },
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center mb-4"
                    >
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-indigo-600" />
                        </div>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold text-gray-900 mb-2"
                    >
                        Checkout Seguro
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600"
                    >
                        Completa tu compra de forma segura con encriptación SSL
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Resumen del pedido */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                                Resumen del Pedido
                            </h2>

                            {/* Lista de productos */}
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl"
                                    >
                                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                                            <img
                                                src={item.imagen || "/placeholder.svg?height=64&width=64"}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">{item.nombre}</h3>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                                                <span className="text-sm font-semibold text-gray-900">
                                                    ${(item.precio * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Totales */}
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Envío</span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-medium">Gratis</span>
                                    ) : (
                                        <span className="font-medium">${shipping.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">IVA (21%)</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Garantías de seguridad */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <ShieldCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    <span>Transacción 100% segura</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Lock className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    <span>Datos encriptados con SSL</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                    <span>Garantía de devolución</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Formulario de pago */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-7"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información de contacto */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-indigo-600" />
                                    Información de Contacto
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre Completo *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="saveInfo"
                                            checked={formData.saveInfo}
                                            onChange={handleInputChange}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Guardar información para futuras compras</span>
                                    </label>
                                </div>
                            </div>

                            {/* Información de pago */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
                                    Información de Pago
                                </h3>

                                {/* Payment Element de Stripe */}
                                <div className="mb-6">
                                    <PaymentElement
                                        id="payment-element"
                                        options={paymentElementOptions}
                                        onReady={() => setIsPaymentElementReady(true)}
                                    />
                                </div>

                                {/* Mensaje de error */}
                                <AnimatePresence>
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                            <span className="text-red-700 text-sm">{message}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Dirección de facturación */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Globe className="w-5 h-5 mr-2 text-indigo-600" />
                                    Dirección de Facturación
                                </h3>

                                <AddressElement
                                    options={{
                                        mode: "billing",
                                        allowedCountries: ["US", "AR", "MX", "ES", "CO", "CL", "PE"],
                                        blockPoBox: true,
                                        fields: {
                                            phone: "always",
                                        },
                                        validation: {
                                            phone: {
                                                required: "always",
                                            },
                                        },
                                    }}
                                />
                            </div>

                            {/* Botón de pago */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <motion.button
                                    type="submit"
                                    disabled={isLoading || !stripe || !elements || isProcessing}
                                    className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${isLoading || !stripe || !elements || isProcessing
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        }`}
                                    whileHover={!isLoading && stripe && elements && !isProcessing ? { scale: 1.02 } : {}}
                                    whileTap={!isLoading && stripe && elements && !isProcessing ? { scale: 0.98 } : {}}
                                >
                                    {isLoading || isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            {isProcessing ? "Procesando..." : "Preparando pago..."}
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5 mr-2" />
                                            Pagar ${total.toFixed(2)} de forma segura
                                        </>
                                    )}
                                </motion.button>

                                {/* Información legal */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        Al completar tu pedido, aceptas nuestros{" "}
                                        <a href="#" className="text-indigo-600 hover:underline">
                                            Términos de Servicio
                                        </a>{" "}
                                        y{" "}
                                        <a href="#" className="text-indigo-600 hover:underline">
                                            Política de Privacidad
                                        </a>
                                    </p>
                                </div>

                                {/* Métodos de pago aceptados */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 text-center mb-3">Métodos de pago aceptados</p>
                                    <div className="flex justify-center items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                                VISA
                                            </div>
                                            <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                                MC
                                            </div>
                                            <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                                AMEX
                                            </div>
                                        </div>
                                        <div className="text-gray-400">|</div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-5 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">
                                                PAY
                                            </div>
                                            <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                                GPay
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de volver */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Volver al carrito
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

CheckoutForm.propTypes = {
    processPayment: PropTypes.func.isRequired,
    cartItems: PropTypes.array.isRequired,
    isProcessing: PropTypes.bool,
    paymentIntentId: PropTypes.string,
}

CheckoutForm.defaultProps = {
    isProcessing: false,
    paymentIntentId: "",
}

export default CheckoutForm
