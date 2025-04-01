import { processPaymentRequest, getCardToken } from './paymentService';
import { handlePaymentError, PaymentError, PaymentErrorTypes } from './errorHandler';

/**
 * Función que simula un test de integración del flujo de pago
 */
const testPagoExitoso = async () => {
  console.log('---------- TEST DE PAGO EXITOSO ----------');
  try {
    // Datos de prueba
    const mockCartItems = [
      { id: 1, title: 'Producto 1', price: 19.99, quantity: 2, image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'Producto 2', price: 29.99, quantity: 1, image: 'https://via.placeholder.com/150' },
    ];

    // Simular tokenización de tarjeta
    console.log('1. Obteniendo token de tarjeta...');
    const cardTokenResponse = await getCardToken({ number: '4242424242424242', exp: '12/25', cvc: '123' });
    console.log('✅ Token obtenido:', cardTokenResponse.token);

    // Datos de pago
    const paymentData = {
      token: cardTokenResponse.token,
      amount: Math.round(mockCartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 100),
      currency: 'usd',
      description: 'Pago de prueba',
      items: mockCartItems,
      customer: {
        email: 'cliente@ejemplo.com',
        name: 'Cliente de Prueba',
        region: 'España'
      }
    };

    // Procesar pago
    console.log('2. Procesando pago...');
    console.log('Datos del pago:', paymentData);
    
    // En un entorno real, esto enviaría la solicitud al servidor
    // Aquí simulamos una respuesta exitosa
    const response = { success: true, data: { id: 'pay_123456', status: 'succeeded' } };
    console.log('✅ Pago procesado correctamente:', response);
    
    return response;
  } catch (error) {
    console.error('❌ Error en el test de pago exitoso:', error);
    const errorInfo = handlePaymentError(error);
    console.error('Información de error procesada:', errorInfo);
    return { success: false, error: errorInfo };
  }
};

/**
 * Test de diferentes escenarios de error
 */
const testEscenariosFallo = async () => {
  console.log('---------- TEST DE ESCENARIOS DE ERROR ----------');
  
  // 1. Error de validación
  try {
    console.log('1. Probando error de validación (monto inválido)...');
    const invalidData = {
      token: 'tok_visa',
      amount: -100, // Monto inválido
      currency: 'usd',
      items: [{ id: 1, price: 10, quantity: 1 }]
    };
    
    await processPaymentRequest(invalidData);
  } catch (error) {
    console.log('✅ Error capturado correctamente:');
    const errorInfo = handlePaymentError(error);
    console.log(errorInfo);
  }
  
  // 2. Error de servidor
  try {
    console.log('\n2. Probando error de servidor (simulado)...');
    const serverError = new Error('Error 500 Internal Server Error');
    serverError.response = {
      status: 500,
      data: { message: 'Error interno del servidor' }
    };
    throw serverError;
  } catch (error) {
    console.log('✅ Error capturado correctamente:');
    const errorInfo = handlePaymentError(error);
    console.log(errorInfo);
  }
  
  // 3. Error de red
  try {
    console.log('\n3. Probando error de red (simulado)...');
    const networkError = new Error('Network Error');
    networkError.request = {}; // Simular que hubo una solicitud pero no respuesta
    throw networkError;
  } catch (error) {
    console.log('✅ Error capturado correctamente:');
    const errorInfo = handlePaymentError(error);
    console.log(errorInfo);
  }
  
  // 4. Error personalizado de pago
  try {
    console.log('\n4. Probando error personalizado de tarjeta...');
    throw new PaymentError(
      'La tarjeta fue rechazada por fondos insuficientes',
      PaymentErrorTypes.CARD,
      { cardNumber: '****4242', error_code: 'insufficient_funds' }
    );
  } catch (error) {
    console.log('✅ Error capturado correctamente:');
    const errorInfo = handlePaymentError(error);
    console.log(errorInfo);
  }
};

// Ejecutamos los tests
const runAllTests = async () => {
  console.log('======= INICIANDO PRUEBAS DEL SISTEMA DE PAGO =======');
  await testPagoExitoso();
  console.log('\n');
  await testEscenariosFallo();
  console.log('\n======= PRUEBAS COMPLETADAS =======');
};

// Exportamos las funciones de test
export { testPagoExitoso, testEscenariosFallo, runAllTests };

// Si este archivo se ejecuta directamente (no como importación)
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
} 