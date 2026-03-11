"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart } from "lucide-react"

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

  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {

    const rect = e.currentTarget.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
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
    
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">

      {/* IMAGE AREA */}
      <div
        onMouseMove={handleMouseMove}
        className="relative bg-gray-100 aspect-[4/5] w-full overflow-hidden"
      >

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 z-20 bg-white shadow-sm p-2 rounded-full transition transform hover:scale-110"
        >
          <Heart
            size={16}
            className={
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-500"
            }
          />
        </button>

        <Link
          href={`/products/${product.slug}`}
          className="block w-full h-full"
        >

          {/* MAIN IMAGE */}
          <img
            src={mainImage}
            alt={product.name}
            className="absolute w-full h-full object-cover transform-gpu transition duration-500 group-hover:scale-110"
            style={{
              transformOrigin: `${position.x}% ${position.y}%`
            }}
          />

          {/* HOVER IMAGE */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.name}
              className="absolute w-full h-full object-cover opacity-0 transform-gpu transition duration-500 group-hover:opacity-100 group-hover:scale-110"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`
              }}
            />
          )}

        </Link>

        {/* QUICK VIEW BUTTON */}
        <div className="absolute bottom-16 left-0 w-full px-5 opacity-0 group-hover:opacity-100 transition">

          <button
            onClick={() => setQuickViewOpen(true)}
            className="w-full bg-white text-black py-2 rounded-full text-sm font-medium shadow hover:bg-black hover:text-white transition"
          >
            Quick View
          </button>

        </div>

        {/* ADD TO CART */}
        <div className="absolute bottom-5 left-0 w-full px-5 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">

          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-3 rounded-full text-sm font-medium hover:bg-black hover:text-white transition pointer-events-auto shadow-sm"
          >
            Add to cart
          </button>

        </div>

      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 pb-5 px-3">

        <h3 className="text-sm font-medium text-gray-900 hover:text-black transition">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mt-1">
          {product.category}
        </p>

        {/* VARIANT PREVIEW */}
        {product.variants && product.variants.length > 0 && (

          <div className="flex gap-2 mt-3">

            {product.variants.map((variant) => (

              <button
                key={variant.color}
                onMouseEnter={() => setPreviewImage(variant.image)}
                onMouseLeave={() => setPreviewImage(null)}
                className="w-4 h-4 rounded-full border border-gray-300 hover:scale-110 transition"
                style={{ backgroundColor: variant.color }}
              />

            ))}

          </div>

        )}

        <p className="mt-2 font-semibold text-black">
          ₹{product.price}
        </p>

      </div>

    </div>

    {/* QUICK VIEW MODAL */}
    <QuickViewModal
      product={product}
      open={quickViewOpen}
      onClose={() => setQuickViewOpen(false)}
    />

    </>
  )
}