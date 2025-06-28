import { useEffect, useState } from "react";
import { useStoreApi } from "../store/storeApi";
import Card from "../components/Card";
import TopBanner from "../components/TopBanner";
import SkeletonCard from "../components/SkeletonCard";

const Products = () => {
    const { products, getProducts } = useStoreApi();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="text-black text-2xl w-full min-h-screen flex flex-col items-center bg-gray-50 mt-20">
            <TopBanner />

            {/* Barra de búsqueda */}
            <div className="w-[90%] sm:w-full max-w-lg mx-auto mt-6">
                <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* Contenedor de productos con grid responsive */}
            <div className="ml-6 sm:ml-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 mt-8 max-w-[1500px] w-full px-6">

                {products && products.length > 0 ? (
                    filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Card product={product} key={product.id} />
                        ))
                    ) : (
                        <div className="text-center text-gray-600 col-span-full mt-10">
                            No se encontraron productos para: "{searchTerm}"
                        </div>
                    )
                ) : (
                    [...Array(8)].map((_, index) => <SkeletonCard key={index} />)
                )}
            </div>
        </div>
    );
};

export default Products;
