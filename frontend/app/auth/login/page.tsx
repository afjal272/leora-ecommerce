"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const [mobile, setMobile] = useState("")
  const router = useRouter()

  const handleSendOTP = () => {

    if (mobile.length !== 10) {
      alert("Enter valid mobile number")
      return
    }

    router.push(`/auth/otp?mobile=${mobile}`)
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-semibold mb-2 text-center">
          Login / Signup
        </h1>

        <p className="text-gray-500 text-sm text-center mb-8">
          Enter your mobile number to continue
        </p>

        {/* Mobile Input */}

        <div className="flex items-center border rounded-lg overflow-hidden">

          <span className="px-4 text-gray-500">
            +91
          </span>

          <input
            type="tel"
            placeholder="Enter mobile number"
            className="flex-1 p-3 outline-none"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

        </div>

        {/* Button */}

        <button
          onClick={handleSendOTP}
          className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Send OTP
        </button>

      </div>

    </div>
  )
}