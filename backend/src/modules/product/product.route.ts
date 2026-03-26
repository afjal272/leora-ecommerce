import { Router } from "express"
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller"

const router = Router()

// ✅ GET ALL PRODUCTS
router.get("/", getAllProducts)

// ✅ GET SINGLE PRODUCT
router.get("/:id", getSingleProduct)

// ✅ CREATE PRODUCT
router.post("/", createProduct)

// ✅ UPDATE PRODUCT
router.put("/:id", updateProduct)

// ✅ DELETE PRODUCT
router.delete("/:id", deleteProduct)

export default router