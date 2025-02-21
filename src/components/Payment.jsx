import Visa from '../assets/PaymentMetods/visa.svg'
import Master from '../assets/PaymentMetods/mastercard.svg'
import Nx from '../assets/PaymentMetods/NX.webp'
import Cabal from '../assets/PaymentMetods/cabal.webp'
import Mp from '../assets/PaymentMetods/mercadopago.webp'
import Amex from '../assets/PaymentMetods/americanEx.png'

export const Payment = () => {

    const payment = [
        Visa, Master, Nx, Cabal, Mp, Amex
    ]

    return (
        <div className='w-full h-auto grid grid-cols-3 grid-rows-2 gap-4'>
            {
                payment.map(pay => (
                    <div className='w-full flex justify-center items-center cursor-pointer my-4'>
                        <img src={pay} className='w-12 h-12' />
                    </div>
                ))
            }
        </div>
    )
}

export default Payment