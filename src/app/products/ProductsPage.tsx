"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useProductStore, Product } from "@/store/product.store"
import { useStore } from "@/hooks/useStore"
import ProductCard from "@/components/product/product-card"

export default function ProductsPage() {
  const products = useStore(useProductStore, (state) => state.products) ?? []

  const searchParams = useSearchParams()
  const urlSearch = searchParams.get("search") || ""

  const [search, setSearch] = useState(urlSearch)
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState<"default" | "low" | "high">("default")

  // URL search change ho to state sync ho
  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  // Dynamic categories
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category))
    return ["all", ...Array.from(unique)]
  }, [products])

  // Filtering + Sorting
  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products]

    // Search
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      )
    }

    // Category
    if (category !== "all") {
      result = result.filter(
        (p) => p.category === category
      )
    }

    // Sorting
    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price)
    }

    if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, search, category, sort])

  const resetFilters = () => {
    setSearch("")
    setCategory("all")
    setSort("default")
  }

  return (
    <div className="max-w-[1400px] mx-auto px-8 py-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">

        <h1 className="text-3xl font-semibold">
          All Products ({filteredProducts.length})
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded-md w-full sm:w-[250px]"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-4 py-2 rounded-md"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all"
                  ? "All Categories"
                  : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) =>
              setSort(
                e.target.value as
                  | "default"
                  | "low"
                  | "high"
              )
            }
            className="border px-4 py-2 rounded-md"
          >
            <option value="default">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="border px-4 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Reset
          </button>

        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24">

          <p className="text-gray-500 text-lg mb-4">
            No products found
          </p>

          <button
            onClick={resetFilters}
            className="border px-6 py-2 rounded-md hover:bg-gray-100 transition"
          >
            Clear Filters
          </button>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  )
}