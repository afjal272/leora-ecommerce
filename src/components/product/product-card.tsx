"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"

import QuickViewModal from "@/components/product/quick-view-modal"

import { Product } from "@/types/product.types"
import { useCartStore } from "@/store/cart.store"
import { useCartUIStore } from "@/store/cart-ui.store"
import { useWishlistStore } from "@/store/wishlist.store"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {

  const addToCart = useCartStore((state) => state.addToCart)
  const openCart = useCartUIStore((state) => state.openCart)

  const { items, toggleWishlist } = useWishlistStore()
  const isWishlisted = items.includes(product.id)

  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const rect = e.currentTarget.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product.id)
    openCart()
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  const mainImage = previewImage || images[0]
  const hoverImage = previewImage ? previewImage : images[1]

  return (

    <>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">

        {/* IMAGE */}
        <Link
          href={`/products/${product.slug}`}
          className="block"
        >

          <div
            onMouseMove={handleMouseMove}
            className="relative bg-gray-100 aspect-[3/4] w-full overflow-hidden"
          >

            <img
              src={mainImage}
              alt={product.name}
              className="absolute w-full h-full object-cover transition duration-500 md:group-hover:scale-110"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`
              }}
            />

            {hoverImage && (
              <img
                src={hoverImage}
                alt={product.name}
                className="absolute w-full h-full object-cover opacity-0 transition duration-500 md:group-hover:opacity-100 md:group-hover:scale-110"
                style={{
                  transformOrigin: `${position.x}% ${position.y}%`
                }}
              />
            )}

            {/* ACTION ICONS */}
            <div className="absolute right-2 top-2 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition">

              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleWishlist(product.id)
                }}
                className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <Heart
                  size={16}
                  className={
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600"
                  }
                />
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault()
                  setQuickViewOpen(true)
                }}
                className="bg-white p-2 rounded-full shadow hover:scale-110 transition"
              >
                <Eye size={16} />
              </button>

            </div>

            {/* ADD TO CART */}
           <div className="hidden md:block absolute bottom-3 left-0 w-full px-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">

              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black py-2 rounded-full text-xs md:text-sm font-medium hover:bg-black hover:text-white transition shadow"
              >
                Add to cart
              </button>

            </div>

          </div>

        </Link>

        {/* PRODUCT INFO */}
        <div className="pt-2 pb-3 px-2.5 md:px-3">

          <h3 className="text-xs md:text-sm font-medium text-gray-900 hover:text-black transition line-clamp-2">
            {product.name}
          </h3>

          <p className="text-[11px] text-gray-500 mt-0.5">
            {product.category}
          </p>

          {product.variants && product.variants.length > 0 && (

            <div className="flex gap-1.5 mt-1.5">

              {product.variants.map((variant) => (

                <button
                  key={variant.color}
                  onMouseEnter={() => setPreviewImage(variant.image)}
                  onMouseLeave={() => setPreviewImage(null)}
                  className="w-3.5 h-3.5 rounded-full border border-gray-300 hover:scale-110 transition"
                  style={{ backgroundColor: variant.color }}
                />

              ))}

            </div>

          )}

          <p className="mt-1 font-semibold text-black text-xs md:text-sm">
            ₹{product.price}
          </p>

        </div>

      </div>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  )
}