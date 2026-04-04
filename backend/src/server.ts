import "dotenv/config"
import app from "./app"
import prisma from "./lib/prisma" // ✅ FIXED (default import)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    // ✅ DB connect
    await prisma.$connect()
    console.log("✅ Database connected")

    // ✅ Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })

    // ✅ Graceful shutdown
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