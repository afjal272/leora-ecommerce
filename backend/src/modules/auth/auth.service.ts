import prisma from "../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { registerSchema, loginSchema } from "./auth.schema"
import { getOtp, deleteOtp, setOtp } from "./otp.store"

type RegisterInput = z.infer<typeof registerSchema>

// 🔥 FIX: GLOBAL SECRET (TYPE SAFE)
const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET missing in environment variables")
}

// NORMALIZE
const normalizeMobile = (mobile: string) => {
  return mobile.replace("+91", "").trim()
}

// REGISTER
export const registerUser = async (data: RegisterInput) => {
  const hashed = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  })

  const { password, ...safeUser } = user
  return safeUser
}

// LOGIN
export const loginUser = async (data: any) => {

  const mobile =
    typeof data.mobile === "string"
      ? data.mobile
      : typeof data.phone === "string"
      ? data.phone
      : null

  // ================= USER OTP =================
  if (mobile && data.otp) {

    const cleanMobile = normalizeMobile(mobile)

    const record = getOtp(cleanMobile, "mobile")

    if (!record) throw new Error("OTP not found")

    if (Date.now() > record.expiresAt) {
      deleteOtp(cleanMobile, "mobile")
      throw new Error("OTP expired")
    }

    if (record.otp !== data.otp) {
      throw new Error("Invalid OTP")
    }

    deleteOtp(cleanMobile, "mobile")

    const email = `${cleanMobile}@temp.com`

    let user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "User",
          email,
          password: "no-pass",
          role: "USER",
        },
      })
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    return { user, token }
  }

  // ================= EMAIL LOGIN =================
  const parsed = loginSchema.parse(data)

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  })

  if (!user) throw new Error("Invalid credentials")

  const isMatch = await bcrypt.compare(parsed.password, user.password)
  if (!isMatch) throw new Error("Invalid credentials")

  // ================= ADMIN OTP =================
  if (user.role === "ADMIN") {

    const email = user.email ?? ""

    if (!email) {
      throw new Error("Admin email missing")
    }

    // SEND OTP
    if (!data.otp) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      setOtp(email, otp, "email")

      console.log("🔥 ADMIN OTP:", otp)

      return { requireOTP: true }
    }

    // VERIFY OTP
    const record = getOtp(email, "email")

    if (!record) throw new Error("OTP not found")

    if (Date.now() > record.expiresAt) {
      deleteOtp(email, "email")
      throw new Error("OTP expired")
    }

    if (record.otp !== data.otp) {
      throw new Error("Invalid OTP")
    }

    deleteOtp(email, "email")
  }

  // ================= FINAL TOKEN =================
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  return { user, token }
}