import { useEffect } from "react"
import { Link } from "react-router-dom"
import useProductStore from "../store/useProductStore"

const MyProducts = () => {
  const { userProducts, loading, error, fetchUserProducts, deleteProduct } = useProductStore()

  useEffect(() => {
    fetchUserProducts()
  }, [fetchUserProducts])

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    await deleteProduct(id)
  }

  if (loading && userProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2">Cargando tus productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen mt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Productos</h1>
        <Link
          to="/create-product"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Crear Nuevo Producto
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {userProducts.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No tienes productos creados aún.</p>
          <Link
            to="/create-product"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Crear tu primer producto
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-200"
            >
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.nombre}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{product.descripcion}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold">${product.precio}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">Stock: {product.stock}</span>
                </div>
                <div className="flex justify-between mt-4">
                  <Link
                    to={`/edit-product/${product.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-1 px-3 rounded transition duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyProducts

