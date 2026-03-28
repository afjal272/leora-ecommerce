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

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.image ||
        product.images?.[0] ||
        "/placeholder.png",
    })

    openCart()
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : []

  const mainImage = previewImage || images[0] || "/placeholder.png"

  const hoverImage =
    !previewImage && images.length > 1
      ? images[1]
      : null

  return (
    <>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">

        <Link
          href={`/products/${product.slug || product.id}`}
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

            <div className="absolute right-2 top-2 flex flex-col gap-2 md:opacity-0 md:group-hover:opacity-100 transition">

              <button
                onClick={(e) => {
                  e.preventDefault()
                  toggleWishlist(product.id)
                }}
                className="bg-white p-2 rounded-full shadow"
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
                className="bg-white p-2 rounded-full shadow"
              >
                <Eye size={16} />
              </button>

            </div>

            <div className="absolute bottom-3 left-0 w-full px-3 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-black py-2 rounded-full text-xs font-medium hover:bg-black hover:text-white transition"
              >
                Add to cart
              </button>
            </div>

          </div>
        </Link>

        <div className="pt-2 pb-3 px-3">
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.category}</p>
          <p className="mt-1 font-semibold">₹{product.price}</p>
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