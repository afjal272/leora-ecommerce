import { Request, Response } from "express"
import { createOrderService } from "./order.service"

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId

    const order = await createOrderService(req.body, userId)

    return res.status(201).json({
      success: true,
      message: "Order created",
      data: order,
    })
  } catch (err: any) {
    return res.status(400).json({
      success: false,
      message: err.message,
    })
  }
}