import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../store/useAuthStore"
import Swal from 'sweetalert2'

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    const result = await login(credentials);
    if (result.success) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Log in success",
        showConfirmButton: false,
        timer: 1500
      });
      navigate('/');
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

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 w-full max-w-md">
        <div className='w-full shadow-xl rounded-lg pb-6'>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm my-2 w-full">
            <img
              alt="Store"
              src="https://e7.pngegg.com/pngimages/549/560/png-clipart-computer-icons-login-scalable-graphics-email-accountability-blue-logo-thumbnail.png"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Sign in
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleLogin} className="p-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between my-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      ¿Forgot your password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  />
                </div>
              </div>

              <div className='py-4'>
                <button
                  type="submit"
                  className="my-10 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Lon in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              ¿Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Regíster
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login