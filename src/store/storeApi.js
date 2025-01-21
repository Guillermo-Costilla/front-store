import { create } from "zustand";
import axios from "axios";

export const useStoreApi = create((set) => ({
  products: [],

  getProducts: async () => {
    const response = await axios.get("https://fakestoreapi.com/products");
    set({ products: response.data });
  },
}));
