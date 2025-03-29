export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}; 