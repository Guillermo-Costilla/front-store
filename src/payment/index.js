/**
 * Archivo principal que exporta todos los componentes y servicios del módulo de pagos
 */

// Componentes
export { default as StripePayment } from './Payment';
export { default as CheckoutForm } from './CheckoutForm';

// Servicios
export { processPaymentRequest } from './paymentService';

// Manejo de errores
export { 
  handlePaymentError, 
  PaymentError, 
  PaymentErrorTypes 
} from './errorHandler';

// Tests (solo para entornos de desarrollo)
export { 
  testPagoExitoso, 
  testEscenariosFallo,
  runAllTests
} from './test';

// Configuración
export const PAYMENT_CONFIG = {
  API_URL: 'https://store-backend-7ws5.onrender.com/api/payments',
  TIMEOUT: 15000, // Aumentado a 15 segundos
  STRIPE_PUBLIC_KEY: 'pk_test_51R0DGDCr7qNJfD5UIOTV4XrH9AMY9IYk6IaenLpZoTlYQAOwNAvWBYJMbcIJhjTlGIaONa80Vi1NB55HxD9hbCN10010FtOXzM'
};