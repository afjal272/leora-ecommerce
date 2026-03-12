"use client"

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

  if (!open) return null

  const handleAddToCart = () => {
    addToCart(product.id)
    openCart()
    onClose()
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">

      <div className="relative bg-white w-[900px] max-w-full rounded-xl grid md:grid-cols-2 overflow-hidden">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* IMAGE */}
        <div className="bg-gray-100 flex items-center justify-center p-8">

          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="max-h-[420px] object-contain"
          />

        </div>

        {/* INFO */}
        <div className="p-8 flex flex-col">

          <h2 className="text-2xl font-semibold">
            {product.name}
          </h2>

          <p className="text-xl font-bold mt-3">
            ₹{product.price}
          </p>

          <p className="text-gray-600 text-sm mt-4">
            {product.description}
          </p>

          {/* COLOR VARIANTS */}
          {product.variants && product.variants.length > 0 && (

            <div className="mt-6">

              <p className="text-sm font-medium mb-2">
                Select Color
              </p>

              <div className="flex gap-3">

                {product.variants.map((v) => (

                  <div
                    key={v.color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: v.color }}
                  />

                ))}

              </div>

            </div>

          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-8 bg-black text-white py-3 rounded-full hover:bg-gray-900 transition"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  )
}