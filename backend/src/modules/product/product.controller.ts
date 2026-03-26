import { Request, Response } from "express"
import { prisma } from "@/lib/prisma"

// GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    })

    res.json({
      success: true,
      data: products,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    })
  }
}

// GET SINGLE PRODUCT (id OR slug)
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }, // 🔥 slug support
        ],
      },
    })

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      })
    }

    res.json({
      success: true,
      data: product,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    })
  }
}