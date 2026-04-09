"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export default function OTPContent() {

  const router = useRouter()
  const params = useSearchParams()
  const mobile = params.get("mobile")

  const setAuth = useAuthStore((state) => state.setAuth)

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(30)
  const [loading, setLoading] = useState(false)

  const inputs = useRef<(HTMLInputElement | null)[]>([])

  // 🔥 TIMER
  useEffect(() => {
    if (timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

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

  // 🔥 VERIFY OTP (FINAL STABLE)
  const handleVerify = async () => {

    const code = otp.join("")

    if (code.length !== 6) {
      alert("Enter complete OTP")
      return
    }

    if (!mobile) {
      alert("Mobile missing")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          otp: code,
        }),
      })

      const data = await res.json()

      console.log("LOGIN RESPONSE:", data)

      if (!data || !data.success || !data.data) {
        alert(data?.message || "Login failed")
        return
      }

      const user = data.data.user
      const token = data.data.token

      if (!user || !token) {
        alert("Invalid login response")
        return
      }

      // ✅ STORE
      setAuth({ user, token })
      localStorage.setItem("token", token)

      router.push("/")

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 RESEND OTP (WORKING)
  const handleResend = async () => {

    if (!mobile) return

    try {
      setTimeLeft(30)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile }),
      })

      const data = await res.json()

      if (!data.success) {
        alert("Failed to resend OTP")
      }

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-lg">

        <h1 className="text-2xl font-semibold text-center mb-2">
          Enter OTP
        </h1>

        <p className="text-gray-500 text-sm text-center mb-8">
          OTP sent to +91 {mobile || "..."}
        </p>

        <div className="flex justify-between gap-2 mb-6">

          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="w-12 h-12 text-center text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}

        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-4 text-sm text-gray-500">

          {timeLeft > 0 ? (
            <span>Resend OTP in {timeLeft}s</span>
          ) : (
            <button
              onClick={handleResend}
              className="text-black underline"
            >
              Resend OTP
            </button>
          )}

        </div>

      </div>

    </div>
  )
}