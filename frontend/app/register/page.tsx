"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/auth.store"

export default function RegisterPage() {
  const { login } = useAuthStore()
  const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validate = () => {
    let newErrors: Record<string, string> = {}

    if (!form.name.trim())
      newErrors.name = "Name is required"

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter valid email"

    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters"

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // ✅ FIXED (fake login properly)
    login(
      {
        id: "temp-id",
        name: form.name || form.email,
        email: form.email,
      },
      "dummy-token"
    )

    router.push("/")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md border rounded-xl p-8 shadow-sm bg-white">

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">

          <div>
            <label className="text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg mt-2 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg mt-2 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className={`w-full border px-4 py-3 rounded-lg mt-2 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Register
          </button>

        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}