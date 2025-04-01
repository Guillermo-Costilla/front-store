const Card = ({ product }) => {
    return (
        <div className="rounded-xl flex flex-col border border-gray-200 w-80 h-[400px] shadow-lg overflow-hidden bg-white cursor-pointer transition-transform hover:scale-[1.02]">
            {/* Imagen con tamaño uniforme */}
            <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center">
                <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
            </div>

            {/* Contenido con altura fija */}
            <div className="p-4 flex flex-col gap-2 h-[150px]">
                <h1 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.title}</h1>
                <p className="text-xl font-medium text-indigo-600">$ {product.price}</p>
            </div>
        </div>
    );
};

export default Card;
