import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Filter, Grid, List, SlidersHorizontal, Star } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { productsAPI } from "../lib/api"
import Swal from 'sweetalert2'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Estados de filtros
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    sortBy: searchParams.get("sortBy") || "name",
    search: searchParams.get("search") || "",
  })

  const [categories, setCategories] = useState([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFilters()
    updateURL()
  }, [filters, products])

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll()
      const productsData = response.data

      setProducts(productsData)

      // Extraer categorías únicas
      const uniqueCategories = [...new Set(productsData.map((p) => p.categoria).filter(Boolean))]
      setCategories(uniqueCategories)

      // Calcular rango de precios
      const prices = productsData.map((p) => Number.parseFloat(p.precio))
      setPriceRange({
        min: Math.floor(Math.min(...prices)),
        max: Math.ceil(Math.max(...prices)),
      })
    } catch (error) {
      Swal.fire('Error al cargar productos', '', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filtro por búsqueda
    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    // Filtro por categoría
    if (filters.category !== "all") {
      filtered = filtered.filter((product) => product.categoria === filters.category)
    }

    // Filtro por precio
    if (filters.minPrice) {
      filtered = filtered.filter((product) => Number.parseFloat(product.precio) >= Number.parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((product) => Number.parseFloat(product.precio) <= Number.parseFloat(filters.maxPrice))
    }

    // Filtro por rating
    if (filters.minRating) {
      filtered = filtered.filter((product) => product.puntuacion >= Number.parseFloat(filters.minRating))
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return Number.parseFloat(a.precio) - Number.parseFloat(b.precio)
        case "price-desc":
          return Number.parseFloat(b.precio) - Number.parseFloat(a.precio)
        case "rating":
          return (b.puntuacion || 0) - (a.puntuacion || 0)
        case "newest":
          return new Date(b.fecha_creacion || Date.now()) - new Date(a.fecha_creacion || Date.now())
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

    setFilteredProducts(filtered)
  }

  const updateURL = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "") {
        params.set(key, value)
      }
    })
    setSearchParams(params)
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      sortBy: "name",
      search: "",
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card p-4">
                <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 dark:bg-gray-600 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Productos</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length} de {products.length} productos
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          {/* Botón de filtros móvil */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden btn-secondary inline-flex items-center space-x-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filtros</span>
          </button>

          {/* Ordenamiento */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            className="input min-w-[150px]"
          >
            <option value="name">Nombre A-Z</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Calificados</option>
            <option value="newest">Más Nuevos</option>
          </select>

          {/* Vista */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 ${viewMode === "grid" ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600" : "text-gray-500"}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${viewMode === "list" ? "bg-primary-100 dark:bg-primary-900/20 text-primary-600" : "text-gray-500"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="card p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
              <button onClick={clearFilters} className="text-primary-600 hover:text-primary-700 text-sm">
                Limpiar
              </button>
            </div>

            <div className="space-y-6">
              {/* Búsqueda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Buscar</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  placeholder="Buscar productos..."
                  className="input"
                />
              </div>

              {/* Categorías */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="input"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rango de precios */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio (${priceRange.min} - ${priceRange.max})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    placeholder="Mín"
                    min={priceRange.min}
                    max={priceRange.max}
                    className="input"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    placeholder="Máx"
                    min={priceRange.min}
                    max={priceRange.max}
                    className="input"
                  />
                </div>
              </div>

              {/* Rating mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Calificación mínima
                </label>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating.toString()}
                        onChange={(e) => handleFilterChange("minRating", e.target.value)}
                        className="text-primary-600"
                      />
                      <div className="flex items-center space-x-1">
                        {renderStars(rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-400">y más</span>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value=""
                      checked={filters.minRating === ""}
                      onChange={(e) => handleFilterChange("minRating", e.target.value)}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Todas las calificaciones</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
              {filteredProducts.map((product) =>
                viewMode === "grid" ? (
                  <ProductCard key={product.id} product={product} />
                ) : (
                  <ProductCardList key={product.id} product={product} />
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No se encontraron productos</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Intenta ajustar los filtros para encontrar lo que buscas
              </p>
              <button onClick={clearFilters} className="btn-primary">
                Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Componente para vista de lista
function ProductCardList({ product }) {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
      />
    ))
  }

  const displayPrice = product.precio_descuento || product.precio
  const hasDiscount = product.descuento > 0

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-6">
        <img
          src={product.imagen || "/placeholder.svg?height=120&width=120"}
          alt={product.nombre}
          className="w-32 h-32 object-cover rounded-lg"
        />

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.nombre}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{product.descripcion}</p>

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(product.puntuacion || 0)}
              <span className="text-sm text-gray-600 dark:text-gray-400">({product.puntuacion || 0})</span>
            </div>

            {product.categoria && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                {product.categoria}
              </span>
            )}

            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
            >
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">${displayPrice}</span>
              {hasDiscount && <span className="text-lg text-gray-500 line-through">${product.precio}</span>}
            </div>

            <ProductCard product={product} compact={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
