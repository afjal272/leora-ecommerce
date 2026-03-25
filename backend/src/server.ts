import "dotenv/config"
import app from "./app"
import { prisma } from "./lib/prisma"

const PORT = process.env.PORT || 5000

async function startServer() {
  try {
    await prisma.$connect()
    console.log("Database connected")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Server failed to start", error)
    process.exit(1)
  }
}

startServer()