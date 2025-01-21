import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";
import apiUrl from "../api";

export const useStoreReg = create((set) => ({
  // Estado inicial
  user: null,
  token: null,

  // Acciones
  setUserImage: (image) =>
    set((state) => ({
      ...state,
      image: image,
    })),

  userLogin: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/users`, data);
      const userData = response.data.response;

      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      Swal.fire({
        title: "¡Success!",
        text: "¡Welcome " + userData.user.name + "!",
        icon: "success",
        confirmButtonText: "Lets Go!",
      });

      set({ user: userData.user, token: userData.token });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  },

  userSignup: async (data) => {
    try {
      const response = await axios.post(`${apiUrl}/users`, data);

      Swal.fire({
        title: "¡Success!",
        text: response.data.message + " You can now log in!",
        icon: "success",
        confirmButtonText: "Lets Go!",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  },

  userLogout: async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${apiUrl}/users/signout`, null, config);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({ user: null, token: null });
    } catch (error) {
      console.log(error);
    }
  },

  googleLogin: async (data) => {
    try {
      localStorage.setItem("token", data.response.token);
      localStorage.setItem("user", JSON.stringify(data.response.user));

      Swal.fire({
        title: "Success!",
        text: "Welcome " + data.response.user.name,
        icon: "success",
        confirmButtonText: "Lets Go!",
      });

      set({ user: data.response.user, token: data.response.token });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error.response.data.message,
        icon: "error",
        confirmButtonText: "Close",
      });
    }
  },

  setUserToken: (user) => set({ user }),
}));

export default useStoreReg;
