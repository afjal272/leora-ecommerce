"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [requireOTP, setRequireOTP] = useState(false)

  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  // =======================
  // USER OTP FLOW (UNCHANGED)
  // =======================
  const handleSendOTP = () => {

    if (mobile.length !== 10) {
      alert("Enter valid mobile number")
      return
    }

    router.push(`/auth/otp?mobile=${mobile}`)
  }

  // =======================
  // ADMIN LOGIN STEP 1
  // =======================
  const handleAdminLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      // 🔥 ADMIN OTP REQUIRED
      if (data.requireOTP) {
        setRequireOTP(true)
        alert("OTP sent to your email")
        return
      }

      if (data.success) {
        localStorage.setItem("token", data.data.token)
        router.push("/")
      } else {
        alert(data.message)
      }

    } catch (err) {
      alert("Login failed")
    }
  }

  // =======================
  // ADMIN LOGIN STEP 2 (OTP)
  // =======================
  const handleVerifyOTP = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          otp,
        }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("token", data.data.token)
        router.push("/")
      } else {
        alert(data.message)
      }

    } catch (err) {
      alert("OTP verification failed")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Login / Signup
        </h1>

        {/* 🔥 SWITCH */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsAdmin(false)
              setRequireOTP(false)
            }}
            className={!isAdmin ? "font-semibold" : "text-gray-400"}
          >
            User
          </button>

          <button
            onClick={() => setIsAdmin(true)}
            className={isAdmin ? "font-semibold" : "text-gray-400"}
          >
            Admin
          </button>
        </div>

        {/* ================= USER ================= */}
        {!isAdmin && (
          <>
            <p className="text-gray-500 text-sm text-center mb-8">
              Enter your mobile number to continue
            </p>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <span className="px-4 text-gray-500">+91</span>
              <input
                type="tel"
                placeholder="Enter mobile number"
                className="flex-1 p-3 outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOTP}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {/* ================= ADMIN ================= */}
        {isAdmin && !requireOTP && (
          <>
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full border p-3 rounded-lg mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border p-3 rounded-lg mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleAdminLogin}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Login as Admin
            </button>
          </>
        )}

        {/* ================= ADMIN OTP ================= */}
        {isAdmin && requireOTP && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-3 rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOTP}
              className="w-full bg-black text-white py-3 rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}

      </div>

    </div>
  )
}