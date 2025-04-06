import { useState } from "react"
import { ShoppingCart, Heart, Star, Tag } from "lucide-react"
import useCartStore from "../store/storeCart"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const Card = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const addToCart = useCartStore((state) => state.addToCart)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const navigate = useNavigate()


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
                title: "Product added to cart",
                icon: "success",
                draggable: true,
            })
        }, 600)
    }

    // Función para formatear el precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(price)
    }

    // Calcular descuento (simulado para demostración)
    const hasDiscount = product.price > 50
    const discountPercentage = hasDiscount ? 10 : 0
    const originalPrice = hasDiscount ? product.price * 1.1 : null

    return (
        <div
            className="rounded-xl flex flex-col w-80 h-[420px] overflow-hidden bg-white relative group border-2 shadow-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Capa de fondo con efecto de elevación */}
            <div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-100 to-white shadow-lg 
                transition-all duration-500 ease-out
                group-hover:shadow-xl group-hover:scale-[1.02] z-0"
            ></div>

            {/* Contenido principal */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Imagen con overlay y efectos */}
                <div className="relative w-full h-[250px] overflow-hidden">
                    {/* Etiqueta de descuento */}
                    {hasDiscount && (
                        <div
                            className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full
                            animate-pulse"
                        >
                            -{discountPercentage}%
                        </div>
                    )}

                    {/* Botón de favorito */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsFavorite(!isFavorite)
                        }}
                        className={`absolute top-3 right-3 z-20 p-2 rounded-full 
                            transition-all duration-300 ease-in-out
                            ${isFavorite
                                ? "bg-red-50 text-red-500 scale-110"
                                : "bg-white/80 text-gray-400 hover:bg-white hover:text-red-500"
                            }`}
                        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                    >
                        <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
                    </button>

                    {/* Imagen con efecto de zoom */}
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.title}
                            className={`w-full h-full object-contain transition-transform duration-700 ease-out
                                ${isHovered ? "scale-110" : "scale-100"}`}
                        />
                    </div>

                    {/* Overlay con botón de acción */}
                    <div
                        className={`absolute inset-0 bg-black/5 flex items-end justify-center
                        transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
                    >
                        <button
                            onClick={handleAddToCart}
                            className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-full font-medium
                            flex items-center gap-2 transform transition-all duration-300
                            hover:bg-indigo-700 active:scale-95 shadow-lg hover:shadow-indigo-500/30"
                            aria-label="Añadir al carrito"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Add to cart
                        </button>
                    </div>
                </div>

                {/* Contenido de texto */}
                <div className="p-4 flex flex-col gap-2 flex-grow">
                    {/* Categoría */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                        <Tag className="h-3 w-3" />
                        <span>{product.category || "Categoría"}</span>
                    </div>

                    {/* Título */}
                    <h1
                        className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700
                        transition-colors duration-300"
                    >
                        {product.title}
                    </h1>

                    {/* Rating real del producto */}
                    <div className="flex items-center gap-1 mt-1">
                        <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < Math.floor(product.rating.rate)
                                        ? 'text-amber-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500">
                            ({product.rating.count})
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="mt-auto pt-2 flex items-end gap-2">
                        <p
                            className="text-xl font-bold text-indigo-600 transition-all duration-300
                            group-hover:text-indigo-700"
                        >
                            {formatPrice(product.price)}
                        </p>
                        {originalPrice && <p className="text-sm text-gray-500 line-through">{formatPrice(originalPrice)}</p>}
                    </div>
                    <div className="mt-auto pt-2 flex items-end gap-2">
                        <button
                            onClick={() => navigate(`/${product.id}`)}
                            className="bg-blue-500 text-white text-lg relative p-2 rounded-full text-gray-800 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group"
                            aria-label="Carrito de compras"
                        >
                            Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card

