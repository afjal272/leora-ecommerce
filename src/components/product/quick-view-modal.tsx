"use client"

import { useState } from "react"
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

  const [image, setImage] = useState(product.images[0])

  if (!open) return null

  const handleAddToCart = () => {
    addToCart(product.id)
    openCart()
    onClose()
  }

  return (

    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">

      <div className="bg-white rounded-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* IMAGE */}
        <div className="bg-gray-100 flex items-center justify-center p-8">

          <img
            src={image}
            alt={product.name}
            className="max-h-[400px] object-contain"
          />

        </div>

        {/* INFO */}
        <div className="p-8 relative">

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-semibold">
            {product.name}
          </h2>

          <p className="text-gray-500 mt-2">
            {product.category}
          </p>

          <p className="text-xl font-semibold mt-4">
            ₹{product.price}
          </p>

          <p className="mt-4 text-gray-600 text-sm">
            {product.description}
          </p>

          {/* VARIANTS */}
          {product.variants && product.variants.length > 0 && (

            <div className="mt-6">

              <p className="text-sm font-medium mb-2">
                Select Color
              </p>

              <div className="flex gap-3">

                {product.variants.map((variant) => (

                  <button
                    key={variant.color}
                    onClick={() => setImage(variant.image)}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: variant.color }}
                  />

                ))}

              </div>

            </div>

          )}

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="mt-8 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>

  )
}