import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import Swal from 'sweetalert2'

const Register = () => {
    const navigate = useNavigate();
    const [register, user] = useAuthStore((state) => state.register);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        imagen: ''
    });

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        // Validar URL de imagen si se proporciona
        if (formData.imagen && !isValidUrl(formData.imagen)) {
            setError('La URL de la imagen no es válida');
            return;
        }

        const result = await register(formData);
        if (result.success) {
            Swal.fire({
                title: "¡Success!",
                text: "¡Welcome " + user.name + "!",
                icon: "success",
                confirmButtonText: "Lets Go!",
            });
            navigate('/login');
        } else {
            setError(result.error);
            Swal.fire({
                title: "Error!",
                text: result.error,
                icon: "error",
                confirmButtonText: "Close",
            });
        }
    }

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })

    }

    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-full max-w-md'>
                <div className='w-full shadow-xl rounded-lg'>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm my-2 w-full">
                        <h2 className='mt-10 text-center text-2xl font-bold tracking-tight text-gray-900'>
                            Register
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={handleSignup} className="p-4">
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                                    <span className="block sm:inline">{error}</span>
                                </div>
                            )}
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Name and las name
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="text"
                                    name="nombre"
                                    id="floating_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="email"
                                    name="email"
                                    id="floating_email"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="password"
                                    name="password"
                                    id="floating_password"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                    required
                                />
                            </div>
                            <div className='mb-10'>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    URL image
                                </label>
                                <input
                                    onChange={handleInput}
                                    type="url"
                                    name="imagen"
                                    id="floating_image"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Register
                                </button>
                            </div>
                            <p className="mt-10 text-center text-sm text-gray-500">
                                ¿Forgot account?{' '}
                                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;