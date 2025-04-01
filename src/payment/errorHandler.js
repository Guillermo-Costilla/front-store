/**
 * Clase personalizada para errores de pago
 */
export class PaymentError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Tipos de errores de pago
 */
export const PaymentErrorTypes = {
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  CARD: 'CARD_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Maneja errores de pago y los transforma en mensajes apropiados para el usuario
 * @param {Error} error - Error capturado
 * @returns {Object} - Objeto con información del error para mostrar al usuario
 */
export const handlePaymentError = (error) => {
  // Error personalizado de pago
  if (error instanceof PaymentError) {
    return {
      title: obtenerTituloError(error.code),
      message: error.message,
      code: error.code,
      details: error.details
    };
  }

  // Error de axios/red
  if (error.response) {
    return {
      title: 'Error del servidor',
      message: error.response.data?.message || 'El servidor rechazó la solicitud de pago.',
      code: PaymentErrorTypes.SERVER,
      status: error.response.status
    };
  }

  if (error.request) {
    // Timeout o problema de red
    return {
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor de pagos. Verifica tu conexión.',
      code: PaymentErrorTypes.NETWORK
    };
  }

  // Error genérico
  return {
    title: 'Error en el proceso de pago',
    message: error.message || 'Ha ocurrido un error inesperado durante el proceso de pago.',
    code: PaymentErrorTypes.UNKNOWN
  };
};

/**
 * Obtiene un título apropiado según el código de error
 * @param {string} errorCode - Código de error
 * @returns {string} - Título para mostrar al usuario
 */
const obtenerTituloError = (errorCode) => {
  switch (errorCode) {
    case PaymentErrorTypes.VALIDATION:
      return 'Error en los datos de pago';
    case PaymentErrorTypes.SERVER:
      return 'Error en el servidor de pagos';
    case PaymentErrorTypes.NETWORK:
      return 'Error de conexión';
    case PaymentErrorTypes.TIMEOUT:
      return 'Tiempo de espera agotado';
    case PaymentErrorTypes.CARD:
      return 'Error en la tarjeta';
    default:
      return 'Error en el proceso de pago';
  }
}; 