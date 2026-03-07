"use client"

import Link from "next/link"
import { Instagram, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className=" bg-[#0B332E] text-[#F5F5F2] mt-24">
      <div className="max-w-[1400px] mx-auto px-8 py-26">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-semibold tracking-[0.3em] mb-5">
              LEORA
            </h2>
            <p className="text-sm text-[#DDE8E5]/80 leading-relaxed">
              Premium fashion and lifestyle pieces crafted with elegance,
              precision and timeless design philosophy.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-[#D9A441]">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-[#DDE8E5]/80">
              <li>
                <Link href="/products" className="hover:text-[#D9A441] transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#D9A441] transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-[#D9A441] transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-[#D9A441]">
              Company
            </h3>
            <ul className="space-y-3 text-sm text-[#DDE8E5]/80">
              <li>
                <Link href="/about" className="hover:text-[#D9A441] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#D9A441] transition">
                  Blog
                </Link>
              </li>
               <h2> contact for Bulk Order</h2>
              <li>
                <Link href="/contact" className="hover:text-[#D9A441] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h3 className="text-xs font-semibold mb-5 uppercase tracking-widest text-[#D9A441]">
              Newsletter
            </h3>
            <p className="text-sm text-[#DDE8E5]/80 mb-5">
              Subscribe to receive updates on new arrivals and exclusive drops.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 text-sm bg-[#DDE8E5] text-black outline-none rounded-l-md"
              />
              <button className="bg-[#D9A441] text-black px-5 text-sm font-medium rounded-r-md hover:opacity-90 transition">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-[#DDE8E5]/20 my-12"></div>

        {/* BOTTOM BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-sm text-[#DDE8E5]/70">
            © {new Date().getFullYear()} LEORA. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-[#DDE8E5]/70">
            <Link href="#" className="hover:text-[#D9A441] transition">
              <Instagram size={18} />
            </Link>
            <Link href="#" className="hover:text-[#D9A441] transition">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="hover:text-[#D9A441] transition">
              <Facebook size={18} />
            </Link>
          </div>

        </div>
      </div>

      {/* GOLD ACCENT LINE */}
     
    </footer>
  )
}