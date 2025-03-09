import { create } from "zustand";
import axios from "axios";

export const useStoreApi = create((set) => ({
    products: [],
    currentProduct: null,

    getProducts: async () => {
        try {
            const response = await axios.get("https://fakestoreapi.com/products");
            set({ products: response.data });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
            set({ currentProduct: response.data });
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    }
}));