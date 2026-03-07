"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useCartStore } from "@/store/cart.store"
import { useProductStore } from "@/store/product.store"

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {

  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getTotal,
  } = useCartStore()

  const { products } = useProductStore()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fix hydration mismatch
  if (!mounted) return null

  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id)

      if (!product) return null

      return {
        ...product,
        quantity: item.quantity,
      }
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null
    )

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-xl z-50
        transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-semibold">
            Your Cart
          </h2>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col h-full">

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {cartItems.length === 0 && (
              <p className="text-gray-500">
                Your cart is empty
              </p>
            )}

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4"
              >

                {/* Image */}
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">

                  <h3 className="text-sm font-medium">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ₹{item.price}
                  </p>

                  <div className="flex items-center gap-3 mt-2">

                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="px-2 border rounded"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="px-2 border rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-xs ml-2"
                    >
                      Remove
                    </button>

                  </div>
                </div>

                {/* Item Price */}
                <div className="text-sm font-medium">
                  ₹{item.price * item.quantity}
                </div>

              </div>
            ))}

          </div>

          {/* Footer */}
          <div className="border-t p-6 space-y-4">

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>₹{getTotal()}</span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center border py-3 rounded-lg hover:bg-gray-50 transition"
            >
              View Cart
            </Link>

            <Link
              href="/checkout"
              onClick={onClose}
              className="block text-center bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Checkout
            </Link>

          </div>

        </div>

      </div>
    </>
  )
}