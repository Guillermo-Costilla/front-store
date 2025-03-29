import { create } from "zustand"

const useCartStore = create((set) => ({
    cartItems: [],

    addToCart: (product) => 
        set((state) => {
            const existingItem = state.cartItems.find(item => item.id === product.id)
            
            if (existingItem) {
                // Si el producto ya existe, actualiza la cantidad
                return {
                    cartItems: state.cartItems.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + product.quantity }
                            : item
                    )
                }
            }
            // Si el producto no existe, lo añade al carrito
            return {
                cartItems: [...state.cartItems, product]
            }
        }),

    removeFromCart: (productId) =>
        set((state) => ({
            cartItems: state.cartItems.filter(item => item.id !== productId)
        })),

    clearCart: () => 
        set({ cartItems: [] }),
}))

export default useCartStore