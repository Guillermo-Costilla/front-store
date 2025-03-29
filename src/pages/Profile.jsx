import { useState, useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'
//import useOrderStore from '../store/useOrderStore'
//import { useEffect } from 'react'

const Profile = () => {
    const { user, updateProfile } = useAuthStore()
    //const { orders, fetchUserOrders } = useOrderStore()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        imagen: user?.imagen || '',
    })

    // Actualizar formData cuando cambie el usuario
    useEffect(() => {
        setFormData({
            nombre: user?.nombre || '',
            email: user?.email || '',
            imagen: user?.imagen || '',
        });
    }, [user]);

    //useEffect(() => {
    //    fetchUserOrders()
    // }, [fetchUserOrders])

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        const result = await updateProfile(formData)
        if (result.success) {
            setSuccess(true)
            setIsEditing(false)
            // Actualizar el formData con los datos más recientes del usuario
            const updatedUser = useAuthStore.getState().user;
            setFormData({
                nombre: updatedUser?.nombre || '',
                email: updatedUser?.email || '',
                imagen: updatedUser?.imagen || '',
            });
        } else {
            setError(result.error)
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-screen">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center w-full">
                    {/* Perfil */}
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Mi Profile</h2>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </button>
                            )}
                        </div>

                        {!isEditing ? (
                            <div className="space-y-4">
                                <div className="flex justify-center mb-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <img
                                            src={user?.imagen}
                                            alt="Foto de perfil"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-gray-600 text-sm">Name</p>
                                    <p className="font-semibold">{user?.nombre}</p>
                                </div>
                                <div className="border-b pb-2">
                                    <p className="text-gray-600 text-sm">Email</p>
                                    <p className="font-semibold">{user?.email}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                                        <span className="block sm:inline">
                                            Profile updated successfully</span>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleInput}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInput}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="imagen"
                                        value={formData.imagen}
                                        onChange={handleInput}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                                    >
                                        Save changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false)
                                            setFormData({
                                                nombre: user?.nombre || '',
                                                email: user?.email || '',
                                                imagen: user?.imagen || '',
                                            })
                                        }}
                                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Pedidos 
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Mis Pedidos</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">Pedido #{order.id}</span>
                                        <span className="px-2 py-1 rounded text-sm font-semibold bg-yellow-100 text-yellow-800">
                                            {order.status || 'Pendiente'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {order.products.map((product) => (
                                            <div key={product.id} className="flex justify-between items-center">
                                                <span>{product.title}</span>
                                                <span className="font-semibold">${product.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 pt-4 border-t">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total:</span>
                                            <span className="font-bold">${order.total}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && (
                                <p className="text-gray-500 text-center">No tienes pedidos aún</p>
                            )}
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Profile 