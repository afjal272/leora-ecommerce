"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

import { useCartStore } from "@/store/cart.store"
import ProductCard from "@/components/product/product-card"
import ProductGallery from "@/components/product/product-gallery"

// ❌ OLD LOCAL TYPE (conflict create karta hai)
type Product = {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  image: string
  images?: string[]
  stock?: number
}

// ✅ NEW GLOBAL TYPE (single source of truth)
import { Product as GlobalProduct } from "@/types/product.types"

export default function ProductDetailPage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [product, setProduct] = useState<GlobalProduct | null>(null)
  const [related, setRelated] = useState<GlobalProduct[]>([])

  const [loading, setLoading] = useState(true)

  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    const fetchProduct = async () => {
      try {

        // ✅ FIXED (correct backend URL)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${slug}`
        )

        if (!res.ok) throw new Error("Fetch failed")

        const data = await res.json()

        if (data.success) {

          // ✅ SAFE PRODUCT
          const safeProduct: GlobalProduct = {
            ...data.data,
            slug: data.data.slug || data.data.id
          }

          // ✅ SAFE RELATED
          const safeRelated: GlobalProduct[] = (data.related || []).map((p: any) => ({
            ...p,
            slug: p.slug || p.id
          }))

          setProduct(safeProduct)
          setRelated(safeRelated)
        }

      } catch (err) {
        console.error("Product fetch error:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!product) {
    return (
      <div className="py-32 text-center">
        Product not found
      </div>
    )
  }

  const outOfStock = !product.stock || product.stock <= 0

  return (
    <section className="bg-[#F5F5F2] py-10 md:py-20 px-4 md:px-6">

      <div className="max-w-[1200px] mx-auto">

        <div className="grid md:grid-cols-2 gap-10">

          <ProductGallery
            images={
              product.images?.length
                ? product.images
                : [product.image || "/placeholder.png"]
            }
            name={product.name}
          />

          <div>

            <h1 className="text-2xl font-semibold">
              {product.name}
            </h1>

            <p className="text-xl mt-2">
              ₹{product.price}
            </p>

            <p className="mt-4 text-gray-600">
              {product.description || "No description"}
            </p>

            <button
              disabled={outOfStock}
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image:
                    product.image ||
                    product.images?.[0] ||
                    "/placeholder.png",
                })
              }
              className="mt-6 bg-black text-white px-6 py-3 rounded disabled:opacity-50"
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="mt-6">
              <Link href="/products">← Back</Link>
            </div>

          </div>

        </div>

        {related.length > 0 && (
          <div className="mt-16">

            <h2 className="text-xl font-semibold mb-6">
              Related Products
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

          </div>
        )}

      </div>

    </section>
  )
}