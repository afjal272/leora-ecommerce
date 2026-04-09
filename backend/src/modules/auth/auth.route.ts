import { Router } from "express"
import { login, register, sendOtp, sendAdminOtp } from "./auth.controller" // ✅ ADDED

const router = Router()

router.post("/register", register)
router.post("/send-otp", sendOtp) // 🔥 USER OTP
router.post("/login", login)

// 🔥 NEW: ADMIN OTP ROUTE
router.post("/send-admin-otp", sendAdminOtp)

export default router