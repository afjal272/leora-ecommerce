"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const pathname = usePathname()

  const navItem = (href: string, label: string) => {

    const active = pathname === href

    return (
      <Link
        href={href}
        className={`block px-4 py-2 rounded-md transition ${
          active
            ? "bg-white text-black font-medium"
            : "hover:bg-gray-800 text-gray-300"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}

      <aside className="w-64 bg-black text-white flex flex-col">

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">
            Leora Admin
          </h2>
        </div>

        <nav className="flex-1 p-6 space-y-2 text-sm">

          {navItem("/admin", "Dashboard")}
          {navItem("/admin/orders", "Orders")}
          {navItem("/admin/products", "Products")}
          {navItem("/admin/users", "Users")}

        </nav>

      </aside>

      {/* Right Side */}

      <div className="flex-1 flex flex-col">

        {/* Topbar */}

        <header className="h-16 bg-white border-b flex items-center justify-between px-8">

          <h1 className="text-lg font-semibold">
            Admin Panel
          </h1>

          <div className="flex items-center gap-4">

            <div className="text-sm text-gray-500">
              Admin
            </div>

            <div className="w-9 h-9 bg-gray-300 rounded-full"></div>

          </div>

        </header>

        {/* Page Content */}

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>
  )
}