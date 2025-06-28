// Configuración para el servicio de pagos
export const PAYMENT_CONFIG = {
  // URL base para las solicitudes de pago
  API_URL: "https://store-backend-7ws5.onrender.com/api/payments",

  // Tiempo máximo de espera para las solicitudes (en milisegundos)
  TIMEOUT: 30000, // 30 segundos

  // Número de intentos de reintento para solicitudes fallidas
  RETRY_ATTEMPTS: 2,

  // Clave pública de Stripe
  STRIPE_PUBLIC_KEY:
    "pk_test_51R0DGDCr7qNJfD5UIOTV4XrH9AMY9IYk6IaenLpZoTlYQAOwNAvWBYJMbcIJhjTlGIaONa80Vi1NB55HxD9hbCN10010FtOXzM",

  // Configuración de monedas soportadas
  SUPPORTED_CURRENCIES: ["usd", "eur", "ars", "mxn"],

  // Configuración de países soportados
  SUPPORTED_COUNTRIES: ["US", "AR", "MX", "ES", "CO", "CL", "PE"],

  // Configuración de elementos de Stripe
  STRIPE_APPEARANCE: {
    theme: "stripe",
    variables: {
      colorPrimary: "#4f46e5",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
    rules: {
      ".Input": {
        border: "1px solid #d1d5db",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
      ".Input:focus": {
        border: "1px solid #4f46e5",
        boxShadow: "0 0 0 3px rgba(79, 70, 229, 0.1)",
      },
    },
  },
}

// Exportar componentes y utilidades
export * from "./errorHandler"
export * from "./paymentService"

// Utilidades adicionales
export const formatCurrency = (amount, currency = "usd") => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount)
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateCardNumber = (cardNumber) => {
  // Algoritmo de Luhn para validar números de tarjeta
  const digits = cardNumber.replace(/\D/g, "")
  let sum = 0
  let isEven = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(digits[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}
