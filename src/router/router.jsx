import { createBrowserRouter } from 'react-router-dom';
import Main from '../layouts/main';
import Products from '../pages/Products'
import ProductsDetails from '../pages/productsDetails'
import Cart from '../pages/Cart'
import LogIn from '../pages/login'
import Register from '../pages/register'
import Coupon from '../pages/Coupon';
import Offers from '../pages/Offers';
import About from '../pages/About';



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
            }, {
                path: '/coupon',
                element: <Coupon />
            }, {
                path: '/offers',
                element: <Offers />
            }, {
                path: '/about',
                element: <About />
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