import axios from "axios"

const API_BASE_URL = "https://store-backend-pied.vercel.app/api"

// Configurar axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// API de autenticación
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData)
    return response
  },

  login: async (credentials) => {
    const response = await api.post("/users/login", credentials)
    return response
  },

  getProfile: async () => {
    const response = await api.get("/users/profile")
    return response
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData)
    return response
  },
}

// API de productos
export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get("/products", { params })
    return response
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response
  },

  getCategories: async () => {
    const response = await api.get("/products/categories")
    return response
  },

  create: async (productData) => {
    const response = await api.post("/products", productData)
    return response
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response
  },
}

// API de órdenes
export const ordersAPI = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData)
    return response
  },

  getUserOrders: async () => {
    const response = await api.get("/orders/my-orders")
    return response
  },

  getAllOrders: async (params = {}) => {
    const response = await api.get("/orders/all", { params })
    return response
  },

  updateOrderStatus: async (orderId, statusData) => {
    const response = await api.put(`/orders/${orderId}/status`, statusData)
    return response
  },

  confirmPayment: async (paymentData) => {
    const response = await api.post("/orders/confirm-payment", paymentData)
    return response
  },
}

// API de pagos
export const paymentsAPI = {
  processPayment: async (paymentData) => {
    const response = await api.post("/payments/process-payment", paymentData)
    return response
  },

  createPaymentIntent: async (paymentData) => {
    const response = await api.post("/payments/create-payment-intent", paymentData)
    return response
  },

  getPublicKey: async () => {
    const response = await api.get("/payments/public-key")
    return response
  },
}

// API de favoritos
export const favoritesAPI = {
  add: async (favoriteData) => {
    const response = await api.post("/favoritos", favoriteData)
    return response
  },

  remove: async (favoriteData) => {
    const response = await api.delete("/favoritos", { data: favoriteData })
    return response
  },

  getByUserId: async (userId) => {
    const response = await api.get(`/favoritos/${userId}`)
    return response
  },
}

// API de admin
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get("/admin/dashboard")
    return response
  },
}

export default api
