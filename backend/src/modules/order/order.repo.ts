import prisma from "../../lib/prisma"

type CreateOrderData = {
  userId: string
  total: number
  status: string
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