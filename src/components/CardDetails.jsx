import { Link } from 'react-router-dom'
import { useState } from 'react'
import star from '../assets/star.png'
import useCartStore from '../store/storeCart'
import Swal from 'sweetalert2'
import Payment from '../components/Payment'


const CardDetails = (product) => {

    const addToCart = useCartStore((state) => state.addToCart)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        const productWithQuantity = {
            ...product,
            quantity: quantity
        }
        addToCart(productWithQuantity)
        Swal.fire({
            title: "Products add to cart",
            icon: "success",
            draggable: true
        });
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='bg-white rounded-lg shadow-lg p-6'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Columna de imagen */}
                    <div className='flex items-center justify-center'>
                        <img
                            className='max-h-[400px] w-auto object-contain'
                            src={product.image}
                            alt={product.title}
                        />
                    </div>

                    {/* Columna de información */}
                    <div className='space-y-4 p-4'>
                        <h1 className='text-xl font-bold text-black'>{product.title}</h1>

                        <div className='flex gap-2 items-center'>
                            <p className='text-lg font-bold text-yellow-500'>{product.rating.rate}</p>
                            <img src={star} alt='star' className='w-5 h-5' />
                        </div>

                        <p className='text-4xl font-bold text-blue-500'>${product.price}</p>

                        <div className='flex gap-2'>
                            <p className='text-lg font-bold'>Category:</p>
                            <p className='text-lg text-green-500 font-bold'>{product.category}</p>
                        </div>

                        <div className='space-y-4'>
                            <p className='text-lg font-bold'>Description:</p>
                            <p className='text-lg text-slate-700'>{product.description}</p>
                        </div>
                    </div>

                    {/* Columna de compra */}
                    <div className='border-2 rounded-lg p-4 space-y-4'>
                        <div>
                            <p className='text-lg text-slate-700'>
                                <span className='font-bold text-green-500'>Get it free tomorrow</span>
                                for being your first purchase
                            </p>
                        </div>

                        <div>
                            <p className='text-lg font-bold text-green-500'>Free return</p>
                            <p className='text-lg text-slate-700'>You have 30 days from when you receive it.</p>
                        </div>

                        <div>
                            <p className='text-lg text-slate-800 font-bold'>Stock available</p>
                            <p>Amount: {product.rating.count}</p>
                        </div>

                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <label htmlFor="quantity" className='text-lg font-bold'>
                                    Quantity:
                                </label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className='border-2 border-gray-300 rounded-lg p-1 w-20'
                                >
                                    {[...Array(10)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Link
                                to='/login'
                                className='block bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-lg w-full text-center py-2'
                            >
                                Buy Now
                            </Link>

                            <button
                                onClick={handleAddToCart}
                                className='w-full text-lg py-2 rounded-2xl border-2 border-blue-500 hover:bg-blue-300'
                            >
                                Add to Cart
                            </button>
                        </div>

                        <div className='space-y-2'>
                            <h1 className='text-lg text-slate-500 font-bold'>Payments Methods:</h1>
                            <Payment />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardDetails