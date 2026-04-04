import express from "express"
import cors from "cors"

import authRoutes from "./modules/auth/auth.route"
import productRoutes from "./modules/product/product.route"
import orderRoutes from "./modules/order/order.route"

import { protect } from "./middlewares/auth.middleware"
import { errorHandler } from "./middlewares/error.middleware"

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}))

app.use(express.json({ limit: "20mb" }))
app.use(express.urlencoded({ limit: "20mb", extended: true }))

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Leora API Running",
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

app.get("/api/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected route working",
    user: req.user,
  })
})

// 🔥 error handler first
app.use(errorHandler)

// ❌ 404 last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

export default app