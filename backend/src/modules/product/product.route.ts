import { Router } from "express"
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller"

// 🔥 NEW: auth middleware
import { protect } from "../../middlewares/auth.middleware"

const router = Router()

// ✅ PUBLIC ROUTES (sab dekh sakte hain)
router.get("/", getAllProducts)
router.get("/:id", getSingleProduct)

// 🔐 PROTECTED ROUTES (sirf logged-in user)
router.post("/", protect, createProduct)
router.put("/:id", protect, updateProduct)
router.delete("/:id", protect, deleteProduct)

export default router