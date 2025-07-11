import { create } from "zustand"
import Cookies from "js-cookie"
import Swal from 'sweetalert2'
import { useAuthStore } from "./authStore"

function getCartCookieName(user) {
  return user && user.id ? `cart-${user.id}` : "cart-guest"
}

function loadCartFromCookie(user) {
  const cookieName = getCartCookieName(user)
  const cookie = Cookies.get(cookieName)
  try {
    return cookie ? JSON.parse(cookie) : []
  } catch {
    return []
  }
}

function saveCartToCookie(user, items) {
  const cookieName = getCartCookieName(user)
  Cookies.set(cookieName, JSON.stringify(items), { expires: 7 })
}

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  // Inicializar el carrito desde la cookie correcta
  initCart: () => {
    const user = useAuthStore.getState().user
    const items = loadCartFromCookie(user)
    set({ items })
  },

  addItem: (product) => {
    const user = useAuthStore.getState().user
    const { items } = get()
    const existingItem = items.find((item) => item.id === product.id)
    let newItems
    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    } else {
      newItems = [...items, { ...product, quantity: 1 }]
    }
    set({ items: newItems })
    saveCartToCookie(user, newItems)
    Swal.fire(`${product.name} agregado al carrito`, '', 'success')
  },

  removeItem: (productId) => {
    const user = useAuthStore.getState().user
    const { items } = get()
    const item = items.find((item) => item.id === productId)
    const newItems = items.filter((item) => item.id !== productId)
    set({ items: newItems })
    saveCartToCookie(user, newItems)
    if (item) {
      Swal.fire(`${item.name} eliminado del carrito`, '', 'success')
    }
  },

  updateQuantity: (productId, quantity) => {
    const user = useAuthStore.getState().user
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    const { items } = get()
    const newItems = items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    )
    set({ items: newItems })
    saveCartToCookie(user, newItems)
  },

  clearCart: () => {
    const user = useAuthStore.getState().user
    set({ items: [] })
    saveCartToCookie(user, [])
    Swal.fire('Carrito vaciado', '', 'success')
  },

  getTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.quantity, 0)
  },

  getTotalWithTax: () => {
    const total = get().getTotal()
    const tax = total * 0.16 // 16% IVA
    return {
      subtotal: total,
      tax: tax,
      total: total + tax,
    }
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  openCart: () => {
    set({ isOpen: true })
  },

  closeCart: () => {
    set({ isOpen: false })
  },

  // Llamar esto cuando el usuario cambie (login/logout)
  handleUserChange: () => {
    const user = useAuthStore.getState().user
    const items = loadCartFromCookie(user)
    set({ items })
  },
}))
