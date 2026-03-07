"use client"

import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">

      {/* background image */}
      <Image
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d"
        alt="Luxury Fashion"
        fill
        priority
        className="object-cover"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">

        <h1 className="text-5xl md:text-7xl font-light tracking-wide">
          Timeless Luxury
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-xl">
          Crafted for elegance. Designed for confidence.
        </p>

        <div className="flex gap-4 mt-8">

          <Link
            href="/products"
            className="bg-white text-black px-10 py-3 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Explore Collection
          </Link>

          <Link
            href="/products"
            className="border border-white px-10 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Shop Now
          </Link>

        </div>

      </div>

    </section>
  )
}