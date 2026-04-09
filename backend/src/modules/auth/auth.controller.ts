import { Request, Response } from "express"
import { registerUser, loginUser } from "./auth.service"
import { registerSchema } from "./auth.schema"
import { setOtp } from "./otp.store"

// 🔥 NORMALIZE MOBILE
const normalizeMobile = (mobile: string) => {
  return mobile.replace("+91", "").trim()
}

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    const user = await registerUser(data)

    return res.status(201).json({
      success: true,
      data: user,
    })
  } catch (err: any) {
    console.error("Register Error:", err)

    return res.status(400).json({
      success: false,
      message: err.message || "Registration failed",
    })
  }
}

// ✅ SEND OTP (PHONE - existing flow)
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { mobile, phone } = req.body

    const finalMobile = mobile || phone

    if (!finalMobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile required",
      })
    }

    const cleanMobile = normalizeMobile(finalMobile)

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    setOtp(cleanMobile, otp)

    console.log("🔥 OTP:", otp, "Mobile:", cleanMobile)

    return res.json({
      success: true,
      message: "OTP sent",
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// 🔥 NEW: SEND OTP FOR ADMIN (EMAIL)
export const sendAdminOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // reuse same store (simple approach)
    setOtp(email, otp)

    // 🔥 TEMP: console log (later email service lagayenge)
    console.log("🔥 ADMIN OTP:", otp, "Email:", email)

    return res.json({
      success: true,
      message: "Admin OTP sent",
    })
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

// ✅ LOGIN (UPDATED FOR ADMIN OTP FLOW)
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body)

    // 🔥 CASE 1: ADMIN → OTP REQUIRED
    if (result?.requireOTP) {
      return res.status(200).json({
        success: true,
        requireOTP: true,
        message: "OTP sent to email",
      })
    }

    // 🔥 CASE 2: NORMAL LOGIN SUCCESS
    if (!result?.user || !result?.token) {
      console.error("❌ Invalid login result:", result)

      return res.status(500).json({
        success: false,
        message: "Invalid login response",
      })
    }

    console.log("LOGIN SUCCESS:", result)

    return res.status(200).json({
      success: true,
      data: result,
    })

  } catch (err: any) {
    console.error("Login Error:", err)

    return res.status(400).json({
      success: false,
      message: err.message || "Login failed",
    })
  }
}