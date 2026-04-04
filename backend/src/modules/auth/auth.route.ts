import { Router } from "express"
import { login, register, sendOtp } from "./auth.controller"

const router = Router()

router.post("/register", register)
router.post("/send-otp", sendOtp) // 🔥 NEW
router.post("/login", login)

export default router