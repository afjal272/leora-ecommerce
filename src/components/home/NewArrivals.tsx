"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

import { useProductStore } from "@/store/product.store"
import { useStore } from "@/hooks/useStore"
import ProductCard from "@/components/product/product-card"

export default function NewArrivals() {

  const _products = useStore(useProductStore, (state) => state.products)
  const products = _products || []

  const newProducts = products.slice(0, 10)

  if (newProducts.length === 0) return null

  return (

    <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">

      <div className="flex items-center justify-between mb-10">

        <h2 className="text-3xl font-semibold">
          New Arrivals
        </h2>

      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={24}
        slidesPerView={2}
        navigation
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 }
        }}
      >

        {newProducts.map((product) => (

          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>

        ))}

      </Swiper>

    </section>
  )
}