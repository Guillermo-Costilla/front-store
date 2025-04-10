import Visa from '../assets/PaymentMetods/visa.svg';
import Master from '../assets/PaymentMetods/mastercard.svg';
import Nx from '../assets/PaymentMetods/NX.webp';
import Cabal from '../assets/PaymentMetods/cabal.webp';
import Mp from '../assets/PaymentMetods/mercadopago.webp';
import Amex from '../assets/PaymentMetods/americanEx.png';

export const Payment = () => {
    const payment = [Visa, Master, Nx, Cabal, Mp, Amex];

    return (
        <div className="w-full h-auto grid grid-cols-3 grid-rows-2 gap-6 place-items-center">
            {payment.map((pay, index) => (
                <div key={index} className="w-full flex justify-center items-center cursor-pointer">
                    <img src={pay} alt="" className="w-16 h-16 object-contain" />
                </div>
            ))}
        </div>
    );
};

export default Payment;