"use client"

import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Swiper as SwiperType } from "swiper"

import "swiper/css"

import { useProductStore } from "@/store/product.store"
import { useStore } from "@/hooks/useStore"
import ProductCard from "@/components/product/product-card"

export default function NewArrivals() {

  const swiperRef = useRef<SwiperType | null>(null)

  const [isBeginning, setIsBeginning] = useState(true)
  const [isEnd, setIsEnd] = useState(false)

  const products = useStore(useProductStore, (state) => state.products) ?? []
  const newProducts = products.slice(0, 10)

  if (!newProducts.length) return null

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="text-center mb-12">

         <h2 className="text-3xl font-semibold">
          New Arrivals
         </h2>

         <p className="text-gray-500 mt-2 text-sm">
          Find the top most popular items in Umino best sellers.
         </p>

      </div>

      <div className="relative group/slider">

        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
          }}
          spaceBetween={24}
          slidesPerView={2}
          speed={500}
          grabCursor
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >

          {newProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}

        </Swiper>

        {/* Prev Arrow */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border shadow-md -translate-x-1/2 transition-all duration-300
          ${isBeginning
              ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black"
            }`}
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Next Arrow */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          disabled={isEnd}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full border shadow-md translate-x-1/2 transition-all duration-300
          ${isEnd
              ? "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black"
            }`}
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

      </div>

    </section>
  )
}