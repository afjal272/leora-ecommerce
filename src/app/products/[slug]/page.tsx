"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cart.store"
import Link from "next/link"
import ProductCard from "@/components/product/product-card"
import ProductGallery from "@/components/product/product-gallery"

export default function ProductDetailPage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const [product, setProduct] = useState<any>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const addToCart = useCartStore((state) => state.addToCart)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${slug}`)
        const data = await res.json()

        setProduct(data.data)
        setRelated(data.related || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) return <div className="text-center py-20">Loading...</div>

  if (!product) {
    return <div className="py-32 text-center">Product not found</div>
  }

  const outOfStock = product.stock === 0

  return (
    <section className="bg-[#F5F5F2] py-10 md:py-20 px-4 md:px-6">

      <div className="max-w-[1200px] mx-auto">

        <div className="grid md:grid-cols-2 gap-10">

          <ProductGallery
            images={[product.image]}
            name={product.title}
          />

          <div>

            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="text-xl mt-2">₹{product.price}</p>

            <p className="mt-4 text-gray-600">
              {product.description}
            </p>

            <button
              disabled={outOfStock}
              onClick={() => addToCart(product.id)}
              className="mt-6 bg-black text-white px-6 py-3 rounded"
            >
              Add to Cart
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