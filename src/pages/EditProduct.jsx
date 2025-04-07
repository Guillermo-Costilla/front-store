"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useProductStore from "../store/useProductStore"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userProducts, updateProduct, fetchUserProducts, loading, error } = useProductStore()

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  })

  useEffect(() => {
    // Cargar los productos del usuario si aún no están cargados
    if (userProducts.length === 0) {
      fetchUserProducts()
    } else {
      // Buscar el producto a editar
      const productToEdit = userProducts.find((p) => p.id === Number.parseInt(id))
      if (productToEdit) {
        setFormData({
          nombre: productToEdit.nombre,
          descripcion: productToEdit.descripcion,
          precio: productToEdit.precio.toString(),
          stock: productToEdit.stock.toString(),
        })
      }
    }
  }, [id, userProducts, fetchUserProducts])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convertir precio y stock a números
    const productData = {
      ...formData,
      precio: Number.parseFloat(formData.precio),
      stock: Number.parseInt(formData.stock),
    }

    const result = await updateProduct(id, productData)

    if (result.success) {
      navigate("/myproducts")
    }
  }

  if (loading && userProducts.length === 0) {
    return <div className="text-center mt-10">Cargando información del producto...</div>
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre del Producto
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            min="0"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/myproducts")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct

