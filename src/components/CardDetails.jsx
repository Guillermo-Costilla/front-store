import { useState, useEffect } from "react"
import star from "../assets/star.png"
import useCartStore from "../store/storeCart"
import Swal from "sweetalert2"
import Payment from "../components/Payment"
import { motion } from "framer-motion"
import {
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    RotateCcw,
    Shield,
    ChevronRight,
    Check,
    Package,
    Plus,
    Minus,
} from "lucide-react"

const SkeletonLoader = () => (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto px-4 py-8 mt-20 min-h-screen">
        {/* Imagen */}
        <div className="flex items-center justify-center">
            <div className="bg-gray-300 h-[400px] w-full max-w-[350px] rounded-lg"></div>
        </div>

        {/* Información del producto */}
        <div className="space-y-4 px-4 mt-10">
            <div className="bg-gray-300 h-6 w-3/4 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
            <div className="bg-gray-300 h-10 w-1/2 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/4 rounded"></div>
            <div className="bg-gray-300 h-16 w-full rounded"></div>
        </div>

        {/* Columna de compra */}
        <div className="border rounded-xl p-6 shadow-md space-y-4">
            <div className="bg-gray-300 h-6 w-2/3 rounded"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            <div className="bg-gray-300 h-6 w-1/4 rounded"></div>
            <div className="bg-gray-300 h-10 w-full rounded"></div>
        </div>
    </div>
)

const CardDetails = (product) => {
    const addToCart = useCartStore((state) => state.addToCart)
    const [quantity, setQuantity] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)

    // Simulamos imágenes adicionales para la galería
    const productImages = product
        ? [
            product.imagen,
            product.imagen, // Duplicamos para simular más imágenes
            product.imagen,
        ]
        : []

    useEffect(() => {
        // Simulamos una carga de datos con un pequeño delay
        setTimeout(() => {
            setIsLoading(false)
        }, 1500)
    }, [])

    const handleAddToCart = () => {
        setIsAddingToCart(true)

        const productWithQuantity = {
            ...product,
            quantity: quantity,
        }

        // Simulamos un pequeño retraso para mostrar la animación
        setTimeout(() => {
            addToCart(productWithQuantity)
            setIsAddingToCart(false)

            Swal.fire({
                title: "Producto añadido al carrito",
                icon: "success",
                draggable: true,
            })
        }, 600)
    }

    const incrementQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    // Calcular el nivel de stock
    const stockLevel =
        product && product.puntuacion
            ? product.stock > 20
                ? "high"
                : product.stock > 10
                    ? "medium"
                    : "low"
            : "unknown"

    const stockColor = {
        high: "bg-green-500",
        medium: "bg-yellow-500",
        low: "bg-red-500",
        unknown: "bg-gray-500",
    }

    if (isLoading) {
        return <SkeletonLoader />
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 mt-20"
        >
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <a href="/" className="hover:text-indigo-600 transition-colors">
                    Home
                </a>
                <ChevronRight className="h-4 w-4 mx-2" />
                <a href="/" className="hover:text-indigo-600 transition-colors">
                    Productos
                </a>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-900 font-medium">{product.nombre}</span>
            </nav>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                    {/* Columna de imagen */}
                    <div className="lg:col-span-1">
                        <div className="flex flex-col">
                            {/* Imagen principal */}
                            <motion.div
                                className="bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center h-[400px] mb-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img
                                    src={productImages[selectedImage] || "/placeholder.svg"}
                                    alt={product.nombre}
                                    className="max-h-full max-w-full object-contain p-4"
                                />
                            </motion.div>

                            {/* Miniaturas */}
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {productImages.map((img, index) => (
                                    <motion.button
                                        key={index}
                                        className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${selectedImage === index ? "border-indigo-600" : "border-gray-200"
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={img || "/placeholder.svg"}
                                            alt={`${product.nombre} - view ${index + 1}`}
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-center mt-6 space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-3 rounded-full ${isFavorite ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        } transition-colors`}
                                    aria-label="Add to favorites"
                                >
                                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                                    aria-label="Share product"
                                >
                                    <Share2 className="h-5 w-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Columna de información */}
                    <motion.div
                        className="space-y-6 p-4 lg:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Categoría */}
                        <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                            {product.categoria}
                        </div>

                        {/* Título */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">{product.nombre}</h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg w-fit">
                            <div className="flex items-center">
                                <img src={star || "/placeholder.svg"} alt="star" className="w-5 h-5 mr-1" />
                                <p className="text-lg font-bold text-amber-500">{product.puntuacion}</p>
                            </div>
                            <span className="text-gray-500 text-sm">({product.stock} reviews)</span>
                        </div>

                        {/* Precio */}
                        <div className="flex items-end gap-3">
                            <p className="text-3xl font-bold text-indigo-600">${product.precio}</p>
                            {product.price > 50 && (
                                <p className="text-lg text-gray-500 line-through">${(product.precio * 1.1).toFixed(2)}</p>
                            )}
                            {product.price > 50 && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-sm font-medium">10% OFF</span>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                            <h2 className="text-lg font-bold text-gray-900">Descripcion:</h2>
                            <p className="text-gray-700 leading-relaxed">{product.descripcion}</p>
                        </div>

                        {/* Beneficios */}
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-full">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Envío Gratis</p>
                                    <p className="text-sm text-gray-600">En pedidos superiores a $50</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                    <RotateCcw className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Devoluciones en 30 días</p>
                                    <p className="text-sm text-gray-600">Devoluciones sin complicaciones</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Pagos Seguros</p>
                                    <p className="text-sm text-gray-600">Tus datos están protegidos</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Columna de compra */}
                    <motion.div
                        className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg space-y-6 h-fit"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {/* Disponibilidad de envío */}
                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
                            <p className="text-lg text-gray-800">
                                <span className="font-bold text-indigo-600 block mb-1">Recibilo gratis mañana</span>
                                por ser tu primera compra
                            </p>
                        </div>

                        {/* Devolución gratuita */}
                        <div className="flex items-start gap-3 border-b border-gray-100 pb-4">
                            <div className="p-2 bg-green-100 text-green-600 rounded-full flex-shrink-0">
                                <RotateCcw className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-green-600">Devolución gratuita</p>
                                <p className="text-gray-600">Tenés 30 días desde que lo recibís.</p>
                            </div>
                        </div>

                        {/* Stock disponible */}
                        <div className="border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-lg text-gray-800 font-bold flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-indigo-600" />
                                    Stock disponible
                                </p>
                                <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${stockColor[stockLevel]}`}>
                                    {stockLevel === "high" ? "En stock" : stockLevel === "medium" ? "Limitado" : "Stock bajo"}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${stockColor[stockLevel]}`}
                                        style={{ width: `${Math.min(100, (product.stock / 30) * 100)}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600">{product.stock} unidades</span>
                            </div>
                        </div>

                        {/* Cantidad */}
                        <div className="space-y-4">
                            <label htmlFor="quantity" className="text-lg font-bold text-gray-800 block">
                                Cantidad:
                            </label>

                            <div className="flex items-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={decrementQuantity}
                                    className="p-2 bg-gray-100 rounded-l-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus className="h-5 w-5" />
                                </motion.button>

                                <div className="px-6 py-2 border-t border-b border-gray-200 text-center min-w-[60px]">
                                    <span className="text-lg font-medium">{quantity}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={incrementQuantity}
                                    className="p-2 bg-gray-100 rounded-r-lg text-gray-600 hover:bg-gray-200 transition-colors"
                                    disabled={quantity >= 10}
                                >
                                    <Plus className="h-5 w-5" />
                                </motion.button>

                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="sr-only" // Oculto pero funcional para mantener la lógica original
                                >
                                    {[...Array(10)].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white shadow-lg ${isAddingToCart ? "bg-green-600" : "bg-indigo-600 hover:bg-indigo-700"
                                    } transition-all duration-300`}
                            >
                                {isAddingToCart ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        Agregado al carrito
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Añadir al carrito
                                    </>
                                )}
                            </motion.button>
                        </div>

                        {/* Métodos de pago */}
                        <div className="space-y-3">
                            <h2 className="text-lg text-gray-700 font-bold border-b border-gray-100 pb-2">Metodos de pago:</h2>
                            <Payment />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default CardDetails

