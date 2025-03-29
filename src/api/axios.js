import axios from 'axios';

// Crear instancia de axios con configuración base
export const axiosInstance = axios.create({
  baseURL: 'https://store-backend-7ws5.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const fakeStoreApi = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

// Interceptor para agregar el token a las peticiones autenticadas
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Enviando petición a:', config.url);
    const token = JSON.parse(localStorage.getItem('auth-storage'))?.state?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Respuesta recibida:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de estado diferente de 2xx
      console.error('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error('Error de conexión:', error.request);
    } else {
      // Algo sucedió en la configuración de la petición
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
); 