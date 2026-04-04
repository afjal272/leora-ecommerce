"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/product/product-card"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images: string[]   // ✅ important
  description?: string
  category?: string
  stock?: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const urlSearch = searchParams.get("search") || ""

  const [search, setSearch] = useState(urlSearch)
  const [category, setCategory] = useState("all")
  const [sort, setSort] = useState<"default" | "low" | "high">("default")

  // ✅ FETCH
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products")
        const data = await res.json()

        const safeData: Product[] = (data.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          images: p.images || [p.image], // ✅ FIX
          description: p.description,
          category: p.category || "uncategorized",
          stock: p.stock || 0,
        }))

        setProducts(safeData)
      } catch (err) {
        console.error("Fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    setSearch(urlSearch)
  }, [urlSearch])

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category || "uncategorized"))
    return ["all", ...Array.from(unique)]
  }, [products])

  const filteredProducts = useMemo(() => {
    let result: Product[] = [...products]

    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query)
      )
    }

    if (category !== "all") {
      result = result.filter((p) => p.category === category)
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price)
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, search, category, sort])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-20">

      <h1 className="text-2xl md:text-3xl font-semibold mb-10">
        All Products ({filteredProducts.length})
      </h1>

      {filteredProducts.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No products found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  )
}