import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout/Layout"
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import FlashSales from "./pages/FlashSales"
import Login from "./pages/login"
import Register from "./pages/register"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Favorites from "./pages/Favorites"
import Orders from "./pages/Orders"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ProductManagement from "./pages/admin/ProductManagement"
import OrderManagement from "./pages/admin/OrderManagement"
import UsersManagement from "./pages/admin/UsersManagement"
import { useEffect } from "react"
import { useCartStore } from "./store/cartStore"
import { useAuthStore } from "./store/authStore"

function App() {
  const { user } = useAuthStore()
  useEffect(() => {
    useCartStore.getState().initCart()
  }, [])
  useEffect(() => {
    useCartStore.getState().handleUserChange()
  }, [user])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Products />} />
          <Route path="producto/:id" element={<ProductDetail />} />
          <Route path="ofertas" element={<FlashSales />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="carrito" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="favoritos"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="ordenes"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Rutas de administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<ProductManagement />} />
          <Route path="ordenes" element={<OrderManagement />} />
          <Route path="usuarios" element={<UsersManagement />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
