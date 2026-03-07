"use client"

import { useState } from "react"
import Image from "next/image"
import { useProductStore } from "@/store/product.store"
import { Search } from "lucide-react"

export default function ProductTable() {

  const { products, deleteProduct } = useProductStore()

  const [search, setSearch] = useState("")

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full">

      {/* SEARCH BAR */}

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

            {filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-b hover:bg-gray-50 transition"
              >

                {/* IMAGE */}

                <td className="px-6 py-4">

                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border">

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />

                  </div>

                </td>

                {/* NAME */}

                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                {/* CATEGORY */}

                <td className="px-6 py-4 text-gray-600">
                  {product.category}
                </td>

                {/* PRICE */}

                <td className="px-6 py-4 font-medium">
                  ₹{product.price}
                </td>

                {/* STOCK */}

                <td className="px-6 py-4">

                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">

                    {product.stock} in stock

                  </span>

                </td>

                {/* ACTION */}

                <td className="px-6 py-4">

                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}