"use client"

import { Fragment, useEffect, useState } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { Link, useLocation, useNavigate } from "react-router-dom"
import store from "../assets/store.png"
import useCartStore from "../store/storeCart"
import useAuthStore from "../store/useAuthStore"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Ordenes", href: "/orders" },
  { name: "Ofertas", href: "/offers" },
  { name: "Nosotros", href: "/about" },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const cartItems = useCartStore((state) => state.cartItems)
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const defaultPhoto =
    "https://e7.pngegg.com/pngimages/549/560/png-clipart-computer-icons-login-scalable-graphics-email-accountability-blue-logo-thumbnail.png"
  const [scrolled, setScrolled] = useState(false)

  // Efecto para detectar scroll con dependencias corregidas
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener("scroll", handleScroll)

    // Llamada inicial para establecer el estado correcto
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, []) // Sin dependencia a scrolled para evitar bucles

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Disclosure
      as="nav"
      className={classNames(
        "fixed top-0 w-full z-50 transition-all duration-300 mb-20",
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white shadow-md",
      )}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Botón de menú móvil */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all duration-200">
                  <span className="sr-only">Abrir menú principal</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo y navegación de escritorio */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="flex items-center transition-transform duration-300 hover:scale-105">
                    <img src={store || "/placeholder.svg"} alt="Tienda" className="h-8 w-auto sm:h-10" />
                  </Link>
                </div>
                <div className="hidden sm:ml-8 sm:flex sm:items-center sm:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href
                          ? "text-indigo-600 border-b-2 border-indigo-600"
                          : "text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600",
                        "px-3 py-2 text-sm font-medium transition-all duration-200 relative group",
                      )}
                    >
                      {item.name}
                      <span
                        className={classNames(
                          "absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                          location.pathname === item.href ? "scale-x-100" : "",
                        )}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Carrito y perfil */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-4">
                {/* Icono del carrito */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group"
                  aria-label="Carrito de compras"
                >
                  <ShoppingCartIcon
                    className="h-6 w-6 transition-transform group-hover:scale-110 duration-200"
                    aria-hidden="true"
                  />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110">
                      {cartItemsCount}
                    </span>
                  )}
                </button>

                {/* Menú desplegable de perfil */}
                <Menu as="div" className="relative ml-3">
                  <Menu.Button className="relative flex rounded-full bg-gray-100 p-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 hover:bg-indigo-50 transition-all duration-200">
                    <span className="sr-only">Abrir menú de usuario</span>
                    <img
                      src={user?.imagen || defaultPhoto}
                      alt="Perfil"
                      className="h-8 w-8 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 transition-all duration-200"
                    />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {isAuthenticated ? (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={classNames(
                                  active ? "bg-indigo-50" : "",
                                  "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150",
                                )}
                              >
                                Mi Perfil
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-indigo-50" : "",
                                  "w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150",
                                )}
                              >
                                Cerrar Sesión
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/login"
                                className={classNames(
                                  active ? "bg-indigo-50" : "",
                                  "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150",
                                )}
                              >
                                Iniciar Sesión
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/register"
                                className={classNames(
                                  active ? "bg-indigo-50" : "",
                                  "block px-4 py-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors duration-150",
                                )}
                              >
                                Registrarme
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Panel de menú móvil */}
          <Disclosure.Panel className="sm:hidden bg-white border-t">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={classNames(
                    location.pathname === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600",
                    "block rounded-md px-3 py-2 text-base font-medium transition-all duration-150",
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

