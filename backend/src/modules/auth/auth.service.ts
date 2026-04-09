import prisma from "../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { registerSchema, loginSchema } from "./auth.schema"
import { getOtp, deleteOtp, setOtp } from "./otp.store" // ✅ ADDED setOtp

type RegisterInput = z.infer<typeof registerSchema>
type LoginInput = z.infer<typeof loginSchema>

// ✅ NORMALIZE MOBILE
const normalizeMobile = (mobile: string) => {
  return mobile.replace("+91", "").trim()
}

// ✅ REGISTER
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

// ✅ LOGIN (UPDATED WITH ADMIN OTP FLOW)
export const loginUser = async (data: any) => {
  try {
    console.log("LOGIN INPUT:", data)

    const mobile =
      typeof data.mobile === "string"
        ? data.mobile
        : typeof data.phone === "string"
        ? data.phone
        : null

    // =======================
    // 🔐 OTP LOGIN (USER)
    // =======================
    if (mobile && typeof data.otp === "string" && data.otp.length === 6) {
      const cleanMobile = normalizeMobile(mobile)

      const record = getOtp(cleanMobile)
      console.log("OTP STORE:", record, "INPUT:", cleanMobile)

      if (!record) throw new Error("OTP not found")

      if (Date.now() > record.expiresAt) {
        deleteOtp(cleanMobile)
        throw new Error("OTP expired")
      }

      if (String(record.otp) !== String(data.otp)) {
        throw new Error("Invalid OTP")
      }

      deleteOtp(cleanMobile)

      const email = `${cleanMobile}@temp.com`

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        console.log("Creating new OTP user...")

        user = await prisma.user.create({
          data: {
            name: "User",
            email,
            password: "no-pass",
            role: "USER",
          },
        })
      }

      if (!user) throw new Error("User creation failed")

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET missing")
      }

      const token = jwt.sign(
        {
          userId: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      )

      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }

      return { user: safeUser, token }
    }

    // =======================
    // 🔐 EMAIL LOGIN
    // =======================
    console.log("Falling to EMAIL LOGIN")

    const parsed = loginSchema.parse(data)

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
    })

    if (!user) throw new Error("Invalid credentials")

    const isMatch = await bcrypt.compare(parsed.password, user.password)
    if (!isMatch) throw new Error("Invalid credentials")

    // =======================
    // 🔥 ADMIN OTP FLOW
    // =======================
    if (user.role === "ADMIN") {

      // 🔥 STEP 1: if OTP NOT PROVIDED → send OTP
      if (!data.otp) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        setOtp(user.email, otp)

        console.log("🔥 ADMIN OTP:", otp, "Email:", user.email)

        return { requireOTP: true }
      }

      // 🔥 STEP 2: verify OTP
      const record = getOtp(user.email)

      if (!record) throw new Error("OTP not found")

      if (Date.now() > record.expiresAt) {
        deleteOtp(user.email)
        throw new Error("OTP expired")
      }

      if (String(record.otp) !== String(data.otp)) {
        throw new Error("Invalid OTP")
      }

      deleteOtp(user.email)
    }

    // =======================
    // 🔐 FINAL TOKEN
    // =======================
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET missing")
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    const { password, ...safeUser } = user

    return { user: safeUser, token }

  } catch (error: any) {
    console.error("LOGIN SERVICE ERROR:", error)
    throw new Error(error.message || "Login failed")
  }
}