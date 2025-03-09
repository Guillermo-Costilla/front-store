import { useEffect, useState } from 'react';
import { useStoreApi } from "../store/storeApi";
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import TopBanner from '../components/TopBanner'
import CircularProgress from '../components/CircularIndeterminate';

const Products = () => {
    const { products, getProducts } = useStoreApi();
    const [searchTerm, setSearchTerm] = useState(''); {/* estado de la barra de busqueda */ }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    return (


        <div className='text-black text-2xl w-full h-screen flex flex-1 flex-col'>
            <TopBanner />
            {/* Barra de búsqueda */}
            <div className='w-full max-w-md mx-auto my-4'>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Productos*/}

            <div className='w-full flex flex-wrap justify-center gap-4'>
                {products && products.length > 0 ? (
                    filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Link to={`/${product.id}`} key={product.id}>
                                <Card key={product.id} product={product} />
                            </Link>
                        ))
                    ) : (
                        <div className='text-center mt-10 text-gray-600'>
                            No products were found matching this "{searchTerm}"
                        </div>
                    )
                ) : (
                    <div className='h-[200] w-[200] mt-10'> {/* loader */}
                        <CircularProgress />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Products