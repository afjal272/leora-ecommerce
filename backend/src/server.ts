import "dotenv/config"
import app from "./app"
import { prisma } from "./lib/prisma"

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("✅ Database connected")

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

    // 🛑 Graceful shutdown (important)
    const shutdown = async () => {
      console.log("🛑 Shutting down server...")

      await prisma.$disconnect()
      server.close(() => {
        console.log("✅ Server closed")
        process.exit(0)
      })
    }

    process.on("SIGINT", shutdown)
    process.on("SIGTERM", shutdown)

  } catch (error) {
    console.error("❌ Server failed to start", error)
    process.exit(1)
  }
}

startServer()