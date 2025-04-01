import { Disclosure, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import store from '../assets/store.png';
import useCartStore from '../store/storeCart';
import useAuthStore from '../store/useAuthStore';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Orders', href: '/orders' },
  { name: 'Offers', href: '/offers' },
  { name: 'About', href: '/about' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const defaultPhoto = "https://e7.pngegg.com/pngimages/549/560/png-clipart-computer-icons-login-scalable-graphics-email-accountability-blue-logo-thumbnail.png";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="bg-white shadow-md fixed top-0 w-full z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative flex h-16 items-center justify-between">
              {/* Contenedor del menú móvil con margen izquierdo */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden ml-2">
                <Disclosure.Button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none z-50">
                  {open ? <XMarkIcon className="size-6" /> : <Bars3Icon className="size-6" />}
                </Disclosure.Button>
              </div>

              {/* Logo con tamaño ajustable */}
              <Link to="/">
                <img src={store} alt="Store" className="sm:h-12 h-8 w-auto pl-16" />
              </Link>

              {/* Links en desktop */}
              <div className="hidden sm:block">
                <div className="flex space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? 'text-indigo-600 border-b-2 border-indigo-600 border-opacity-100'
                          : 'text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-opacity-100',
                        'px-3 py-2 text-sm font-medium transition-all duration-300'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Iconos del carrito y perfil */}
              <div className="flex items-center gap-8">
                {/* Carrito */}
                <Link to='/cart' className="relative">
                  <svg className="size-6 text-gray-700 hover:text-indigo-600 transition-all" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                </Link>

                {/* Perfil */}
                <Menu as="div" className="relative">
                  <Menu.Button className="flex rounded-full bg-gray-100 p-1 hover:bg-gray-200 transition-all">
                    <img src={user?.imagen || defaultPhoto} alt="Profile" className="size-8 object-cover rounded-full" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black/5">
                    {isAuthenticated ? (
                      <>
                        <Menu.Item>
                          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Mi Profile
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Log out
                          </button>
                        </Menu.Item>
                      </>
                    ) : (
                      <>
                        <Menu.Item>
                          <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Sign in
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Register
                          </Link>
                        </Menu.Item>
                      </>
                    )}
                  </Menu.Items>
                </Menu>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
