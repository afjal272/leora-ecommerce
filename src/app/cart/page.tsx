"use client"

import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/store/cart.store"
import { useProductStore } from "@/store/product.store"
import { Trash2 } from "lucide-react"

export default function CartPage() {

  const {
    items,
    increaseQty,
    decreaseQty,
    removeFromCart,
    getTotal,
  } = useCartStore()

  const { products } = useProductStore()

  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id)

      if (!product) return null

      return {
        ...product,
        quantity: item.quantity,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto px-8 py-32 text-center">

        <h1 className="text-3xl font-semibold mb-6">
          Your Cart is Empty
        </h1>

        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Continue Shopping
        </Link>

      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-20">

      <h1 className="text-3xl font-semibold mb-12">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-12">

        {/* CART ITEMS */}

        <div className="lg:col-span-2 space-y-6">

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex justify-between items-center border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition"
            >

              <div className="flex gap-6">

                {/* IMAGE */}

                <div className="relative w-24 h-24 rounded-lg overflow-hidden">

                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />

                </div>

                {/* INFO */}

                <div>

                  <h2 className="font-medium text-lg">
                    {item.name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    ₹{item.price}
                  </p>

                  {/* QUANTITY */}

                  <div className="flex items-center gap-3 mt-4">

                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 transition"
                    >
                      −
                    </button>

                    <span className="w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 border rounded-md hover:bg-gray-100 transition"
                    >
                      +
                    </button>

                    {/* REMOVE */}

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-4 text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>

              </div>

              {/* PRICE */}

              <div className="font-semibold text-lg">
                ₹{item.price * item.quantity}
              </div>

            </div>

          ))}

        </div>

        {/* ORDER SUMMARY */}

        <div className="border rounded-xl p-8 shadow-sm bg-white h-fit sticky top-24">

          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>₹{getTotal()}</span>
          </div>

          <div className="flex justify-between mb-6">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <hr className="mb-6" />

          <div className="flex justify-between font-semibold text-lg mb-8">
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>

          <Link
            href="/checkout"
            className="block text-center bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>

    </div>
  )
}