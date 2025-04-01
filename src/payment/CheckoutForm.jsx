import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const CheckoutForm = ({ processPayment, cartItems }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [cardError, setCardError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        region: ''
    });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Manejar cambios en el elemento de tarjeta
    const handleCardChange = (event) => {
        setCardError(event.error ? event.error.message : '');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error("Stripe no ha sido inicializado correctamente");
            Swal.fire({
                title: 'Error de inicialización',
                text: 'No se pudo inicializar el procesador de pagos',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            console.error("No se pudo obtener el elemento de tarjeta");
            return;
        }

        // Verificar si hay errores en la tarjeta antes de continuar
        if (cardError) {
            Swal.fire({
                title: 'Error en la tarjeta',
                text: cardError,
                icon: 'error',
                confirmButtonText: 'Corregir'
            });
            return;
        }

        setIsLoading(true);

        try {
            // Crear token con Stripe
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: formData.name,
                    email: formData.email
                }
            });

            if (error) {
                console.error("Error al validar la tarjeta:", error);
                Swal.fire({
                    title: 'Error en la tarjeta',
                    text: error.message || 'Tarjeta inválida',
                    icon: 'error',
                    confirmButtonText: 'Corregir'
                });
                setIsLoading(false);
                return;
            }

            // Si llegamos aquí, la tarjeta es válida
            console.log("Tarjeta validada exitosamente:", paymentMethod.id);

            // Procesar el pago con los datos del formulario y el token de la tarjeta
            await processPayment({
                ...formData,
                paymentMethodId: paymentMethod.id
            });
        } catch (error) {
            console.error("Error en el formulario de pago:", error);
            Swal.fire({
                title: 'Error en el pago',
                text: error.message || 'Ocurrió un error al procesar el pago',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        } finally {
            // Simular un tiempo de carga para mejor UX
            setTimeout(() => setIsLoading(false), 2000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="my-20 max-w-7xl mx-auto p-10 bg-white rounded-xl shadow-xl space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Resumen de compra - Izquierda en pantallas grandes */}
                <div className="p-6 border-r border-gray-300">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                    <ul className="space-y-6">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg shadow-md transition-all hover:scale-105" />
                                        <span className="text-gray-900 font-medium">{item.title}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-gray-500 text-sm">Quantity: {item.quantity}</span>
                                        <span className="text-gray-900 font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Your cart is empty.</p>
                        )}
                    </ul>
                    <div className="mt-8 flex justify-between text-xl font-semibold">
                        <span>Total</span>
                        <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                    </div>
                </div>

                {/* Formulario de pago - Derecha en pantallas grandes */}
                <div className="p-6">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-6">Payment Details</h2>

                    {/* Email */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-lg font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Ingresa tu email"
                            required
                        />
                    </div>

                    {/* Stripe Card Element */}
                    <div className="mb-2">
                        <label htmlFor="card" className="block text-gray-700 text-lg font-medium">Card Number</label>
                        <CardElement
                            id="card"
                            onChange={handleCardChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
                            options={{
                                style: {
                                    base: {
                                        color: "#333",
                                        fontSize: "18px",
                                        iconColor: "#ccc",
                                        "::placeholder": { color: "#bbb" }
                                    },
                                    invalid: { color: "#e22020" },
                                    focus: { borderColor: "#0070f3" }
                                }
                            }}
                        />
                    </div>

                    {/* Mensaje de error de tarjeta */}
                    {cardError && (
                        <div className="mb-4 text-red-600 text-sm font-medium">
                            {cardError}
                        </div>
                    )}

                    {/* Cardholder Name */}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 text-lg font-medium">Cardholder Name</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500"
                            placeholder="Nombre Completo"
                            required
                        />
                    </div>

                    {/* Country */}
                    <div className="mb-6">
                        <label htmlFor="region" className="block text-gray-700 text-lg font-medium">Country or Region</label>
                        <input
                            type="text"
                            id="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500"
                            placeholder="País/Región"
                            required
                        />
                    </div>

                    {/* Botón de pago con loader */}
                    <button
                        type="submit"
                        disabled={!stripe || isLoading || !!cardError}
                        className={`w-full py-3 flex justify-center items-center bg-indigo-600 text-white text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${isLoading || !!cardError ? "opacity-70 cursor-not-allowed" : "hover:bg-indigo-500 hover:scale-105"
                            }`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeDasharray="30 10" />
                            </svg>
                        ) : (
                            "Pay now"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

CheckoutForm.propTypes = {
    processPayment: PropTypes.func.isRequired,
    cartItems: PropTypes.array.isRequired
};

export default CheckoutForm; 