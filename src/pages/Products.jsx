import { useEffect, useState } from 'react';
import { useStoreApi } from "../store/storeApi";
import Card from '../components/Card';
import { Link } from 'react-router-dom';



const Products = () => {
    const { products, getProducts } = useStoreApi();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    useEffect(() => {
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        setCategories(uniqueCategories)
    }, [products])

    return (
        <div className='text-black text-2xl w-full h-screen flex flex-col'>
            <div className='flex flex-row justify-between mx-2'>

                {categories.map(category => (
                    <input type="checkbox" key={category} value={category} />

                ))}
            </div>

            <div className='w-full flex flex-wrap justify-center gap-4'>
                {products && products.length > 0 ? (
                    products.map(product => (

                        <Link to={`${product.id}`} key={product.id}><Card key={product.id} product={product} /></Link>


                    ))
                ) : (
                    <p>Cargando productos...</p>
                )}
            </div>
        </div>
    )
}

export default Products