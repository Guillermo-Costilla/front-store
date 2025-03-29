import { useCallback } from "react";
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        processPayment(); // Llamar a la función para procesar el pago
    };

    return (
        <form onSubmit={handleSubmit} className="flex max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg space-x-8">
            {/* Parte izquierda: productos en el carrito */}
            <div className="flex-1 p-4 border-r border-gray-300">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Purchase Summary</h2>
                <ul className="space-y-6">
                    {/* Mostrar productos del carrito */}
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <li key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Imagen del producto */}
                                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                                    <span className="text-gray-800 font-medium">{item.title}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-gray-500">Quantity: {item.quantity}</span>
                                    <span className="text-gray-800 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-500">You have no products in your shopping cart..</p>
                    )}
                </ul>
                <div className="mt-6 flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
            </div>

            {/* Parte derecha: Formulario de pago */}
            <div className="flex-1 p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment details</h2>

                {/* Correo electrónico */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        placeholder="Correo electrónico"
                        required
                    />
                </div>

                {/* Stripe Card Element */}
                <div className="mb-4">
                    <label htmlFor="card" className="block text-gray-700">Card number</label>
                    <CardElement
                        id="card"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        options={{
                            style: {
                                base: {
                                    color: "#333",
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    fontFamily: "'Inter', sans-serif",
                                    iconColor: "#ccc",
                                    "::placeholder": {
                                        color: "#aaa",
                                    },
                                },
                                invalid: {
                                    color: "#e22020",
                                },
                                focus: {
                                    borderColor: "#0070f3",
                                },
                            },
                        }}
                    />
                </div>

                {/* Nombre del titular */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700">First Name Card</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        placeholder="Nombre completo"
                        required
                    />
                </div>

                {/* Región o país */}
                <div className="mb-4">
                    <label htmlFor="region" className="block text-gray-700">Region or country</label>
                    <input
                        type="text"
                        id="region"
                        className="w-full p-3 border border-gray-300 rounded-md mt-2"
                        placeholder="País o región"
                        required
                    />
                </div>

                {/* Botón de pago */}
                <button
                    type="submit"
                    disabled={!stripe}
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Pay
                </button>
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
            alert("El carrito está vacío. Agrega productos antes de proceder al pago.");
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
                title: 'Pago exitoso!',
                text: 'Tu pago fue procesado con éxito.',
                icon: 'success',
                confirmButtonText: 'Ir al inicio',
            }).then(() => {
                clearCart(); // Vaciar el carrito después del pago exitoso
                navigate('/'); // Redirigir al home
            });

        } catch (error) {
            console.error("Error al procesar el pago:", error.response?.data || error.message);

            // Mostrar SweetAlert2 para error
            Swal.fire({
                title: 'Error al procesar el pago',
                text: 'Hubo un error al procesar el pago. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Intentar nuevamente',
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
