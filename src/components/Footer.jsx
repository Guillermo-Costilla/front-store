import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 mb-0">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Columna 1: Logo y descripción */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Store</h2>
                        <p className="text-gray-400">
                            Your destination for the best products at the best prices.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <motion.a
                                href="#"
                                whileHover={{ y: -3, color: '#1DA1F2' }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Facebook size={20} />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ y: -3, color: '#1DA1F2' }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter size={20} />
                            </motion.a>
                            <motion.a
                                href="#"
                                whileHover={{ y: -3, color: '#E1306C' }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <Instagram size={20} />
                            </motion.a>
                        </div>
                    </div>

                    {/* Columna 2: Enlaces rápidos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick links</h3>
                        <ul className="space-y-2">
                            {['Home', 'Products', 'Offers', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/"
                                        className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin className="mr-2 text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <span className="text-gray-400">Av. Siempreviva 742, Springfield</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="mr-2 text-gray-400 flex-shrink-0" size={18} />
                                <span className="text-gray-400">+1 234 567 890</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="mr-2 text-gray-400 flex-shrink-0" size={18} />
                                <span className="text-gray-400">info@tutienda.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                    <p>© {new Date().getFullYear()} Store. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;