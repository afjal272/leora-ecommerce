import { z } from "zod"

// =======================
// ✅ REGISTER (unchanged)
// =======================
export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

// =======================
// 🔥 LOGIN (FLEXIBLE)
// =======================
export const loginSchema = z.object({
  // email login
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),

  // mobile login
  mobile: z.string().optional(),
  phone: z.string().optional(),

  // OTP (admin + user)
  otp: z.string().length(6).optional(),
})

// =======================
// 🔥 EXTRA SAFETY (optional but smart)
// =======================
export const otpSchema = z.object({
  otp: z.string().length(6),
})