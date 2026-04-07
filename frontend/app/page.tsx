"use client"

import Link from "next/link"
import { useEffect } from "react"

import HeroSlider from "@/components/home/HeroSlider"
import Features from "@/components/home/Features"
import CategorySection from "@/components/home/CategorySection"
import NewArrivals from "@/components/home/NewArrivals"

import { useProductStore } from "../store/product.store"
import { useStore } from "@/hooks/useStore"
import ProductCard from "@/components/product/product-card"

// ✅ NEW IMPORT
import { getProducts } from "@/lib/api"

export default function HomePage() {

  const products = useStore(useProductStore, (state) => state.products) ?? []
  const featured = products.slice(0, 12)

  // ✅ CLEAN API CALL
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        useProductStore.getState().setProducts(data)
      } catch (err) {
        console.error("Home fetch error:", err)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="w-full">

      <HeroSlider />
      <Features />
      <CategorySection />
      <NewArrivals />

      <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">

        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            All Products
          </h2>

          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-6 gap-y-20">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </section>

    </main>
  )
}