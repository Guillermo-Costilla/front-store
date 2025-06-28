/**
 * Clase personalizada para errores de pago
 */
export class PaymentError extends Error {
  constructor(message, code, details = {}) {
    super(message)
    this.name = "PaymentError"
    this.code = code
    this.details = details
  }
}

/**
 * Tipos de errores de pago
 */
export const PaymentErrorTypes = {
  VALIDATION: "VALIDATION_ERROR",
  SERVER: "SERVER_ERROR",
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT_ERROR",
  CARD: "CARD_ERROR",
  CARD_DECLINED: "CARD_DECLINED",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  PAYMENT_FAILED: "PAYMENT_FAILED",
  AUTH_ERROR: "AUTH_ERROR",
  STRIPE_ERROR: "STRIPE_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
}

/**
 * Mensajes de error en español
 */
const ERROR_MESSAGES = {
  [PaymentErrorTypes.VALIDATION]: {
    title: "Error de Validación",
    defaultMessage: "Los datos proporcionados no son válidos",
  },
  [PaymentErrorTypes.SERVER]: {
    title: "Error del Servidor",
    defaultMessage: "Hubo un problema con el servidor de pagos",
  },
  [PaymentErrorTypes.NETWORK]: {
    title: "Error de Conexión",
    defaultMessage: "No se pudo conectar con el servidor de pagos",
  },
  [PaymentErrorTypes.TIMEOUT]: {
    title: "Tiempo Agotado",
    defaultMessage: "La solicitud tardó demasiado tiempo",
  },
  [PaymentErrorTypes.CARD]: {
    title: "Error de Tarjeta",
    defaultMessage: "Hay un problema con la información de tu tarjeta",
  },
  [PaymentErrorTypes.CARD_DECLINED]: {
    title: "Tarjeta Rechazada",
    defaultMessage: "Tu tarjeta fue rechazada. Intenta con otra tarjeta",
  },
  [PaymentErrorTypes.INSUFFICIENT_FUNDS]: {
    title: "Fondos Insuficientes",
    defaultMessage: "No tienes fondos suficientes en tu tarjeta",
  },
  [PaymentErrorTypes.PAYMENT_FAILED]: {
    title: "Pago Fallido",
    defaultMessage: "No se pudo procesar el pago",
  },
  [PaymentErrorTypes.AUTH_ERROR]: {
    title: "Error de Autenticación",
    defaultMessage: "Error de autenticación con el procesador de pagos",
  },
  [PaymentErrorTypes.STRIPE_ERROR]: {
    title: "Error de Stripe",
    defaultMessage: "Error en el procesador de pagos",
  },
  [PaymentErrorTypes.UNKNOWN]: {
    title: "Error Desconocido",
    defaultMessage: "Ocurrió un error inesperado",
  },
}

/**
 * Mapeo de códigos de error de Stripe a mensajes en español
 */
const STRIPE_ERROR_MESSAGES = {
  card_declined: "Tu tarjeta fue rechazada. Verifica los datos o intenta con otra tarjeta.",
  expired_card: "Tu tarjeta ha expirado. Usa una tarjeta válida.",
  incorrect_cvc: "El código de seguridad (CVC) es incorrecto.",
  incorrect_number: "El número de tarjeta es incorrecto.",
  invalid_cvc: "El código de seguridad (CVC) no es válido.",
  invalid_expiry_month: "El mes de vencimiento no es válido.",
  invalid_expiry_year: "El año de vencimiento no es válido.",
  invalid_number: "El número de tarjeta no es válido.",
  processing_error: "Ocurrió un error al procesar tu tarjeta. Intenta nuevamente.",
  insufficient_funds: "Tu tarjeta no tiene fondos suficientes.",
  generic_decline: "Tu tarjeta fue rechazada. Contacta a tu banco para más información.",
  lost_card: "Tu tarjeta fue reportada como perdida.",
  stolen_card: "Tu tarjeta fue reportada como robada.",
  pickup_card: "Tu tarjeta no puede ser utilizada. Contacta a tu banco.",
  restricted_card: "Tu tarjeta tiene restricciones. Contacta a tu banco.",
  security_violation: "El pago fue rechazado por razones de seguridad.",
  service_not_allowed: "El pago fue rechazado por tu banco.",
  stop_payment_order: "El pago fue rechazado por tu banco.",
  testmode_decline: "Tarjeta de prueba rechazada (modo de prueba).",
  withdrawal_count_limit_exceeded: "Has excedido el límite de transacciones.",
}

/**
 * Maneja errores de pago y los transforma en mensajes apropiados para el usuario
 * @param {Error} error - Error capturado
 * @returns {Object} - Objeto con información del error para mostrar al usuario
 */
export const handlePaymentError = (error) => {
  console.error("Error de pago capturado:", error)

  // Error personalizado de pago
  if (error instanceof PaymentError) {
    const errorConfig = ERROR_MESSAGES[error.code] || ERROR_MESSAGES[PaymentErrorTypes.UNKNOWN]
    return {
      title: errorConfig.title,
      message: error.message || errorConfig.defaultMessage,
      code: error.code,
      details: error.details,
      type: "payment_error",
    }
  }

  // Error de Stripe específico
  if (error.type && error.type.startsWith("Stripe")) {
    return handleStripeError(error)
  }

  // Error de axios/red
  if (error.response) {
    return handleServerError(error)
  }

  if (error.request) {
    return {
      title: ERROR_MESSAGES[PaymentErrorTypes.NETWORK].title,
      message:
        "No se pudo establecer conexión con el servidor de pagos. Verifica tu conexión a internet e intenta nuevamente.",
      code: PaymentErrorTypes.NETWORK,
      type: "network_error",
    }
  }

  // Error genérico
  return {
    title: ERROR_MESSAGES[PaymentErrorTypes.UNKNOWN].title,
    message: error.message || ERROR_MESSAGES[PaymentErrorTypes.UNKNOWN].defaultMessage,
    code: PaymentErrorTypes.UNKNOWN,
    type: "unknown_error",
    details: { originalError: error.message },
  }
}

