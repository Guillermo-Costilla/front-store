import axios from "axios"
import { PaymentError, PaymentErrorTypes } from "./errorHandler"

/**
 * Configuración del servicio de pagos
 */
const PAYMENT_CONFIG = {
  API_URL: "https://store-backend-pied.vercel.app/api/payments",
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 2,
}

/**
 * Cliente HTTP configurado para pagos
 */
const paymentClient = axios.create({
  baseURL: PAYMENT_CONFIG.API_URL,
  timeout: PAYMENT_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Valida los datos de pago antes de enviarlos al servidor
 * @param {Object} paymentData - Datos del pago a validar
 * @throws {PaymentError} - Lanza error personalizado si la validación falla
 */
const validatePaymentData = (paymentData) => {
  if (!paymentData) {
    throw new PaymentError("No se proporcionaron datos de pago", PaymentErrorTypes.VALIDATION)
  }

  const { amount, currency, items, customer } = paymentData

  if (!amount || isNaN(amount) || amount <= 0) {
    throw new PaymentError("El monto debe ser mayor a 0", PaymentErrorTypes.VALIDATION)
  }

  if (!currency) {
    throw new PaymentError("La moneda es requerida", PaymentErrorTypes.VALIDATION)
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new PaymentError("Debe haber al menos un producto en el carrito", PaymentErrorTypes.VALIDATION)
  }

  // Hacer el customer opcional para la inicialización
  if (customer && customer.email) {
    // Validar formato de email solo si se proporciona
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customer.email)) {
      throw new PaymentError("El formato del email no es válido", PaymentErrorTypes.VALIDATION)
    }
  }
}

/**
 * Crea un Payment Intent en Stripe
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>} - Respuesta con client_secret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    validatePaymentData(paymentData)

    console.log("Creando Payment Intent...", { amount: paymentData.amount, currency: paymentData.currency })

    const { data } = await paymentClient.post("/create-payment-intent", paymentData)

    if (!data || !data.success) {
      throw new PaymentError(data?.error || "Error al crear el Payment Intent", PaymentErrorTypes.SERVER)
    }

    console.log("Payment Intent creado exitosamente:", data.payment_intent_id)
    return data
  } catch (error) {
    console.error("Error creando Payment Intent:", error)
    console.error("🌐 Detalles del error (Stripe):", error.response?.data || error.message);
    throw handlePaymentServiceError(error)
  }
}

/**
 * Confirma un pago con Stripe
 * @param {string} paymentIntentId - ID del Payment Intent
 * @param {string} paymentMethodId - ID del método de pago
 * @returns {Promise<Object>} - Resultado de la confirmación
 */
export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    if (!paymentIntentId) {
      throw new PaymentError("ID del Payment Intent requerido", PaymentErrorTypes.VALIDATION)
    }

    if (!paymentMethodId) {
      throw new PaymentError("ID del método de pago requerido", PaymentErrorTypes.VALIDATION)
    }

    console.log("Confirmando pago...", { paymentIntentId })

    const { data } = await paymentClient.post("/confirm-payment", {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId,
    })

    if (!data || !data.success) {
      throw new PaymentError(data?.error || "Error al confirmar el pago", PaymentErrorTypes.PAYMENT_FAILED)
    }

    console.log("Pago confirmado exitosamente:", data.payment_intent.id)
    return data
  } catch (error) {
    console.error("Error confirmando pago:", error)
    throw handlePaymentServiceError(error)
  }
}

/**
 * Procesa un pago completo (método legacy actualizado)
 * @param {Object} paymentData - Datos del pago a procesar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const processPaymentRequest = async (paymentData) => {
  try {
    validatePaymentData(paymentData)

    console.log("Procesando pago...", {
      amount: paymentData.amount,
      currency: paymentData.currency,
      customer: paymentData.customer?.email,
    })

    const { data } = await paymentClient.post("/create-payment-intent", paymentData)

    if (!data || !data.success) {
      throw new PaymentError(data?.error || "Error al procesar el pago", PaymentErrorTypes.SERVER)
    }

    console.log("Pago procesado exitosamente:", data)
    return { success: true, data }
  } catch (error) {
    console.error("Error procesando pago:", error)
    throw handlePaymentServiceError(error)
  }
}

/**
 * Obtiene el estado de un pago
 * @param {string} paymentIntentId - ID del Payment Intent
 * @returns {Promise<Object>} - Estado del pago
 */
