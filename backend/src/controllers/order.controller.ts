import { Request, Response } from "express"
import prisma from "../lib/prisma" // ya "../prisma" depending on your setup

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, total } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      })
    }

    const order = await prisma.order.create({
      data: {
        items,
        total,
      },
    })

    res.json({
      success: true,
      data: order,
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Order failed",
    })
  }
}