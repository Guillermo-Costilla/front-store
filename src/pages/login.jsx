import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import Button from "../components/ButtonNavigate"

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const result = await login(credentials);
    setLoading(false);

    if (result.success) {
      Swal.fire({
        title: `¡Bienvenido de nuevo! 🎉`,
        text: "Inicio de sesión exitoso",
        icon: "success",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        toast: true,
        position: "top-end",
      });

      setTimeout(() => navigate("/"), 1000);
    } else {
      setError(result.error);
      Swal.fire({
        title: "Error!",
        text: result.error,
        icon: "error",
        confirmButtonText: "Cerrar",
      });
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <motion.div
        className="w-full max-w-md shadow-xl rounded-lg p-6 bg-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <img
            alt="Store"
            src="https://e7.pngegg.com/pngimages/549/560/png-clipart-computer-icons-login-scalable-graphics-email-accountability-blue-logo-thumbnail.png"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Sign in</h2>
        </div>

        <form onSubmit={handleLogin} className="mt-8">
          {error && <p className="text-red-600">{error}</p>}

          {/* Inputs con animación */}
          {["email", "password"].map((field, index) => (
            <motion.input
              key={index}
              type={field === "password" ? "password" : "email"}
              name={field}
              required
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="block w-full px-4 py-2 mt-4 border border-gray-300 rounded-md focus:outline-none"
              whileFocus={{ scale: 1.05 }}
            />
          ))}

          {/* Botón con loader */}
          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded-md py-2 mt-6 flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 text-center flex flex-1 gap-4 justify-center items-center">
          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold">Register</Link>
          </p>
          <Button text="Go Home" route="/" />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