/**
 * Maneja errores específicos de Stripe
 * @param {Object} stripeError - Error de Stripe
 * @returns {Object} - Información del error formateada
 */
const handleStripeError = (stripeError) => {
  const { type, code, decline_code, message } = stripeError

  // Determinar el tipo de error
  let errorType = PaymentErrorTypes.STRIPE_ERROR
  let title = ERROR_MESSAGES[PaymentErrorTypes.STRIPE_ERROR].title
  let userMessage = message

  if (type === "StripeCardError") {
    errorType = PaymentErrorTypes.CARD_DECLINED
    title = ERROR_MESSAGES[PaymentErrorTypes.CARD_DECLINED].title

    // Usar mensaje específico si existe
    if (decline_code && STRIPE_ERROR_MESSAGES[decline_code]) {
      userMessage = STRIPE_ERROR_MESSAGES[decline_code]
    } else if (code && STRIPE_ERROR_MESSAGES[code]) {
      userMessage = STRIPE_ERROR_MESSAGES[code]
    }
  } else if (type === "StripeInvalidRequestError") {
    errorType = PaymentErrorTypes.VALIDATION
    title = ERROR_MESSAGES[PaymentErrorTypes.VALIDATION].title
    userMessage = "Los datos de pago proporcionados no son válidos. Verifica la información e intenta nuevamente."
  } else if (type === "StripeAuthenticationError") {
    errorType = PaymentErrorTypes.AUTH_ERROR
    title = ERROR_MESSAGES[PaymentErrorTypes.AUTH_ERROR].title
    userMessage = "Error de autenticación con el procesador de pagos. Intenta nuevamente."
  }

  return {
    title,
    message: userMessage,
    code: errorType,
    type: "stripe_error",
    details: {
      stripeType: type,
      stripeCode: code,
      declineCode: decline_code,
      originalMessage: message,
    },
  }
}

/**
 * Maneja errores del servidor
 * @param {Object} serverError - Error del servidor
 * @returns {Object} - Información del error formateada
 */
const handleServerError = (serverError) => {
  const { response } = serverError
  const serverData = response?.data || {}
  const status = response?.status

  let title = ERROR_MESSAGES[PaymentErrorTypes.SERVER].title
  let message = ERROR_MESSAGES[PaymentErrorTypes.SERVER].defaultMessage
  let code = PaymentErrorTypes.SERVER

  // Mensajes específicos según el código de estado
  if (status === 400) {
    message = serverData.error || "Los datos enviados no son válidos."
    if (serverData.code === "CARD_DECLINED") {
      code = PaymentErrorTypes.CARD_DECLINED
      title = ERROR_MESSAGES[PaymentErrorTypes.CARD_DECLINED].title
    }
  } else if (status === 401) {
    message = "No tienes autorización para realizar esta operación."
    code = PaymentErrorTypes.AUTH_ERROR
    title = ERROR_MESSAGES[PaymentErrorTypes.AUTH_ERROR].title
  } else if (status === 402) {
    message = "El pago fue rechazado. Verifica los datos de tu tarjeta."
    code = PaymentErrorTypes.PAYMENT_FAILED
    title = ERROR_MESSAGES[PaymentErrorTypes.PAYMENT_FAILED].title
  } else if (status === 429) {
    message = "Demasiadas solicitudes. Espera un momento e intenta nuevamente."
  } else if (status >= 500) {
    message = "El servidor de pagos está experimentando problemas. Intenta nuevamente en unos minutos."
  } else if (serverData.error) {
    message = serverData.error
  }

  return {
    title,
    message,
    code,
    type: "server_error",
    details: {
      status,
      serverCode: serverData.code,
      serverMessage: serverData.error,
    },
  }
}

/**
 * Valida si un error es recuperable (el usuario puede intentar nuevamente)
 * @param {Object} errorInfo - Información del error
 * @returns {boolean} - Si el error es recuperable
 */
export const isRecoverableError = (errorInfo) => {
  const recoverableCodes = [
    PaymentErrorTypes.NETWORK,
    PaymentErrorTypes.TIMEOUT,
    PaymentErrorTypes.SERVER,
    PaymentErrorTypes.CARD_DECLINED,
  ]

  return recoverableCodes.includes(errorInfo.code)
}

/**
 * Obtiene sugerencias de acción para el usuario según el tipo de error
 * @param {Object} errorInfo - Información del error
 * @returns {Array} - Lista de sugerencias
 */
export const getErrorSuggestions = (errorInfo) => {
  const suggestions = []

  switch (errorInfo.code) {
    case PaymentErrorTypes.CARD_DECLINED:
      suggestions.push(
        "Verifica que los datos de tu tarjeta sean correctos",
        "Intenta con una tarjeta diferente",
        "Contacta a tu banco para verificar el estado de tu tarjeta",
      )
      break
    case PaymentErrorTypes.NETWORK:
      suggestions.push("Verifica tu conexión a internet", "Intenta nuevamente en unos segundos")
      break
    case PaymentErrorTypes.SERVER:
      suggestions.push("Intenta nuevamente en unos minutos", "Si el problema persiste, contacta al soporte técnico")
      break
    case PaymentErrorTypes.VALIDATION:
      suggestions.push("Verifica que todos los campos estén completos", "Asegúrate de que la información sea correcta")
      break
    default:
      suggestions.push("Intenta nuevamente", "Si el problema persiste, contacta al soporte técnico")
  }

  return suggestions
}