export const getPaymentStatus = async (paymentIntentId) => {
  try {
    if (!paymentIntentId) {
      throw new PaymentError("ID del Payment Intent requerido", PaymentErrorTypes.VALIDATION)
    }

    const { data } = await paymentClient.get(`/payment-status/${paymentIntentId}`)

    if (!data || !data.success) {
      throw new PaymentError(data?.error || "Error al obtener el estado del pago", PaymentErrorTypes.SERVER)
    }
console.log("✅ Respuesta del backend (client_secret):", data?.client_secret)
    return data
  } catch (error) {
    console.error("Error obteniendo estado del pago:", error)
    throw handlePaymentServiceError(error)
  }
}

/**
 * Obtiene la clave pública de Stripe
 * @returns {Promise<string>} - Clave pública
 */
export const getStripePublicKey = async () => {
  try {
    const { data } = await paymentClient.get("/public-key")

    if (!data || !data.success) {
      throw new PaymentError("Error al obtener la clave pública de Stripe", PaymentErrorTypes.SERVER)
    }

    return data.public_key
  } catch (error) {
    console.error("Error obteniendo clave pública:", error)
    // Fallback a la clave hardcodeada
    return "pk_test_123"
  }
}

/**
 * Maneja errores específicos del servicio de pagos
 * @param {Error} error - Error original
 * @returns {PaymentError} - Error procesado
 */
const handlePaymentServiceError = (error) => {
  // Si ya es un PaymentError, lo retornamos tal como está
  if (error instanceof PaymentError) {
    return error
  }

  // Error de respuesta del servidor
  if (error.response) {
    const { status, data } = error.response
    const serverMessage = data?.error || data?.message

    console.error("Error del servidor:", { status, data })

    // Mapear códigos de estado específicos
    if (status === 400) {
      return new PaymentError(
        serverMessage || "Datos de pago inválidos",
        data?.code === "CARD_DECLINED" ? PaymentErrorTypes.CARD_DECLINED : PaymentErrorTypes.VALIDATION,
        { status, serverCode: data?.code },
      )
    }

    if (status === 402) {
      return new PaymentError(serverMessage || "Pago rechazado", PaymentErrorTypes.PAYMENT_FAILED, {
        status,
        serverCode: data?.code,
      })
    }

    if (status >= 500) {
      return new PaymentError(
        "El servidor de pagos está experimentando problemas temporales",
        PaymentErrorTypes.SERVER,
        { status },
      )
    }

    return new PaymentError(serverMessage || `Error del servidor: ${status}`, PaymentErrorTypes.SERVER, { status })
  }

  // Error de red (sin respuesta)
  if (error.request) {
    console.error("Error de red:", error.request)
    return new PaymentError(
      "No se pudo conectar con el servidor de pagos. Verifica tu conexión a internet.",
      PaymentErrorTypes.NETWORK,
    )
  }

  // Error de configuración u otro
  console.error("Error desconocido:", error.message)
  return new PaymentError(error.message || "Error desconocido en el proceso de pago", PaymentErrorTypes.UNKNOWN)
}

/**
 * Utilidad para reintentar operaciones fallidas
 * @param {Function} operation - Operación a reintentar
 * @param {number} maxAttempts - Número máximo de intentos
 * @returns {Promise} - Resultado de la operación
 */
export const retryOperation = async (operation, maxAttempts = PAYMENT_CONFIG.RETRY_ATTEMPTS) => {
  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      // No reintentar errores de validación o de tarjeta
      if (
        error instanceof PaymentError &&
        [PaymentErrorTypes.VALIDATION, PaymentErrorTypes.CARD_DECLINED].includes(error.code)
      ) {
        throw error
      }

      if (attempt < maxAttempts) {
        console.log(`Intento ${attempt} fallido, reintentando...`)
        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  throw lastError
}
