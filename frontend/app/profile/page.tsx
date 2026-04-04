"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"
import { useAddressStore } from "@/store/address.store"
import { useOrderStore } from "@/store/order.store"

type TabType = "dashboard" | "orders" | "addresses" | "settings"

/* ===============================
   Account Settings Component
================================= */
function AccountSettings() {
  const { user, updateName } = useAuthStore()

  const name = user?.name || ""

  const [newName, setNewName] = useState(name)
  const [saved, setSaved] = useState(false)

  // 🔥 sync jab user change ho
  useEffect(() => {
    setNewName(user?.name || "")
  }, [user])

  const handleSave = () => {
    if (!newName.trim()) return

    updateName(newName)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-[500px]">
      <h2 className="text-2xl font-semibold mb-8">
        Account Settings
      </h2>

      <div className="space-y-6">

        <div>
          <label className="text-sm font-medium">
            Email Address
          </label>
          <input
            type="text"
            value={user?.email || user?.mobile || ""}
            disabled
            className="w-full border rounded-lg px-4 py-3 mt-2 bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Display Name
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 mt-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Save Changes
        </button>

        {saved && (
          <p className="text-green-600 text-sm">
            Profile updated successfully
          </p>
        )}

      </div>
    </div>
  )
}

/* ===============================
   Addresses Section
================================= */
function AddressesSection() {
  const {
    addresses,
    addAddress,
    deleteAddress,
    updateAddress,
  } = useAddressStore()

  const [editingId, setEditingId] = useState<string | null>(null)

  const emptyForm = {
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  }

  const [form, setForm] = useState(emptyForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.fullName || !form.phone || !form.addressLine) return

    if (editingId) {
      updateAddress(editingId, {
        ...form,
        id: editingId,
      })
      setEditingId(null)
    } else {
      addAddress({
        ...form,
        id: Date.now().toString(),
      })
    }

    setForm(emptyForm)
  }

  const handleEdit = (addr: any) => {
    setForm(addr)
    setEditingId(addr.id)
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-8">
        Saved Addresses
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid sm:grid-cols-2 gap-4 mb-12"
      >
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={(form as any)[key]}
            onChange={handleChange}
            placeholder={key}
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
          />
        ))}

        <button
          type="submit"
          className="col-span-2 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          {editingId ? "Update Address" : "Add Address"}
        </button>
      </form>

      {addresses.length === 0 && (
        <p className="text-gray-500 text-sm">
          No saved addresses.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-xl p-6 relative hover:shadow-md transition"
          >
            <p className="font-semibold mb-1">
              {addr.fullName}
            </p>
            <p className="text-sm text-gray-600">
              {addr.phone}
            </p>
            <p className="text-sm mt-2">
              {addr.addressLine}, {addr.city},{" "}
              {addr.state} - {addr.pincode}
            </p>

            <div className="absolute top-4 right-4 flex gap-4 text-sm">
              <button
                onClick={() => handleEdit(addr)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>

              <button
                onClick={() => deleteAddress(addr.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===============================
   Profile Page
================================= */
export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const { orders } = useOrderStore()
  const router = useRouter()

  const [activeTab, setActiveTab] =
    useState<TabType>("dashboard")

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  if (!user) return null

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-20">

      <h1 className="text-3xl font-semibold mb-12">
        My Account
      </h1>

      <div className="grid md:grid-cols-4 gap-12">

        <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit">
          <div className="space-y-3 text-sm font-medium">

            <button onClick={() => setActiveTab("dashboard")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Dashboard
            </button>

            <button onClick={() => setActiveTab("orders")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Orders
            </button>

            <button onClick={() => setActiveTab("addresses")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Saved Addresses
            </button>

            <button onClick={() => setActiveTab("settings")} className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100">
              Account Settings
            </button>

            <hr className="my-4" />

            <button
              onClick={() => {
                logout()
                router.push("/")
              }}
              className="text-red-500 hover:underline text-sm"
            >
              Logout
            </button>

          </div>
        </div>

        <div className="md:col-span-3 bg-white border rounded-2xl p-10 shadow-sm">

          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-2">
                Logged in as:
              </p>
              <p className="font-medium text-lg">
               {user?.name || "User"}
              </p>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-semibold mb-8">
                Order History
              </h2>

              {orders.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No orders yet.
                </p>
              )}

              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-xl p-6">

                    <div className="flex justify-between mb-4 items-center">
                      <div>
                        <p className="font-semibold">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <p className="font-semibold text-lg">
                        ₹{order.total}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                      Delivered to: {order.address.fullName},{" "}
                      {order.address.city}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "addresses" && <AddressesSection />}
          {activeTab === "settings" && <AccountSettings />}

        </div>

      </div>
    </div>
  )
}