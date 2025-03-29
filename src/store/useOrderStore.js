import { create } from 'zustand'
import { axiosInstance } from '../api/axios'
import useAuthStore from './useAuthStore'

const useOrderStore = create((set, get) => ({
    orders: [],
    currentOrder: null,
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,

    // Obtener órdenes del usuario
    fetchUserOrders: async () => {
        try {
            const { user } = useAuthStore.getState();
            if (!user?.id) throw new Error('Usuario no autenticado');

            set({ loading: true, error: null });
            const { data } = await axiosInstance.get(`/orders/user/${user.id}`);
            set({ orders: data.orders, loading: false });
        } catch (error) {
            console.error('Error al obtener órdenes:', error);
            set({ 
                error: error.response?.data?.message || 'Error al obtener las órdenes',
                loading: false 
            });
        }
    },

    // Obtener detalles de una orden específica
    fetchOrderDetails: async (orderId) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axiosInstance.get(`/orders/${orderId}`);
            set({ 
                currentOrder: {
                    ...data.order,
                    detalles: data.detalles,
                    transaccion: data.transaccion
                },
                loading: false 
            });
            return data;
        } catch (error) {
            console.error('Error al obtener detalles de la orden:', error);
            set({ 
                error: error.response?.data?.message || 'Error al obtener detalles de la orden',
                loading: false 
            });
            return null;
        }
    },

    // Obtener historial de transacciones
    fetchTransactionHistory: async () => {
        try {
            set({ loading: true, error: null });
            const { data } = await axiosInstance.get('/transactions');
            set({ 
                transactions: data.transactions,
                loading: false 
            });
            return data.transactions;
        } catch (error) {
            console.error('Error al obtener historial de transacciones:', error);
            set({ 
                error: error.response?.data?.message || 'Error al obtener historial de transacciones',
                loading: false 
            });
            return null;
        }
    },

    // Obtener detalles de una transacción
    fetchTransactionDetails: async (transactionId) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axiosInstance.get(`/transactions/${transactionId}`);
            set({ 
                currentTransaction: data.transaction,
                loading: false 
            });
            return data.transaction;
        } catch (error) {
            console.error('Error al obtener detalles de la transacción:', error);
            set({ 
                error: error.response?.data?.message || 'Error al obtener detalles de la transacción',
                loading: false 
            });
            return null;
        }
    },

    // Crear una nueva orden
    createOrder: async (orderData) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axiosInstance.post('/orders', orderData);
            
            // Actualizar la lista de órdenes
            const currentOrders = get().orders;
            set({ 
                orders: [...currentOrders, data.order],
                currentOrder: data.order,
                loading: false 
            });

            return {
                success: true,
                orderId: data.orderId,
                charge: data.charge
            };
        } catch (error) {
            console.error('Error al crear la orden:', error);
            set({ 
                error: error.response?.data?.message || 'Error al crear la orden',
                loading: false 
            });
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear la orden'
            };
        }
    },

    // Actualizar el estado de una orden
    updateOrderStatus: async (orderId, status) => {
        try {
            set({ loading: true, error: null });
            const { data } = await axiosInstance.put(`/api/orders/${orderId}/status`, { status });
            
            // Actualizar la orden en la lista
            const updatedOrders = get().orders.map(order => 
                order.id === orderId ? { ...order, status: status } : order
            );
            
            set({ 
                orders: updatedOrders,
                currentOrder: data.order,
                loading: false 
            });

            return { success: true };
        } catch (error) {
            console.error('Error al actualizar estado de la orden:', error);
            set({ 
                error: error.response?.data?.message || 'Error al actualizar estado de la orden',
                loading: false 
            });
            return { 
                success: false,
                error: error.response?.data?.message || 'Error al actualizar estado de la orden'
            };
        }
    },

    // Limpiar estados
    clearCurrentOrder: () => {
        set({ currentOrder: null });
    },

    clearCurrentTransaction: () => {
        set({ currentTransaction: null });
    },

    clearError: () => {
        set({ error: null });
    }
}));

export default useOrderStore; 