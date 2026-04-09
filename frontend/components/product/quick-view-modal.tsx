"use client"

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

import { Product } from "@/types/product.types"
import { useCartStore } from "@/store/cart.store"
import { useCartUIStore } from "@/store/cart-ui.store"

interface Props {
  product: Product
  open: boolean
  onClose: () => void
}

export default function QuickViewModal({ product, open, onClose }: Props) {

  const addToCart = useCartStore((state) => state.addToCart)
  const openCart = useCartUIStore((state) => state.openCart)

  // ✅ NEW: IMAGE BASE URL
  const IMAGE_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {

    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }

  }, [open])

  if (!open) return null

  // ✅ FIXED IMAGE URL LOGIC
  const resolvedImage =
    product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${IMAGE_BASE}/${product.image}`
      : product.images?.[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${IMAGE_BASE}/${product.images[0]}`
      : "/placeholder.png"

  const handleAddToCart = () => {
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
    onClose()
  }

  return createPortal(

    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative bg-white rounded-xl max-w-5xl w-full mx-6 grid md:grid-cols-2 overflow-hidden shadow-2xl">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <div className="bg-gray-100">

          {/* ❌ OLD (kept)
          <img
            src={product.image || product.images?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          */}

          {/* ✅ NEW FIXED */}
          <img
            src={resolvedImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />

        </div>

        <div className="p-8 flex flex-col justify-center">

          <h2 className="text-2xl font-semibold mb-3">
            {product.name}
          </h2>

          <p className="text-xl font-semibold mb-4">
            ₹{product.price}
          </p>

          <p className="text-gray-600 text-sm mb-6">
            {product.description || "No description"}
          </p>

          {product.variants && product.variants.length > 0 && (

            <div className="mb-6">

              <p className="text-sm mb-2 font-medium">
                Select Color
              </p>

              <div className="flex gap-2">

                {product.variants.map((variant) => (

                  <div
                    key={variant.color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: variant.color }}
                  />

                ))}

              </div>

            </div>

          )}

          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>,

    document.body

  )
}