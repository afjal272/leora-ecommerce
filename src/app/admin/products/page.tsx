"use client"

import { useState } from "react"
import ProductTable from "@/components/admin/products/ProductTable"
import AddProductModal from "@/components/admin/products/AddProductModal"
import { Plus } from "lucide-react"

export default function AdminProductsPage() {

  const [open, setOpen] = useState(false)

  return (

    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-semibold">
            Product Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your store products
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition"
        >
          <Plus size={18} />
          Add Product
        </button>

      </div>

      {/* Product Table */}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

        <ProductTable />

      </div>

      {/* Modal */}

      {open && (
        <AddProductModal close={() => setOpen(false)} />
      )}

    </div>

  )
}