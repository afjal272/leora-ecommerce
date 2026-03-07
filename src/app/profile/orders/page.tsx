"use client"

import Link from "next/link"
import { useAuthStore } from "@/store/auth.store"
import { useOrderStore } from "@/store/order.store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OrdersPage() {
  const { user } = useAuthStore()
  const { orders } = useOrderStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null

  if (orders.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto py-32 text-center">
        <h1 className="text-3xl font-semibold mb-6">
          No Orders Yet
        </h1>

        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-20">

      <h1 className="text-3xl font-semibold mb-12">
        Your Orders
      </h1>

      <div className="space-y-8">

        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl p-6 shadow-sm"
          >

            <div className="flex justify-between mb-4">
              <div>
                <p className="font-medium">
                  Order ID: {order.id}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <p className="font-semibold">
                ₹{order.total}
              </p>
            </div>

            <div className="space-y-2 text-sm">

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>

                  <span>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}