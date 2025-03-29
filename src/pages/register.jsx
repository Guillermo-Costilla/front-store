import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"

const Register = () => {
    const navigate = useNavigate();
    const register = useAuthStore((state) => state.register);
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
            navigate('/login');
        } else {
            setError(result.error);
        }
    }

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <form onSubmit={handleSignup} className='w-1/3 p-6 card text-black shadow-xl rounded-lg'>
                    <h2 className='text-center font-bold text-3xl w-full mb-6'>Register</h2>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            onChange={handleInput}
                            type="text"
                            name="nombre"
                            id="floating_name"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Name and last name:
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            onChange={handleInput}
                            type="email"
                            name="email"
                            id="floating_email"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="floating_email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Email:
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            onChange={handleInput}
                            type="password"
                            name="password"
                            id="floating_password"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                            required
                        />
                        <label htmlFor="floating_password" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Password:
                        </label>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                        <input
                            onChange={handleInput}
                            type="url"
                            name="imagen"
                            id="floating_image"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            placeholder=" "
                        />
                        <label htmlFor="floating_image" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Image URL (optional)
                        </label>
                        {formData.imagen && (
                            <div className="mt-2">
                                <img
                                    src={formData.imagen}
                                    alt="Vista previa"
                                    className="w-20 h-20 object-cover rounded-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        setError('La URL de la imagen no es válida');
                                        setFormData(prev => ({ ...prev, imagen: '' }));
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                        >
                            Register
                        </button>
                        <Link
                            to="/login"
                            className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
                        >
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;