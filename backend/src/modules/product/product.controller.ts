import { Request, Response } from "express"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"


// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: (search as string) || "",
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({
      success: true,
      data: products,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    })
  }
}


// ✅ GET SINGLE PRODUCT (id OR slug)
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    })
  }
}


// ✅ CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, image, stock, description } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      })
    }

    const slug = slugify(name, { lower: true, strict: true })

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: Number(price),
        image,
        stock: stock || 0,
        description,
      },
    })

    res.status(201).json({
      success: true,
      data: product,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    })
  }
}


// ✅ UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, price, image, stock, description } = req.body

    const slug = name
      ? slugify(name, { lower: true, strict: true })
      : undefined

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(price && { price: Number(price) }),
        ...(image && { image }),
        ...(stock !== undefined && { stock }),
        ...(description && { description }),
      },
    })

    res.json({
      success: true,
      data: product,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    })
  }
}


// ✅ DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.product.delete({
      where: { id },
    })

    res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    })
  }
}