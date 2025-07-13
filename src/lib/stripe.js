import { loadStripe } from "@stripe/stripe-js"
import { paymentsAPI } from "./api"

let stripePromise

export const getStripe = async () => {
  if (!stripePromise) {
    try {
      // Obtener la clave pública desde el backend
      const response = await paymentsAPI.getPublicKey()
      const publicKey = response.data.public_key || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      
      if (!publicKey) {
        throw new Error("No se pudo obtener la clave pública de Stripe")
      }
      
      stripePromise = loadStripe(publicKey)
    } catch (error) {
      console.error("Error al cargar Stripe:", error)
      // Fallback a la variable de entorno
      stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    }
  }
  return stripePromise
}
