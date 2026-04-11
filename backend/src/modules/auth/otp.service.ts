import prisma from "../../lib/prisma"

// OTP generator
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// CREATE OTP (DB BASED)
export const createOtp = async (
  identifier: string,
  type: "mobile" | "email"
) => {

  // 🔒 basic rate limit (3 requests / minute)
  const recentCount = await prisma.oTP.count({
    where: {
      identifier,
      type,
      createdAt: {
        gte: new Date(Date.now() - 60 * 1000),
      },
    },
  })

  if (recentCount >= 3) {
    throw new Error("Too many OTP requests. Try again later.")
  }

  const otp = generateOTP()

  await prisma.oTP.create({
    data: {
      identifier,
      code: otp,
      type,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
    },
  })

  return otp
}

// VERIFY OTP
export const verifyOtp = async (
  identifier: string,
  otp: string,
  type: "mobile" | "email"
) => {

  const record = await prisma.oTP.findFirst({
    where: {
      identifier,
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  if (!record) throw new Error("OTP not found")

  if (record.expiresAt < new Date()) {
    throw new Error("OTP expired")
  }

  if (record.code !== otp) {
    throw new Error("Invalid OTP")
  }

  // ✅ success → delete
  await prisma.oTP.delete({
    where: { id: record.id },
  })

  return true
}