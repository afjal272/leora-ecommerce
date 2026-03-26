import { Router } from "express"
import { getAllProducts, getSingleProduct } from "./product.controller"

const router = Router()

// GET ALL PRODUCTS
router.get("/", getAllProducts)

// GET SINGLE PRODUCT
router.get("/:id", getSingleProduct)

export default router