"use client" 

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-semibold mb-4">
          Order Placed Successfully
        </h1>
        {orderId && (
          <p className="text-gray-600 mb-4">
            Order ID: <span className="font-semibold">{orderId}</span>
          </p>
        )}
        <p className="text-gray-600 mb-8">
          Thank you for shopping with LEORA.
          Your order is being processed.
        </p>
        <Link
          href="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}