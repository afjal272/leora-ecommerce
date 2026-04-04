import prisma from "../../lib/prisma"

export const createOrderService = async (data: any, userId: string) => {
  if (!data.items || data.items.length === 0) {
    throw new Error("Cart is empty")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const order = await prisma.order.create({
    data: {
      userId,
      total: data.total,
      status: "PENDING",
      items: {
        create: data.items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      },
    },
  })

  return order
}