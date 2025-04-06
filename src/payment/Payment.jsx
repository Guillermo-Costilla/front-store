import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useCartStore from '../store/storeCart';
import CheckoutForm from './CheckoutForm';
import { processPaymentRequest } from './paymentService';
import { handlePaymentError, PaymentErrorTypes } from './errorHandler';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const stripePromise = loadStripe("pk_test_51R0DGDCr7qNJfD5UIOTV4XrH9AMY9IYk6IaenLpZoTlYQAOwNAvWBYJMbcIJhjTlGIaONa80Vi1NB55HxD9hbCN10010FtOXzM");

const StripePayment = () => {
    const [isLoading, setIsLoading] = useState(false);
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

        try {
            const amount = Math.round(cartItems.reduce((total, item) =>
                total + item.price * item.quantity, 0
            ) * 100);

            const paymentData = {
                token: formData.paymentMethodId,
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

            const confirmResult = await Swal.fire({
                title: 'Confirm pay',
                text: `Are you sure about making the payment by $${(amount / 100).toFixed(2)}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, make payment',
                cancelButtonText: 'Cancel'
            });

            if (!confirmResult.isConfirmed) {
                return;
            }

            setIsLoading(true);

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
                throw new Error('Invalid payment response');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            const errorInfo = handlePaymentError(error);

            Swal.fire({
                title: errorInfo.title,
                text: errorInfo.message,
                icon: 'error',
                confirmButtonText: 'Try again'
            });
        } finally {
            setIsLoading(false);
        }
    }, [cartItems, clearCart, navigate]);

    return (
        <Elements stripe={stripePromise}>
            {isLoading ? (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Inicializando pago...</p>
                    </div>
                </div>
            ) : (
                <CheckoutForm
                    processPayment={processPayment}
                    cartItems={cartItems}
                />
            )}
        </Elements>
    );
};

export default StripePayment;
