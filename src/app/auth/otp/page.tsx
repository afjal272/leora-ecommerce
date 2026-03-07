"use client"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OTPPage() {

  const router = useRouter()
  const params = useSearchParams()

  const mobile = params.get("mobile")

  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (value: string, index: number) => {

    if (!/^[0-9]?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const handleVerify = () => {

    const code = otp.join("")

    if (code.length !== 6) return

    router.push("/")
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-semibold text-center mb-2">
          Enter OTP
        </h1>

        <p className="text-gray-500 text-sm text-center mb-8">
          OTP sent to +91 {mobile}
        </p>

        {/* OTP Inputs */}

        <div className="flex justify-between gap-2 mb-6">

          {otp.map((digit, index) => (

            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />

          ))}

        </div>

        {/* Verify Button */}

        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Verify OTP
        </button>

        {/* Extra Actions */}

        <div className="text-center mt-6 text-sm text-gray-500">

          <button
            onClick={() => router.push("/auth/login")}
            className="hover:text-black"
          >
            Change mobile number
          </button>

          <p className="mt-2">
            Didn’t receive OTP?{" "}
            <button className="text-black font-medium">
              Resend
            </button>
          </p>

        </div>

      </div>

    </div>
  )
}