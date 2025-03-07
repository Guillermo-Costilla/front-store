import store from '../assets/store.png'

const Footer = () => {
    return (
        <footer className="mt-auto bg-slate-900 text-white">
            <div className="w-full flex text-center">
                <div className='w-1/2 justify-between sm:flex sm:items-center sm:justify-between'>
                    <img src={store} className='w-[100px] h-[100px] ml-10' alt="Store" />
                </div>
                <div className="space-x-4 w-1/2 m-auto text-center" >
                    <a href="">About</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Licensing</a>
                    <a href="">Contact</a>
                </div>
            </div>
            <div className='w-full text-center mx-auto'>
                <hr className="border-gray-500 w-full my-4" />
                <p className='my-4'>© 2025 Store™</p>
            </div>
        </footer>
    )
}

export default Footer