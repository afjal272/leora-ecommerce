"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useProductStore } from "../../../store/product.store"
import { Search } from "lucide-react"
import EditProductModal from "./EditProductModal"

type Product = {
  id: string
  name: string
  slug?: string
  image: string
  images?: string[]
  price: number
  category?: string
  stock?: number
}

type Props = {
  refresh?: boolean
}

export default function ProductTable({ refresh }: Props) {

  const { products, deleteProduct, setProducts } = useProductStore()

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)

  // 🔥 NEW: API URL fix
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // ✅ FETCH FUNCTION (IMPROVED)
  const fetchProducts = async () => {
    try {
      setLoading(true)

      const res = await fetch(`${API_URL}/api/products`)

      // 🔥 FIX
      if (!res.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await res.json()

      if (data?.success && data?.data) {
        setProducts(data.data)
      }

    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [refresh])


  // ✅ DELETE (IMPROVED)
  const handleDelete = async (id: string) => {

  if (!localStorage.getItem("token")) {
    alert("Login required")
    return
  }

  if (!confirm("Delete this product?")) return

  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // 🔥 ADD
      },
    })

    if (!res.ok) throw new Error("Unauthorized or delete failed")

    const data = await res.json()

    if (!data.success) {
      throw new Error(data.message)
    }

    deleteProduct(id)

  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Delete failed"

    alert(message)
  }
}
  // 🔥 SAFE FILTER
  const filteredProducts = (products || []).filter((product: Product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full">

      {/* SEARCH */}
      <div className="p-6 border-b bg-white">
        <div className="relative w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-black"
          />

        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="p-6 text-sm text-gray-500">
          Loading products...
        </div>
      )}

      {/* 🔥 EMPTY STATE */}
      {!loading && filteredProducts.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No products found
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4">Image</th>
              <th className="text-left px-6 py-4">Product Name</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredProducts.map((product: Product) => {

              const displayImage =
                product.images?.[0] || product.image || "/placeholder.png"

              return (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="px-6 py-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border">
                      <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {product.category || "—"}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    ₹{product.price}
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      {product.stock ?? 0} in stock
                    </span>
                  </td>

                  <td className="px-6 py-4 flex gap-3">

                    <button
                      onClick={() => setEditProduct(product)}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            })}

          </tbody>

        </table>

      </div>

      {/* EDIT MODAL */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          close={() => setEditProduct(null)}
          onSuccess={() => {
            setEditProduct(null)
            fetchProducts()
          }}
        />
      )}

    </div>
  )
}