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

  // ✅ NEW: fetch products from DB
  const productIds = data.items.map((item: any) => item.productId)

  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
    },
  })

  // ✅ NEW: calculate total safely
  let calculatedTotal = 0

  const itemsWithValidation = data.items.map((item: any) => {
    const product = products.find((p) => p.id === item.productId)

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`)
    }

    if (item.quantity <= 0) {
      throw new Error("Invalid quantity")
    }

    calculatedTotal += product.price * item.quantity

    return {
      productId: product.id, // ✅ FIXED
      quantity: item.quantity,
    }
  })

  const order = await prisma.order.create({
    data: {
      userId,
      total: calculatedTotal, // ✅ FIXED (no trust on frontend)
      status: "PENDING",
      items: {
        create: itemsWithValidation,
      },
    },
  })

  return order
}