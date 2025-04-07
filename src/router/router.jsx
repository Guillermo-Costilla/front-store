import { createBrowserRouter, Navigate } from "react-router-dom"
import Main from "../layouts/main"
import Products from "../pages/Products"
import ProductsDetails from "../pages/productsDetails"
import Cart from "../pages/Cart"
import LogIn from "../pages/login"
import Register from "../pages/register"
import Profile from "../pages/Profile"
import Offers from "../pages/Offers"
import Orders from "../pages/Orders"
import About from "../pages/About"
import Payments from "../payment/Payment"
import useAuthStore from "../store/useAuthStore"
import CreateProduct from "../pages/CreateProduct"
import MyProducts from "../pages/MyProducts"
import EditProduct from "../pages/EditProduct"

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                index: true,
                element: <Products />,
            },
            {
                path: ":id",
                element: <ProductsDetails />,
            },
            {
                path: "/cart",
                element: (
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/orders",
                element: <Orders />,
            },
            {
                path: "/offers",
                element: <Offers />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/payment",
                element: (
                    <ProtectedRoute>
                        <Payments />
                    </ProtectedRoute>
                ),
            },
            // Nuevas rutas para productos
            {
                path: "/myproducts",
                element: (
                    <ProtectedRoute>
                        <MyProducts />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/create-product",
                element: (
                    <ProtectedRoute>
                        <CreateProduct />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/edit-product/:id",
                element: (
                    <ProtectedRoute>
                        <EditProduct />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "/login",
        element: <LogIn />,
    },
    {
        path: "/register",
        element: <Register />,
    },
])

export default router

