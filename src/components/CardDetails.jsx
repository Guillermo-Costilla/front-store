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
        <div className='w-full h-screen font-sans '>
            <div className='w-full h-screen lg:w-5/6 lg:h-3/4 lg:mx-auto mt-10 lg:rounded-lg lg:shadow-lg flex flex-col lg:flex-row lg:justify-center lg:items-center'>
                <div className='w-full h-1/2 lg:w-1/3 lg:h-1/2'>
                    <img className='w-full h-5/6 lg:w-full lg:h-full object-contain bg-center' src={product.image} alt={product.title} />
                </div>
                <div className='w-full h-full lg:w-1/3 lg:h-full'>
                    <div className='w-full md:max-lg:w-5/6 flex flex-col md:mt-10'>
                        <h1 className='text-xl font-bold text-black w-full mx-2 lg:mt-2'>{product.title}</h1>
                    </div>
                    <div className='lg:w-1/3 flex gap-2 my-3'>
                        <p className='flex flex-row text-lg ml-2 font-bold text-yellow-500'>{product.rating.rate} </p>
                        <img src={star} alt='star' className='w-5 h-full mt-0.5 ' />
                    </div>
                    <div className='w-full flex my-5'>
                        <p className='text-lg ml-2 w-full text-blue-500 text-4xl font-bold w-full'>${product.price}</p>
                    </div>
                    <div className='w-full flex flex-row my-5'>
                        <p className='text-lg ml-2 text-lg font-bold'>Category:</p>
                        <p className='text-lg ml-2 text-lg text-green-500 font-bold'>{product.category}</p>
                    </div>
                    <div className='w-[90%] lg:w-full flex flex-col mr-2'>
                        <p className='text-lg ml-2 my-3 w-full font-bold '>Description:</p>
                        <p className='text-lg ml-2 w-full text-slate-700'>{product.description}</p>
                    </div>
                </div>
                <div className='lg:w-1/3 h-full flex flex-col lg:ml-2'>
                    <div className='w-full h-full lg:ml-2 lg:border-2 lg:rounded-lg'>
                        <div className='w-full mt-10 ml-2'>
                            <p className='text-lg w-full text-slate-700 mt-2 text-left'>
                                <span className='text-lg font-bold text-green-500'>Get it free tomorrow</span> for being your first purchase
                            </p>
                        </div>
                        <div className='w-full my-5 ml-2'>
                            <p className='text-lg font-bold text-green-500'>Free return</p>
                            <p className='text-lg text-slate-700'>You have 30 days from when you receive it.</p>
                        </div>
                        <div className='w-full my-5 ml-2'>
                            <p className='text-lg text-slate-800 font-bold'>Stock available</p>
                            <p>Amount: {product.rating.count}</p>
                        </div>
                        <div className='w-full flex flex-col px-2'>
                            <div className='flex items-center gap-2 mb-3 lg:ml-2'>
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
                            <Link to='/login' className='bg-blue-500 hover:bg-blue-600 rounded-2xl text-white text-lg w-full text-center py-2 mx-auto my-2' >Buy Now</Link>
                            <button
                                onClick={handleAddToCart}
                                className='text-lg py-2 w-full rounded-2xl border-2 border-blue-500 hover:bg-blue-300 my-2' >Add to Cart</button>
                        </div>
                        <div className='w-full h-1/2 md:max-lg:h-9/10 lg:h-auto mt-12 lg:mt-4'>
                            <h1 className='text-lg text-slate-500 font-bold ml-2 mb-2'>Payments Methods:</h1>
                            <Payment />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CardDetails