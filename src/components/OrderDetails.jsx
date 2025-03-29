import { useEffect } from 'react';
import useOrderStore from '../store/useOrderStore';
import { formatCurrency } from '../utils/format';

const OrderDetails = ({ orderId }) => {
    const { currentOrder, loading, error, fetchOrderDetails } = useOrderStore();

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId, fetchOrderDetails]);

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="text-gray-500 text-center p-4">
                No se encontraron detalles de la orden
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Orden #{currentOrder.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentOrder.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {currentOrder.status === 'completed' ? 'Completada' : 'Pendiente'}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                    Fecha: {new Date(currentOrder.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* Detalles de los productos */}
            <div className="space-y-4 mb-6">
                <h4 className="font-semibold text-gray-700">Productos</h4>
                {currentOrder.detalles?.map((detalle) => (
                    <div key={detalle.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p className="font-medium">{detalle.producto_nombre}</p>
                            <p className="text-sm text-gray-600">
                                Cantidad: {detalle.cantidad} x {formatCurrency(detalle.precio_unitario)}
                            </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(detalle.subtotal)}</p>
                    </div>
                ))}
            </div>

            {/* Información de pago */}
            {currentOrder.transaccion && (
                <div className="bg-gray-50 rounded p-4 mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Información de pago</h4>
                    <div className="space-y-2 text-sm">
                        <p>ID de transacción: {currentOrder.transaccion.stripe_charge_id}</p>
                        <p>Estado: {currentOrder.transaccion.status}</p>
                        <p>Moneda: {currentOrder.transaccion.currency.toUpperCase()}</p>
                        <p>Descripción: {currentOrder.transaccion.description}</p>
                    </div>
                </div>
            )}

            {/* Total */}
            <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(currentOrder.total_amount)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails; 