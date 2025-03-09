import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStoreApi } from '../store/storeApi';
import CardDetails from '../components/CardDetails';
import CircularProgress from '../components/CircularIndeterminate';

const ProductsDetails = () => {
    const { id } = useParams();
    const { currentProduct, getProductById } = useStoreApi();

    useEffect(() => {
        getProductById(id);
    }, [id, getProductById]);

    if (!currentProduct) {
        return (
            <div className='h-screen flex justify-center items-center'>
                <CircularProgress />
            </div>
        );
    }

    return <CardDetails {...currentProduct} />;
};

export default ProductsDetails;