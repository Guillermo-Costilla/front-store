import { useCallback, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from 'axios';
import useCartStore from '../store/storeCart';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe("pk_test_51R0DGDCr7qNJfD5UIOTV4XrH9AMY9IYk6IaenLpZoTlYQAOwNAvWBYJMbcIJhjTlGIaONa80Vi1NB55HxD9hbCN10010FtOXzM");

const CheckoutForm = ({ processPayment }) => {
    const stripe = useStripe();
    const elements = useElements();
    const cartItems = useCartStore((state) => state.cartItems);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        await processPayment(); // Procesar el pago
        setTimeout(() => setIsLoading(false), 2000); // Simular carga
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
                        <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" required />
                    </div>

                    {/* Stripe Card Element */}
                    <div className="mb-6">
                        <label htmlFor="card" className="block text-gray-700 text-lg font-medium">Card Number</label>
                        <CardElement id="card" className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2" options={{ style: { base: { color: "#333", fontSize: "18px", iconColor: "#ccc", "::placeholder": { color: "#bbb" } }, invalid: { color: "#e22020" }, focus: { borderColor: "#0070f3" } } }} />
                    </div>

                    {/* Cardholder Name */}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 text-lg font-medium">Cardholder Name</label>
                        <input type="text" id="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500" placeholder="Full Name" required />
                    </div>

                    {/* Country */}
                    <div className="mb-6">
                        <label htmlFor="region" className="block text-gray-700 text-lg font-medium">Country or Region</label>
                        <input type="text" id="region" className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500" placeholder="Country/Region" required />
                    </div>

                    {/* Botón de pago con loader */}
                    <button type="submit" disabled={!stripe || isLoading} className={`w-full py-3 flex justify-center items-center bg-indigo-600 text-white text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${isLoading ? "opacity-70 cursor-wait" : "hover:bg-indigo-500 hover:scale-105"
                        }`}>
                        {isLoading ? (
                            <svg className="animate-spin w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeDasharray="30 10" />
                            </svg>
                        ) : (
                            "Pay Now"
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

const StripePayment = () => {
    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);
    const navigate = useNavigate(); // Hook de navegación para redirigir al inicio

    const processPayment = useCallback(async () => {
        if (cartItems.length === 0) {
            alert("The cart is empty. Add products before proceeding to checkout.");
            return;
        }

        try {
            const amount = Math.round(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100);
            const { data } = await axios.post('https://store-backend-7ws5.onrender.com/api/payments/process-pay', {
                token: 'tok_visa',
                amount,
                currency: 'usd',
                description: 'Pago de productos en carrito - 2025',
                items: cartItems
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Pago exitoso:", data);

            // Mostrar SweetAlert2
            Swal.fire({
                title: 'Payment successful!',
                text: 'Your payment was successfully processed.',
                icon: 'success',
                confirmButtonText: 'Go to Home!',
            }).then(() => {
                clearCart(); // Vaciar el carrito después del pago exitoso
                navigate('/'); // Redirigir al home
            });

        } catch (error) {
            console.error("Error al procesar el pago:", error.response?.data || error.message);

            // Mostrar SweetAlert2 para error
            Swal.fire({
                title: 'Payment processing error',
                text: 'There was an error processing the payment. Please try again.',
                icon: 'error',
                confirmButtonText: 'Try again',
            });
        }
    }, [cartItems, clearCart, navigate]);

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm processPayment={processPayment} />
        </Elements>
    );
};

export default StripePayment;
