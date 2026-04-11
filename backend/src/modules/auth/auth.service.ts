import prisma from "../../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { registerSchema, loginSchema } from "./auth.schema"
import { verifyOtp, createOtp } from "./otp.service"

type RegisterInput = z.infer<typeof registerSchema>

// ✅ FINAL SECRET FIX (TS + runtime safe)
const JWT_SECRET: string = (() => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET missing in environment variables")
  }
  return secret
})()

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

  // ================= USER OTP LOGIN =================
  if (mobile && data.otp) {

    const cleanMobile = normalizeMobile(mobile)

    await verifyOtp(cleanMobile, data.otp, "mobile")

    const email = `${cleanMobile}@temp.com`

    let user = await prisma.user.findUnique({
      where: { email },
    })

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

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  }

  // ================= EMAIL LOGIN =================
  const parsed = loginSchema.parse(data)

  const user = await prisma.user.findUnique({
    where: { email: parsed.email },
  })

  if (!user) throw new Error("Invalid credentials")

  const isMatch = await bcrypt.compare(parsed.password, user.password!)
  if (!isMatch) throw new Error("Invalid credentials")

  // ================= ADMIN OTP =================
  if (user.role === "ADMIN") {

    if (!user.email) {
      throw new Error("Admin email missing")
    }

    const email = user.email as string

    // SEND OTP
    if (!data.otp) {
      const otp = await createOtp(email, "email")

      console.log("🔥 ADMIN OTP:", otp)

      return { requireOTP: true }
    }

    // VERIFY OTP
    await verifyOtp(email, data.otp, "email")
  }

  // ================= FINAL TOKEN =================
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  }
}