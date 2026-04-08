"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import { useAddressStore } from "@/store/address.store"
import { useProductStore } from "@/store/product.store"
import { OrderItem } from "@/store/order.store"

const generateOrderId = () => {
  return "LEO-" + Math.floor(100000 + Math.random() * 900000)
}

type AddressForm = {
  fullName: string
  phone: string
  addressLine: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {

  const { items, getTotal, clearCart } = useCartStore()
  const { products } = useProductStore() // ⭐ no reduceStock now
  const { user } = useAuthStore()
  const { addresses, addAddress } = useAddressStore()

  const router = useRouter()

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const emptyForm: AddressForm = {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  }

  const [form, setForm] = useState<AddressForm>(emptyForm)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) return null

  const checkoutItems: OrderItem[] = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id)
      if (!product) return null

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      }
    })
    .filter((item): item is OrderItem => item !== null)

  if (checkoutItems.length === 0) {
    return (
      <div className="max-w-[900px] mx-auto py-32 text-center">
        <h1 className="text-3xl font-semibold mb-6">
          No items to checkout
        </h1>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

   if (!user?.id) {
  alert("User not logged in")
  return
}

  // 🔥 FINAL ORDER FUNCTION (BACKEND INTEGRATED)
  const handlePlaceOrder = async () => {
    try {
      setLoading(true)

      let selectedAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      )

      if (!selectedAddress && !form.fullName) return

      if (!selectedAddress) {
        selectedAddress = {
          ...form,
          id: crypto.randomUUID(),
        }

        addAddress(selectedAddress)
      }

      // 🔥 API CALL
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          items: checkoutItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          total: getTotal(),
        }),
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.message || "Order failed")
        return
      }

      // ✅ SUCCESS FLOW (same UX)
      const orderId = data.data.id || generateOrderId()

      clearCart()

      router.push(`/order-success?orderId=${orderId}`)

    } catch (error) {
      console.error(error)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20">

      <h1 className="text-3xl font-semibold mb-12">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-2 gap-16">

        {/* LEFT */}
        <div className="space-y-10">

          {addresses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Select Address
              </h2>

              <div className="space-y-4">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`border rounded-lg p-4 block cursor-pointer ${
                      selectedAddressId === addr.id
                        ? "border-black"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="mr-3"
                      onChange={() => setSelectedAddressId(addr.id)}
                    />

                    <span className="font-medium">
                      {addr.fullName}
                    </span>

                    <p className="text-sm text-gray-600">
                      {addr.addressLine}, {addr.city}
                    </p>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold mb-6">
              Add New Address
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {(Object.keys(form) as (keyof AddressForm)[]).map((key) => (
                <input
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={key}
                  className="border rounded-lg px-4 py-2"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-8 shadow-sm bg-white h-fit">

          <h2 className="text-xl font-semibold mb-6">
            Order Summary
          </h2>

          {checkoutItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm mb-4"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}

          <hr className="my-6" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>

        </div>

      </div>
    </div>
  )
}