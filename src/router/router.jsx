import { createBrowserRouter } from 'react-router-dom';
import Main from '../layouts/main';
import Products from '../pages/Products'
import ProductsDetails from '../pages/productsDetails'
import Cart from '../pages/Cart'
import LogIn from '../pages/login'
import Register from '../pages/register'



const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        children: [
            {
                index: true,
                element: <Products />
            },
            {
                path: '/:id',
                element: <ProductsDetails />
            },
            {
                path: '/cart',
                element: <Cart />

            }
        ]
    },
    {
        path: '/login',
        element: <LogIn />

    }, {
        path: '/register',
        element: <Register />
    }

])

export default router;