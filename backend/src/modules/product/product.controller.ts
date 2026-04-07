import { Request, Response } from "express"
import prisma from "@/lib/prisma"
import slugify from "slugify"
import crypto from "crypto"

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const search = Array.isArray(req.query.search)
      ? req.query.search[0]
      : (req.query.search as string) || ""

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return res.json({ success: true, data: products })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    })
  }
}

// ✅ GET SINGLE PRODUCT
export const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string // ✅ FIXED

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

    return res.json({ success: true, data: product })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    })
  }
}

// ✅ CREATE PRODUCT
export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log("BODY 👉", req.body)

    const { name, price, image, images, stock, description, category } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      })
    }

    const baseSlug = slugify(name, { lower: true, strict: true })
    const id = crypto.randomUUID()
    const slug = `${baseSlug}-${id.slice(0, 6)}`

    let finalImages: string[] = []

    if (Array.isArray(images) && images.length > 0) {
      finalImages = images
    } else if (image) {
      finalImages = [image]
    }

    if (finalImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      })
    }

    const product = await prisma.product.create({
      data: {
        id,
        name,
        slug,
        price: Number(price),
        image: finalImages[0],
        images: finalImages,
        stock: Number(stock) || 0,
        description: description || "",
        category: category || "general",
      },
    })

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    })
  } catch (error: any) {
    console.error("CREATE ERROR 👉", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    })
  }
}

// ✅ UPDATE PRODUCT
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string // ✅ FIXED
    const { name, price, image, images, stock, description, category } = req.body

    let finalImages: string[] | undefined

    if (Array.isArray(images) && images.length > 0) {
      finalImages = images
    } else if (image) {
      finalImages = [image]
    }

    const updateData: any = {}

    if (name) {
      updateData.name = name
      updateData.slug = `${slugify(name, {
        lower: true,
        strict: true,
      })}-${Date.now().toString().slice(-4)}`
    }

    if (price !== undefined) updateData.price = Number(price)
    if (stock !== undefined) updateData.stock = Number(stock)
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category

    if (finalImages) {
      updateData.image = finalImages[0]
      updateData.images = finalImages
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return res.json({ success: true, data: product })
  } catch (error: any) {
    console.error("UPDATE ERROR 👉", error)

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    })
  }
}

// ✅ DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string // ✅ FIXED

    await prisma.product.delete({
      where: { id },
    })

    return res.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    })
  }
}