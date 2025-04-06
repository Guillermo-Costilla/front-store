// Configuración para el servicio de pagos
export const PAYMENT_CONFIG = {
  // URL base para las solicitudes de pago
  API_URL: "https://store-backend-7ws5.onrender.com/api/payments",

  // Tiempo máximo de espera para las solicitudes (en milisegundos)
  TIMEOUT: 30000, // 30 segundos

  // Número de intentos de reintento para solicitudes fallidas
  RETRY_ATTEMPTS: 2,
}

// Exportar otros componentes o configuraciones según sea necesario
export * from "./errorHandler"