import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Leora Store",
  description: "Premium fashion & lifestyle eCommerce",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
            <body className="min-h-screen flex flex-col">
             <Navbar />
           <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}