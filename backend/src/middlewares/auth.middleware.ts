import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

// 🔥 ADD THIS (Type Fix)
interface AuthRequest extends Request {
  user?: any
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    req.user = decoded  // 🔥 now TypeScript won’t cry

    next()
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    })
  }
}