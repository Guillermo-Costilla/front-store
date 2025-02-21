import React from 'react'
import useCartStore from '../store/storeCart'

const Cart = () => {
    const cartItems = useCartStore((state) => state.cartItems)

    return (
        <div className='text-black text-2xl'>Este es el carrito de compras</div>
    )
}

export default Cart