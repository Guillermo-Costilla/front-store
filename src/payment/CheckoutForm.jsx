import { useState } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import PropTypes from "prop-types"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { CreditCard, Mail, User, Globe, ShieldCheck, Lock, AlertCircle, ChevronRight } from "lucide-react"
import { handlePaymentError, PaymentError, PaymentErrorTypes } from './errorHandler';

const CheckoutForm = ({ processPayment, cartItems }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [cardError, setCardError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        region: "",
    })
    const [activeStep, setActiveStep] = useState(1)

    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 10
    const tax = subtotal * 0.05 // 5% de impuesto simulado
    const total = subtotal + shipping + tax

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    // Manejar cambios en el elemento de tarjeta
    const handleCardChange = (event) => {
        setCardError(event.error ? event.error.message : "")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("No se puede procesar el pago");
            return;
        }

        setIsLoading(true);
        setActiveStep(2);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
                billing_details: {
                    name: formData.name,
                    email: formData.email,
                }
            });

            if (error) {
                throw new PaymentError(
                    error.message,
                    PaymentErrorTypes.CARD,
                    { code: error.code }
                );
            }

            setActiveStep(3);
            await processPayment({
                paymentMethodId: paymentMethod.id,
                ...formData
            });

        } catch (error) {
            console.error("Error en el pago:", error);
            setActiveStep(2);

            const errorInfo = handlePaymentError(error);

            Swal.fire({
                title: errorInfo.title,
                text: errorInfo.message,
                icon: "error",
                confirmButtonText: "Entendido",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Animaciones
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gray-50 py-12 mt-20"
        >
            <div className="max-w-6xl mx-auto px-4">
                {/* Pasos del checkout */}
                <div className="mb-10">
                    <div className="flex justify-center items-center mb-8">
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                1
                            </div>
                            <span className={`ml-2 font-medium ${activeStep >= 1 ? "text-indigo-600" : "text-gray-500"}`}>Cart</span>
                        </div>
                        <div className={`w-16 h-1 mx-2 ${activeStep >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                2
                            </div>
                            <span className={`ml-2 font-medium ${activeStep >= 2 ? "text-indigo-600" : "text-gray-500"}`}>
                                Payment
                            </span>
                        </div>
                        <div className={`w-16 h-1 mx-2 ${activeStep >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                        <div className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                3
                            </div>
                            <span className={`ml-2 font-medium ${activeStep >= 3 ? "text-indigo-600" : "text-gray-500"}`}>
                                Confirmation
                            </span>
                        </div>
                    </div>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Resumen de compra - Izquierda */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50 to-blue-50 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <ShoppingBagIcon className="w-6 h-6 mr-2 text-indigo-600" />
                                Order Summary
                            </h2>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="flex items-start space-x-4 bg-white p-4 rounded-xl shadow-sm"
                                            whileHover={{ scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.image || "/placeholder.svg"}
                                                    alt={item.title}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.title}</h3>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                                    <div className="text-sm font-semibold text-indigo-600">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 italic">Your cart is empty.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 space-y-3 border-t border-gray-200 pt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span className="font-medium">${shipping.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                                    <span>Total</span>
                                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 bg-white p-4 rounded-xl border border-indigo-100">
                                <div className="flex items-center text-sm text-gray-600">
                                    <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                                    <span>All transactions are secure and encrypted</span>
                                </div>
                            </div>
                        </div>

                        {/* Formulario de pago - Derecha */}
                        <div className="lg:col-span-3 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <CreditCard className="w-6 h-6 mr-2 text-indigo-600" />
                                Payment Details
                            </h2>

                            {/* Email */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <Mail className="w-5 h-5 mr-2 text-indigo-500" />
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                    <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>

                            {/* Cardholder Name */}
                            <div className="mb-6">
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-indigo-500" />
                                    Cardholder Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                    <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>

                            {/* Country */}
                            <div className="mb-8">
                                <label htmlFor="region" className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <Globe className="w-5 h-5 mr-2 text-indigo-500" />
                                    Country or Region
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="United States"
                                        required
                                    />
                                    <Globe className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                </div>
                            </div>

                            {/* Stripe Card Element */}
                            <div className="mb-6">
                                <label htmlFor="card" className="block text-gray-700 font-medium mb-2 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-indigo-500" />
                                    Card Information
                                </label>
                                <div className="bg-white border border-gray-300 rounded-lg p-4 transition-all hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                                    <CardElement
                                        id="card"
                                        onChange={handleCardChange}
                                        options={{
                                            style: {
                                                base: {
                                                    color: "#424770",
                                                    fontFamily: "Arial, sans-serif",
                                                    fontSize: "16px",
                                                    fontSmoothing: "antialiased",
                                                    "::placeholder": { color: "#aab7c4" },
                                                    iconColor: "#666EE8",
                                                },
                                                invalid: {
                                                    color: "#e5424d",
                                                    iconColor: "#e5424d",
                                                },
                                            },
                                            hidePostalCode: true,
                                        }}
                                    />
                                </div>

                                {/* Mensaje de error de tarjeta */}
                                {cardError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-2 flex items-start text-red-600 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                                        <span>{cardError}</span>
                                    </motion.div>
                                )}

                                <div className="mt-3 flex items-center text-xs text-gray-500">
                                    <Lock className="w-4 h-4 mr-1 text-gray-400" />
                                    <span>Your payment information is encrypted and secure</span>
                                </div>
                            </div>

                            {/* Botón de pago con loader */}
                            <motion.button
                                type="submit"
                                disabled={!stripe || isLoading || !!cardError}
                                className={`w-full py-4 flex justify-center items-center bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ${isLoading || !!cardError || !stripe ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-700"
                                    }`}
                                whileHover={!isLoading && !cardError && stripe ? { scale: 1.02 } : {}}
                                whileTap={!isLoading && !cardError && stripe ? { scale: 0.98 } : {}}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Lock className="mr-2 h-5 w-5" />
                                        Pay ${total.toFixed(2)} Securely
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </div>
                                )}
                            </motion.button>

                            <p className="mt-4 text-center text-xs text-gray-500">
                                By clicking "Pay Securely", you agree to our{" "}
                                <a href="#" className="text-indigo-600 hover:underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-indigo-600 hover:underline">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </motion.form>
            </div>
        </motion.div>
    )
}

// Componente de icono de bolsa de compras
const ShoppingBagIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
)

CheckoutForm.propTypes = {
    processPayment: PropTypes.func.isRequired,
    cartItems: PropTypes.array.isRequired,
}

export default CheckoutForm

