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

// ✅ SEND OTP
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

// ✅ LOGIN (CLEAN + SINGLE FLOW)
export const login = async (req: Request, res: Response) => {
  try {
    // 🔥 let service handle OTP vs email logic
    const result = await loginUser(req.body)

    // 🔥 minimal safety (optional but clean)
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