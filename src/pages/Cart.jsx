import useCartStore from '../store/storeCart';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion"

const Cart = () => {
    const cartItems = useCartStore((state) => state.cartItems);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.precio * item.quantity, 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gray-50 py-12 mt-20"
        >
            <div className='container min-h-screen mx-auto px-4 py-8'>
                <h2 className='text-2xl font-bold mb-6'>Carrito de compras</h2>
                <div className='space-y-4'>
                    {cartItems && cartItems.length > 0 ? (
                        <form action="" method="POST">
                            {cartItems.map((item) => (
                                <div key={item.id} className='border rounded-lg shadow-sm p-4'>
                                    <div className='flex flex-col md:flex-row md:items-center md:space-x-4'>
                                        {/* Imagen */}
                                        <div className='w-full md:w-1/6 mb-4 md:mb-0'>
                                            <img
                                                src={item.imagen}
                                                className='w-32 h-32 object-contain mx-auto'
                                                alt={item.nombre}
                                            />
                                        </div>

                                        {/* Información del producto */}
                                        <div className='flex-1 text-center md:text-left'>
                                            <h3 className='text-lg md:text-xl font-semibold mb-2 line-clamp-2'>
                                                {item.nombre}
                                            </h3>
                                            <p className='text-gray-600 mb-2'>
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className='text-lg font-bold text-green-500'>
                                                Total: ${(item.precio * item.quantity).toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Botón eliminar */}
                                        <div className='flex justify-center md:justify-end mt-4 md:mt-0'>
                                            <button

                                                onClick={() => handleRemove(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"

                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Total y botón continuar */}
                            <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                                <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
                                    <p className="text-xl font-bold mb-4 md:mb-0">
                                        Total Carrito: <span className='text-green-500'>
                                            ${calculateTotal().toFixed(2)}
                                        </span>
                                    </p>
                                    <Link to="/payment"
                                        className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Continuar Pago
                                    </Link>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className='text-center py-12 bg-gray-50 rounded-lg'>
                            <p className='text-gray-600 text-xl'>🛒 El carrito está vacío….</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Cart;