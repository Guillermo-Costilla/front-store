import { useEffect } from 'react';
import useOrderStore from '../store/useOrderStore';
import { formatCurrency } from '../utils/format';

const TransactionDetails = ({ transactionId }) => {
    const { currentTransaction, loading, error, fetchTransactionDetails } = useOrderStore();

    useEffect(() => {
        if (transactionId) {
            fetchTransactionDetails(transactionId);
        }
    }, [transactionId, fetchTransactionDetails]);

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

    if (!currentTransaction) {
        return (
            <div className="text-gray-500 text-center p-4">
                No se encontraron detalles de la transacción
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="border-b pb-4 mb-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Transacción</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentTransaction.status === 'succeeded'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {currentTransaction.status === 'succeeded' ? 'Exitosa' : 'Pendiente'}
                    </span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">ID de Stripe</p>
                        <p className="font-medium">{currentTransaction.stripe_charge_id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Monto</p>
                        <p className="font-medium">
                            {formatCurrency(currentTransaction.amount, currentTransaction.currency)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Moneda</p>
                        <p className="font-medium">{currentTransaction.currency.toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="font-medium">
                            {new Date(currentTransaction.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {currentTransaction.description && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-600">Descripción</p>
                        <p className="font-medium">{currentTransaction.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionDetails; 