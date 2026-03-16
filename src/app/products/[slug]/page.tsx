"use client"

import { useParams } from "next/navigation"
import { useProductStore } from "@/store/product.store"
import { useStore } from "@/hooks/useStore"
import { useCartStore } from "@/store/cart.store"
import { useState } from "react"
import Link from "next/link"
import ProductCard from "@/components/product/product-card"
import ProductGallery from "@/components/product/product-gallery"

export default function ProductDetailPage() {

  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const _products = useStore(useProductStore, (state) => state.products)
  const products = _products || []
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

    <section className="bg-[#F5F5F2] py-10 md:py-20 px-4 md:px-6">

      <div className="max-w-[1200px] mx-auto">

        {/* PRODUCT SECTION */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 items-start">

          {/* GALLERY */}

          <div className="order-1">
            <ProductGallery
              images={
                product.images && product.images.length > 0
                  ? product.images
                  : [product.image]
              }
              name={product.name}
            />
          </div>

          {/* PRODUCT INFO */}

          <div className="order-2 mt-6 md:mt-0">

            <p className="text-xs uppercase tracking-widest text-[#D9A441] mb-2">
              {product.category}
            </p>

            <h1 className="text-xl md:text-3xl font-semibold text-[#0B332E] mb-3 leading-tight">
              {product.name}
            </h1>

            <p className="text-lg md:text-2xl font-semibold text-black mb-4">
              ₹{product.price}
            </p>

            <div className="h-[2px] w-12 bg-[#D9A441] mb-6"></div>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* STOCK */}

            <p
              className={`mb-4 text-sm font-medium ${
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

              <div className="flex items-center gap-4 mb-6">

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
              className={`w-full md:w-auto px-8 py-3 rounded-full text-sm font-medium transition ${
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

            <div className="mt-6">

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

          <div className="mt-14 md:mt-24">

            <h2 className="text-lg md:text-2xl font-semibold mb-6 md:mb-8">
              You may also like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">

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