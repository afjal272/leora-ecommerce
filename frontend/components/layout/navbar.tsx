"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Heart, Search, Menu, X } from "lucide-react"

import { useCartStore } from "@/store/cart.store"
import { useAuthStore } from "@/store/auth.store"
import { useCartUIStore } from "@/store/cart-ui.store"
import { useProductStore } from "@/store/product.store"

import CartDrawer from "@/components/cart/CartDrawer"

export default function Navbar() {

  const items = useCartStore((state) => state.items)
  const { user, logout } = useAuthStore()
  const name = user?.name
  const { open, openCart, closeCart } = useCartUIStore()
  const { products } = useProductStore()

  const router = useRouter()

  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [mobileSearch, setMobileSearch] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  )

  const initials = name?.charAt(0).toUpperCase() || "U"

  const handleSearchChange = (value: string) => {

    setSearch(value)

    if (!value.trim()) {
      setSuggestions([])
      return
    }

    const query = value.toLowerCase()

    const filtered = products
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 5)

    setSuggestions(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    if (!search.trim()) return

    router.push(`/products?search=${search}`)
    setSuggestions([])
  }

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }

    }

    document.addEventListener("mousedown", handleClickOutside)

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      )

  }, [])

  return (
    <>
      {/* Announcement */}
      <div className="bg-black text-white text-base text-center py-4 font-semibold tracking-wide">
        Bulk Orders Available — Contact us for special pricing
      </div>

      <header className="sticky top-0 z-50 bg-white">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

          <div className="relative flex items-center justify-between h-[70px]">

            {/* LEFT: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">

              <button
                className="md:hidden"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>

              <Link
                href="/"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="absolute left-1/2 -translate-x-1/2 md:static text-xl md:text-2xl font-semibold tracking-[0.25em]"
              >
                LEORA
              </Link>

            </div>

            {/* CENTER NAV */}
            <nav className="hidden md:flex items-center gap-12 text-sm font-medium tracking-wide">

              <Link href="/products" className="hover:text-gray-600 transition">
                Shop
              </Link>

              <Link href="/#" className="hover:text-gray-600 transition">
                Blog
              </Link>

              <Link href="/contact" className="hover:text-gray-600 transition">
                Contact
              </Link>

            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-6">

             <button
             className="md:hidden"
            onClick={() => {
              setMobileMenu(false)
              setMobileSearch(!mobileSearch)
             }}
              >
            <Search size={20} />
            </button>

              {/* SEARCH */}
              <div
                ref={searchRef}
                className="relative hidden md:block w-52"
              >

                <form
                  onSubmit={handleSubmit}
                  className="flex items-center border rounded-full px-3 py-1 text-sm"
                >

                  <Search size={16} className="mr-2 text-gray-500" />

                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) =>
                      handleSearchChange(e.target.value)
                    }
                    className="outline-none bg-transparent w-full"
                  />

                </form>

                {suggestions.length > 0 && (

                  <div className="absolute top-10 left-0 w-full bg-white border rounded-xl shadow-lg overflow-hidden z-50">

                    {suggestions.map((product) => (

                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setSuggestions([])}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition"
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />

                        <div>

                          <p className="text-sm font-medium">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            ₹{product.price}
                          </p>

                        </div>

                      </Link>

                    ))}

                    <button
                      onClick={() =>
                        router.push(`/products?search=${search}`)
                      }
                      className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-gray-100"
                    >
                      View all results →
                    </button>

                  </div>

                )}

              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:block hover:text-gray-600 transition"
              >
                <Heart size={20} />
              </Link>

              {/* CART */}
              <button
                onClick={openCart}
                className="relative hover:text-gray-600 transition"
              >

                <ShoppingCart size={22} />

                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}

              </button>

              {/* PROFILE */}
              {user ? (

                <div className="relative" ref={dropdownRef}>

                  <button
                    onClick={() =>
                      setDropdownOpen(!dropdownOpen)
                    }
                    className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:scale-105 transition"
                  >
                    {initials}
                  </button>

                  <AnimatePresence>

                    {dropdownOpen && (

                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-4 w-56 bg-white border rounded-2xl shadow-xl overflow-hidden"
                      >

                        <div className="px-4 py-4 border-b">
                          <p className="font-medium text-sm">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500 break-all">
                             {user?.mobile || user?.id}
                          </p>
                        </div>

                        <Link
                          href="/profile"
                          className="block px-4 py-3 hover:bg-gray-100 text-sm transition"
                          onClick={() =>
                            setDropdownOpen(false)
                          }
                        >
                          My Account
                        </Link>

                        <button
                          onClick={() => {
                            logout()
                            setDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-red-500 transition"
                        >
                          Logout
                        </button>

                      </motion.div>

                    )}

                  </AnimatePresence>

                </div>

              ) : (

                <Link
                  href="/auth/login"
                  className="hidden md:block hover:text-gray-600 transition"
                >
                  Login
                </Link>

              )}

            </div>

          </div>
         
            {/* MOBILE SEARCH */}
{mobileSearch && (
  <div className="md:hidden px-6 pb-4">

    <form
      onSubmit={handleSubmit}
      className="flex items-center border rounded-full px-4 py-2 text-sm"
    >
      <Search size={16} className="mr-2 text-gray-500" />

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="outline-none w-full bg-transparent"
      />

      <button
        type="button"
        onClick={() => setMobileSearch(false)}
      >
        <X size={16} />
      </button>

    </form>

  </div>
)}

        </div>



     {/* MOBILE MENU DRAWER */}
     
        <AnimatePresence>

         {mobileMenu && (

    <>
      {/* overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40 md:hidden"
        onClick={() => setMobileMenu(false)}
      />

      {/* drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="fixed top-0 left-0 w-[85%] max-w-[320px] h-full bg-white z-50 md:hidden shadow-xl flex flex-col"
      >

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B332E] text-white">

          <span className="font-semibold tracking-wide">
            MENU
          </span>

          <button onClick={() => setMobileMenu(false)}>
            <X size={22} />
          </button>

        </div>

        {/* links */}
        <div className="flex flex-col text-sm">

          <Link
            href="/"
            onClick={() => setMobileMenu(false)}
           className="px-6 py-4 border-b border-gray-300 hover:bg-gray-50"
          >
            Home
          </Link>

          <Link
            href="/products"
            onClick={() => setMobileMenu(false)}
            className="px-6 py-4 border-b border-gray-300 hover:bg-gray-50"
          >
            Shop
          </Link>

          <Link
            href="/#"
            onClick={() => setMobileMenu(false)}
            className="px-6 py-4 border-b border-gray-300 hover:bg-gray-50"
          >
            Blog
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenu(false)}
            className="px-6 py-4 border-b border-gray-300 hover:bg-gray-50"
          >
            Contact
          </Link>

          <Link
            href="/wishlist"
            onClick={() => setMobileMenu(false)}
           className="px-6 py-4 border-b border-gray-300 hover:bg-gray-50"
          >
            Wishlist
          </Link>


        </div>

        {/* bottom area */}
        <div className="px-6 py-6 border-t text-sm space-y-4">

          {!user ? (
            <Link
              href="/auth/login"
              onClick={() => setMobileMenu(false)}
              className="block hover:text-gray-600"
            >
              Login / Register
            </Link>
          ) : (
            <Link
              href="/profile"
              onClick={() => setMobileMenu(false)}
              className="block hover:text-gray-600"
            >
              My Account
            </Link>
          )}

        </div>

      </motion.div>
    </>
  )}

</AnimatePresence>

      </header>

      <CartDrawer
        open={open}
        onClose={closeCart}
      />
    </>
  )
}