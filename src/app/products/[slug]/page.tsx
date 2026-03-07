"use client"

import { useParams } from "next/navigation"
import { useProductStore } from "@/store/product.store"
import { useCartStore } from "@/store/cart.store"
import { useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/product/product-card"
import ProductGallery from "@/components/product/product-gallery"

export default function ProductDetailPage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const { products } = useProductStore()
  const addToCart = useCartStore((state) => state.addToCart)

  const product = products.find((p) => p.slug === slug)

  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="py-32 text-center text-gray-500">
        Product not found
      </div>
    )
  }

  const outOfStock = product.stock === 0

  const handleAddToCart = () => {
    addToCart(product.id)
  }

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4)

  return (
    <section className="bg-[#F5F5F2] py-24 px-6">

      <div className="max-w-[1200px] mx-auto">

        {/* PRODUCT SECTION */}

        <div className="grid md:grid-cols-2 gap-20 items-start">

          {/* LEFT SIDE - GALLERY */}

          <ProductGallery
            images={
              product.images && product.images.length > 0
                ? product.images
                : [product.image]
            }
            name={product.name}
          />

          {/* RIGHT SIDE */}

          <div>

            <p className="text-xs uppercase tracking-widest text-[#D9A441] mb-4">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#0B332E] mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-black mb-6">
              ₹{product.price}
            </p>

            <div className="h-[2px] w-16 bg-[#D9A441] mb-8"></div>

            <p className="text-gray-600 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* STOCK STATUS */}

            <p
              className={`mb-6 text-sm font-medium ${
                outOfStock
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {outOfStock
                ? "Out of Stock"
                : `In Stock (${product.stock})`}
            </p>

            {/* QUANTITY */}

            {!outOfStock && (

              <div className="flex items-center gap-4 mb-8">

                <span className="text-sm text-gray-600">
                  Quantity
                </span>

                <div className="flex items-center border rounded-lg overflow-hidden">

                  <button
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    className="px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    −
                  </button>

                  <span className="px-5 py-2 text-sm">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(product.stock, q + 1)
                      )
                    }
                    className="px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    +
                  </button>

                </div>

              </div>

            )}

            {/* ADD TO CART */}

            <button
              disabled={outOfStock}
              onClick={handleAddToCart}
              className={`w-full py-4 rounded-lg text-sm font-medium transition ${
                outOfStock
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#0B332E] text-white hover:bg-black"
              }`}
            >
              {outOfStock
                ? "Unavailable"
                : "Add to Cart"}
            </button>

            {/* BACK */}

            <div className="mt-8">

              <Link
                href="/products"
                className="text-sm text-gray-600 hover:text-black transition"
              >
                ← Back to Products
              </Link>

            </div>

          </div>

        </div>

        {/* RELATED PRODUCTS */}

        {relatedProducts.length > 0 && (

          <div className="mt-24">

            <h2 className="text-2xl font-semibold mb-10">
              You may also like
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

              {relatedProducts.map((item) => (

                <ProductCard
                  key={item.id}
                  product={item}
                />

              ))}

            </div>

          </div>

        )}

      </div>

    </section>
  )
}