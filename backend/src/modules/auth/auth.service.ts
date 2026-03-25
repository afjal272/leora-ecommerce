import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { registerSchema, loginSchema } from "./auth.schema"

type RegisterInput = z.infer<typeof registerSchema>
type LoginInput = z.infer<typeof loginSchema>

export const registerUser = async (data: RegisterInput) => {
  const hashed = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashed,
    },
  })

  // 🔥 password remove
  const { password, ...safeUser } = user

  return safeUser
}

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  })

  // 🔥 SAME ERROR (no info leak)
  if (!user) throw new Error("Invalid credentials")

  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) throw new Error("Invalid credentials")

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  )

  // 🔥 password remove
  const { password, ...safeUser } = user

  return { user: safeUser, token }
}