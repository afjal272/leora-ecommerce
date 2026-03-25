import { Request, Response } from "express"
import { registerUser, loginUser } from "./auth.service"
import { registerSchema, loginSchema } from "./auth.schema"

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)
    const user = await registerUser(data)

    res.status(201).json({
      success: true,
      data: user,
    })
  } catch (err) {
    const error = err as Error
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)
    const result = await loginUser(data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (err) {
    const error = err as Error
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}