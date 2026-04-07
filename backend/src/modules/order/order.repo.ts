import prisma from "../../lib/prisma"
import { OrderStatus } from "@prisma/client"

type CreateOrderData = {
  userId: string
  total: number
  status: OrderStatus // ✅ FIXED
  items: {
    create: {
      productId: string
      quantity: number
    }[]
  }
}

export const createOrderRepo = (data: CreateOrderData) => {
  return prisma.order.create({
    data,
  })
}