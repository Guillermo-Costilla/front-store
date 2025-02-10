import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CardDetails from "../components/CardDetails.jsx";
import apiUrl from "../api.js";

const ProductsDetails = () => {
    const { id } = useParams();
    const [products, setProducts] = useState();

    useEffect(() => {
        axios.get(`${apiUrl}/products/${id}`)
            .then(response => setProducts(response.data))
            .catch(error => console.log(error));

    }, [id]);


    return (
        <div>
            {products && (
                <CardDetails {...products} />
            )}
        </div>

    );
};

export default ProductsDetails;