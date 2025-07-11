import { create } from "zustand"
import { persist } from "zustand/middleware"
import Swal from 'sweetalert2'

export const useCouponsStore = create(
  persist(
    (set, get) => ({
      appliedCoupon: null,
      availableCoupons: [
        {
          id: "1",
          code: "DESCUENTO10",
          discount: 10,
          type: "percentage",
          minAmount: 100,
          maxDiscount: 50,
          description: "10% de descuento en compras mayores a $100",
          expiresAt: "2024-12-31",
          isActive: true,
        },
        {
          id: "2",
          code: "BIENVENIDO",
          discount: 20,
          type: "fixed",
          minAmount: 50,
          maxDiscount: 20,
          description: "$20 de descuento en tu primera compra",
          expiresAt: "2024-12-31",
          isActive: true,
        },
        {
          id: "3",
          code: "ENVIOGRATIS",
          discount: 15,
          type: "percentage",
          minAmount: 200,
          maxDiscount: 30,
          description: "15% de descuento en compras mayores a $200",
          expiresAt: "2024-12-31",
          isActive: true,
        },
      ],

      applyCoupon: async (code, orderAmount) => {
        const { availableCoupons } = get()
        const coupon = availableCoupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive)

        if (!coupon) {
          Swal.fire('Cupón no válido o expirado', '', 'error')
          return false
        }

        if (orderAmount < coupon.minAmount) {
          Swal.fire(`Este cupón requiere una compra mínima de $${coupon.minAmount}`, '', 'error')
          return false
        }

        // Verificar si el cupón no ha expirado
        const now = new Date()
        const expirationDate = new Date(coupon.expiresAt)
        if (now > expirationDate) {
          Swal.fire('Este cupón ha expirado', '', 'error')
          return false
        }

        set({ appliedCoupon: coupon })
        Swal.fire(`Cupón ${coupon.code} aplicado exitosamente`, '', 'success')
        return true
      },

      removeCoupon: () => {
        set({ appliedCoupon: null })
        Swal.fire('Cupón removido', '', 'success')
      },

      calculateDiscount: (orderAmount) => {
        const { appliedCoupon } = get()
        if (!appliedCoupon) return 0

        let discount = 0
        if (appliedCoupon.type === "percentage") {
          discount = (orderAmount * appliedCoupon.discount) / 100
          // Aplicar descuento máximo si está definido
          if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
            discount = appliedCoupon.maxDiscount
          }
        } else if (appliedCoupon.type === "fixed") {
          discount = appliedCoupon.discount
        }

        return Math.min(discount, orderAmount) // No puede ser mayor al total
      },

      getAvailableCoupons: () => {
        const { availableCoupons } = get()
        return availableCoupons.filter((coupon) => coupon.isActive)
      },

      validateCoupon: (code, orderAmount) => {
        const { availableCoupons } = get()
        const coupon = availableCoupons.find((c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive)

        if (!coupon) {
          return { valid: false, message: "Cupón no válido" }
        }

        if (orderAmount < coupon.minAmount) {
          return {
            valid: false,
            message: `Este cupón requiere una compra mínima de $${coupon.minAmount}`,
          }
        }

        const now = new Date()
        const expirationDate = new Date(coupon.expiresAt)
        if (now > expirationDate) {
          return { valid: false, message: "Este cupón ha expirado" }
        }

        return { valid: true, coupon }
      },
    }),
    {
      name: "coupons-storage",
    },
  ),
)
