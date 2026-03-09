"use client"

import Link from "next/link"

import HeroSlider from "@/components/home/HeroSlider"
import Features from "@/components/home/Features"
import CategorySection from "@/components/home/CategorySection"
import NewArrivals from "@/components/home/NewArrivals"

import { useProductStore } from "@/store/product.store"
import { useStore } from "@/hooks/useStore"
import ProductCard from "@/components/product/product-card"

export default function HomePage() {
  const products = useStore(useProductStore, (state) => state.products) ?? []
  const featured = products.slice(0, 12)

  return (
    <main className="w-full">

      {/* HERO */}
      <HeroSlider />

      {/* TRUST FEATURES */}
      <Features />

      {/* CATEGORY SECTION */}
      <CategorySection />

      {/* NEW ARRIVALS */}
      <NewArrivals />

      {/* FEATURED PRODUCTS */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Featured Products
          </h2>

          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {/* Products Grid */}
        {featured.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols4- gap-6 md:gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

      </section>

    </main>
  )
}