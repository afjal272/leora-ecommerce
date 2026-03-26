import express from "express"
import cors from "cors"

import authRoutes from "./modules/auth/auth.route"
import productRoutes from "./modules/product/product.route" // 🔥 ADD THIS
import { protect } from "./middlewares/auth.middleware"

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get("/api", (req, res) => {
  res.send("Leora API Running")
})

// Auth Routes
app.use("/api/auth", authRoutes)

// 🔥 PRODUCT ROUTES (ye missing tha)
app.use("/api/products", productRoutes)

// 🔥 Protected Route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    user: req.user,
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

export default app