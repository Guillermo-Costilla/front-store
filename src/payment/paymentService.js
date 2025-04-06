import axios from 'axios';
import { PaymentError, PaymentErrorTypes, handlePaymentError } from './errorHandler';
import { PAYMENT_CONFIG } from './index';

/**
 * Valida los datos de pago antes de enviarlos al servidor
 * @param {Object} paymentData - Datos del pago a validar
 * @throws {PaymentError} - Lanza error personalizado si la validación falla
 */
const validatePaymentData = (paymentData) => {
  if (!paymentData) {
    throw new PaymentError('No se proporcionaron datos de pago', PaymentErrorTypes.VALIDATION);
  }

  const { token, amount, currency, items } = paymentData;

  if (!token) {
    throw new PaymentError('Token de pago no proporcionado', PaymentErrorTypes.VALIDATION);
  }

  // Validar que el token sea un formato válido (comienza con pm_ o tok_)
  if (typeof token !== 'string' || (!token.startsWith('pm_') && !token.startsWith('tok_'))) {
    throw new PaymentError('Token de pago inválido', PaymentErrorTypes.VALIDATION);
  }

  if (!amount || isNaN(amount) || amount <= 0) {
    throw new PaymentError('Monto de pago inválido', PaymentErrorTypes.VALIDATION);
  }

  if (!currency) {
    throw new PaymentError('Moneda no especificada', PaymentErrorTypes.VALIDATION);
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new PaymentError('No hay elementos en el carrito para procesar', PaymentErrorTypes.VALIDATION);
  }
};

/**
 * Realiza la solicitud de procesamiento de pago al servidor
 * @param {Object} paymentData - Datos del pago a procesar
 * @returns {Promise<Object>} - Respuesta del servidor
 * @throws {PaymentError} - Errores personalizados durante el proceso
 */
export const processPaymentRequest = async (paymentData) => {
  try {
    const response = await axios.post(`${PAYMENT_CONFIG.API_URL}/process-pay`, paymentData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: PAYMENT_CONFIG.TIMEOUT
    });

    return response.data;
  } catch (error) {
    throw new PaymentError(
      'Error al procesar el pago',
      PaymentErrorTypes.PAYMENT_FAILED,
      { originalError: error.message }
    );
  }
};

/**
 * Verifica la validez de una tarjeta a través de Stripe
 * @param {Object} cardDetails - Detalles de la tarjeta de crédito
 * @param {string} paymentMethodId - ID del método de pago generado por Stripe
 * @returns {Promise<boolean>} - Si la tarjeta es válida o no
 */
export const verifyCardValidity = async (paymentMethodId) => {
  try {
    if (!paymentMethodId) {
      throw new PaymentError(
        'No se proporcionó un ID de método de pago válido', 
        PaymentErrorTypes.CARD
      );
    }

    // En un entorno real, aquí verificaríamos con Stripe si la tarjeta es válida
    // Por ahora, simplemente asumimos que si comienza con pm_ es válido
    const isValid = typeof paymentMethodId === 'string' && paymentMethodId.startsWith('pm_');
    
    if (!isValid) {
      throw new PaymentError(
        'El método de pago proporcionado no es válido',
        PaymentErrorTypes.CARD
      );
    }

    return true;
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    
    throw new PaymentError(
      error.message || 'Error al verificar la validez de la tarjeta',
      PaymentErrorTypes.CARD
    );
  }
};

/**
 * Simula un proceso de tokenización de tarjeta
 * En producción esto se haría con Stripe.js directamente
 * @param {Object} cardDetails - Detalles de la tarjeta
 * @returns {Promise<Object>} - Token simulado
 */
export const getCardToken = async (cardDetails) => {
  try {
    // Simular validación de tarjeta
    if (!cardDetails || !cardDetails.number) {
      throw new PaymentError(
        'Información de tarjeta inválida', 
        PaymentErrorTypes.CARD
      );
    }

    // Validar formato de tarjeta (número de 16 dígitos)
    const cardNumber = cardDetails.number.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      throw new PaymentError(
        'El número de tarjeta debe tener 16 dígitos', 
        PaymentErrorTypes.CARD
      );
    }

    // En producción, esto sería un llamado a Stripe.js
    // Aquí simplemente simulamos el proceso
    return { token: 'tok_visa', last4: cardNumber.slice(-4) };
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error;
    }
    
    console.error('Error al obtener token de tarjeta:', error);
    throw new PaymentError(
      error.message || 'No se pudo procesar la información de la tarjeta', 
      PaymentErrorTypes.CARD
    );
  }
};

/**
 * Crea un intent de pago
 * @param {number} amount - Monto del pago
 * @returns {Promise<string>} - Client secret del intent de pago
 * @throws {PaymentError} - Error al crear el intent de pago
 */
export const createPaymentIntent = async (amount) => {
  if (!amount || amount <= 0) {
    throw new PaymentError(
      'El monto del pago es inválido',
      PaymentErrorTypes.VALIDATION
    );
  }

  try {
    const response = await axios.post(`${PAYMENT_CONFIG.API_URL}/create-payment-intent`, {
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'usd',
      payment_method_types: ['card']
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: PAYMENT_CONFIG.TIMEOUT
    });

    if (!response.data || !response.data.clientSecret) {
      console.error('Respuesta del servidor:', response.data);
      throw new PaymentError(
        'El servidor no devolvió un token de pago válido',
        PaymentErrorTypes.SERVER
      );
    }

    return response.data.clientSecret;

  } catch (error) {
    console.error('Error completo:', error);

    if (error.response) {
      // Error con respuesta del servidor
      throw new PaymentError(
        `Error del servidor: ${error.response.data?.message || 'Error desconocido'}`,
        PaymentErrorTypes.SERVER,
        { statusCode: error.response.status }
      );
    } else if (error.request) {
      // Error de red
      throw new PaymentError(
        'No se pudo conectar con el servidor de pagos',
        PaymentErrorTypes.NETWORK
      );
    } else {
      // Error de configuración u otro
      throw new PaymentError(
        'Error al procesar la solicitud de pago',
        PaymentErrorTypes.UNKNOWN,
        { originalError: error.message }
      );
    }
  }
};