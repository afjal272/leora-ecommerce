import { Request, Response } from "express"
import { registerUser, loginUser } from "./auth.service"
import { registerSchema } from "./auth.schema"
import { createOtp } from "./otp.service" // ✅ NEW

// NORMALIZE
const normalizeMobile = (mobile: string) => {
  return mobile.replace("+91", "").trim()
}

// REGISTER
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

// SEND OTP (PHONE - DB BASED)
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

    const otp = await createOtp(cleanMobile, "mobile") // ✅ DB OTP

    console.log("🔥 OTP:", otp, "Mobile:", cleanMobile) // TEMP

    return res.json({
      success: true,
      message: "OTP sent",
    })

  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
}

// ADMIN OTP (EMAIL - DB BASED)
export const sendAdminOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required",
      })
    }

    const otp = await createOtp(email, "email") // ✅ DB OTP

    console.log("🔥 ADMIN OTP:", otp, "Email:", email)

    return res.json({
      success: true,
      message: "Admin OTP sent",
    })

  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
}

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUser(req.body)

    // ADMIN OTP STEP
    if (result?.requireOTP) {
      return res.status(200).json({
        success: true,
        requireOTP: true,
        message: "OTP sent to email",
      })
    }

    if (!result?.user || !result?.token) {
      return res.status(500).json({
        success: false,
        message: "Invalid login response",
      })
    }

    return res.status(200).json({
      success: true,
      data: result,
    })

  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message || "Login failed",
    })
  }
}