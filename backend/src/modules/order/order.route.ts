import { Router } from "express"
import { createOrder } from "./order.controller"
import { protect } from "../../middlewares/auth.middleware"

const router = Router()

router.post("/create", protect, createOrder)

export default router