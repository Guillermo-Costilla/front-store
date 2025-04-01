import store from '../assets/store.png'

const Footer = () => {
    return (
        <footer className="mt-auto bg-white text-gray-800 shadow-t-lg">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between py-6 px-10 space-y-6 sm:space-y-0">
                {/* Logo con animación */}
                <div className="flex justify-center">
                    <img src={store} className="w-[100px] h-[100px] hover:rotate-6 transition-all duration-300" alt="Store" />
                </div>

                {/* Links de navegación */}
                <div className="flex space-x-6 text-lg">
                    <a href="#" className="hover:scale-105 hover:text-indigo-500 transition-all duration-300">About</a>
                    <a href="#" className="hover:scale-105 hover:text-indigo-500 transition-all duration-300">Privacy Policy</a>
                    <a href="#" className="hover:scale-105 hover:text-indigo-500 transition-all duration-300">Licensing</a>
                    <a href="#" className="hover:scale-105 hover:text-indigo-500 transition-all duration-300">Contact</a>
                </div>
            </div>

            {/* Línea divisoria y derechos de autor */}
            <div className="w-full text-center">
                <hr className="border-gray-300 w-full my-4" />
                <p className="text-gray-500 text-lg font-medium py-4">© 2025 Store™</p>
            </div>
        </footer>
    );
}

export default Footer;
