import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useCartStore from '../store/storeCart';
import CheckoutForm from './CheckoutForm';
import { processPaymentRequest } from './paymentService';
import { handlePaymentError } from './errorHandler';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const stripePromise = loadStripe("pk_test_51R0DGDCr7qNJfD5UIOTV4XrH9AMY9IYk6IaenLpZoTlYQAOwNAvWBYJMbcIJhjTlGIaONa80Vi1NB55HxD9hbCN10010FtOXzM");

const StripePayment = () => {
    const cartItems = useCartStore((state) => state.cartItems);
    const clearCart = useCartStore((state) => state.clearCart);
    const navigate = useNavigate();

    const processPayment = useCallback(async (formData = {}) => {
        if (cartItems.length === 0) {
            Swal.fire({
                title: 'Empty cart',
                text: 'Add products before making the payment.',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Verificar que tengamos un token de pago válido
        if (!formData.paymentMethodId) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Card information has not been validated correctly.',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        try {
            const amount = Math.round(cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100);
            const paymentData = {
                token: formData.paymentMethodId, // Usar el token de pago de Stripe
                amount,
                currency: 'usd',
                description: 'Pago de productos en carrito - 2025',
                items: cartItems,
                customer: {
                    email: formData.email || '',
                    name: formData.name || '',
                    region: formData.region || ''
                }
            };

            // Mostrar confirmación antes de procesar el pago
            const confirmResult = await Swal.fire({
                title: 'Confirm pay',
                text: `Are you sure about making the payment by $${(amount / 100).toFixed(2)}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, make payment',
                cancelButtonText: 'Cancel'
            });

            if (!confirmResult.isConfirmed) {
                return; // El usuario canceló el pago
            }

            // Mostrar carga mientras procesamos el pago
            Swal.fire({
                title: 'Processing payment',
                text: 'Please wait while we process your payment...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await processPaymentRequest(paymentData);

            if (response && response.success) {
                Swal.fire({
                    title: 'Successful payment!',
                    text: 'Your payment has been processed successfully.',
                    icon: 'success',
                    confirmButtonText: '¡Go to home!'
                }).then(() => {
                    clearCart();
                    navigate('/');
                });
            } else {
                throw new Error('Respuesta de pago inválida');
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);

            // Usar el manejador de errores para obtener información detallada
            const errorInfo = handlePaymentError(error);

            Swal.fire({
                title: errorInfo.title,
                text: errorInfo.message,
                icon: 'error',
                confirmButtonText: 'Try again'
            });
        }
    }, [cartItems, clearCart, navigate]);

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm processPayment={processPayment} cartItems={cartItems} />
        </Elements>
    );
};

export default StripePayment;
