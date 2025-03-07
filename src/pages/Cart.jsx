import CardtoCart from '../components/CardtoCart'
import useCartStore from '../store/storeCart'

const Cart = () => {
    const cartItems = useCartStore((state) => state.cartItems)
    console.log(cartItems)

    return (
        <div className='text-black text-2xl'>
            <CardtoCart item={cartItems} />
        </div>
    )
}

export default Cart