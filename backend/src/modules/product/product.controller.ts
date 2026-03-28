import { Request, Response } from "express"
import { prisma } from "@/lib/prisma"
import slugify from "slugify"
import crypto from "crypto"

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const search = (req.query.search as string) || ""

    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: { createdAt: "desc" },
    })

    res.json({ success: true, data: products })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    })
  }
}

// ✅ GET SINGLE PRODUCT
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

    res.json({ success: true, data: product })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch product",
    })
  }
}

// ✅ CREATE PRODUCT (FINAL FIXED)
export const createProduct = async (req: Request, res: Response) => {
  try {
    console.log("BODY 👉", req.body)

    let { name, price, image, images, stock, description, category } = req.body

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      })
    }

    // ✅ UNIQUE SLUG FIX (MAIN ISSUE)
    const baseSlug = slugify(name, { lower: true, strict: true })
    const id = crypto.randomUUID()
    const slug = `${baseSlug}-${id.slice(0, 6)}`

    // ✅ IMAGE FIX
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

    const mainImage = finalImages[0]

    const product = await prisma.product.create({
      data: {
        id, // ✅ important
        name,
        slug,
        price: Number(price),
        image: mainImage,
        images: finalImages,
        stock: Number(stock) || 0,
        description: description || "",
        category: category || "general",
      },
    })

    res.status(201).json({ success: true, data: product })
  } catch (error: any) {
    console.error("CREATE ERROR 👉", error)

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
    let { name, price, image, images, stock, description, category } = req.body

    const baseSlug = name
      ? slugify(name, { lower: true, strict: true })
      : undefined

    const slug = baseSlug
      ? `${baseSlug}-${Date.now().toString().slice(-4)}`
      : undefined

    let finalImages: string[] | undefined = undefined

    if (Array.isArray(images) && images.length > 0) {
      finalImages = images
    } else if (image) {
      finalImages = [image]
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(price && { price: Number(price) }),
        ...(finalImages && {
          image: finalImages[0],
          images: finalImages,
        }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(description && { description }),
        ...(category && { category }),
      },
    })

    res.json({ success: true, data: product })
  } catch (error: any) {
    console.error("UPDATE ERROR 👉", error)

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