import { adminAPI } from "../../lib/api"
import { useState, useEffect } from "react"
import Swal from 'sweetalert2'

export default function UsersManagement() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const response = await adminAPI.getUsers()
            setUsers(response.data.usuarios || response.data)
        }
        catch (error) {
            Swal.fire('Error al cargar los usuarios', '', 'error')
        }
    }


    return (
        <div className="w-full min-h-screen font-sans bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div className="text-xl font-sans text-gray-900 dark:text-white border-2 rounded-xl p-2" key={user.id}>
                            <h1><span className="text-xl font-semibold text-blue-500 dark:text-white">Nombre:</span> {user.nombre}</h1>
                            <p><span className="text-xl font-semibold text-blue-500 dark:text-white">Email:</span> {user.email}</p>
                            <p><span className="text-xl font-semibold text-blue-500 dark:text-white">Direccion:</span> {user.direccion}</p>
                            <p><span className="text-xl font-semibold text-blue-500 dark:text-white">Localidad: </span>{user.localidad}</p>
                            <p><span className="text-xl font-semibold text-blue-500 dark:text-white">País:</span> {user.pais}</p>
                            <p><span className="text-xl font-semibold text-blue-500 dark:text-white">CP:</span> {user.codigo_postal}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}