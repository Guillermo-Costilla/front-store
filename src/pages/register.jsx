import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Register = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        imagen: "",
    });

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            // Mostrar alerta animada de éxito
            Swal.fire({
                title: "¡Succes!",
                text: "¡Register Sucess!",
                icon: "success",
                showConfirmButton: false,
                timer: 2000, // Se cierra automáticamente en 2 segundos
                timerProgressBar: true,
                toast: true,
                position: "top-end"
            });

            // Limpiar los campos del formulario
            setFormData({
                nombre: "",
                email: "",
                password: "",
                imagen: "",
            });

            // Redirigir al usuario después de unos segundos
            setTimeout(() => navigate("/login"), 2500);
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
            <motion.form
                onSubmit={handleSignup}
                className="p-4 w-full max-w-md shadow-xl rounded-lg bg-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Register
                </h2>

                {error && <p className="text-red-600 mt-4">{error}</p>}

                {["nombre", "email", "password", "imagen"].map((field, index) => (
                    <motion.input
                        key={index}
                        type={field === "password" ? "password" : field === "email" ? "email" : field === "imagen" ? "url" : "text"}
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        className="block w-full px-4 py-2 mt-4 border border-gray-300 rounded-md focus:outline-none"
                        whileFocus={{ scale: 1.05 }}
                    />
                ))}

                <motion.button
                    type="submit"
                    className="w-full bg-indigo-600 text-white rounded-md py-2 mt-4"
                    whileTap={{ scale: 0.9 }}
                >
                    {loading ? "Procesando..." : "Register"}
                </motion.button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    ¿Forgot account? <Link to="/login" className="text-indigo-600">Log in</Link>
                </p>
            </motion.form>
        </div>
    );
};

export default Register;
