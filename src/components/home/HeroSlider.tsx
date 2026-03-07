"use client"

import Image from "next/image"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    title: "Timeless Luxury",
    text: "Crafted for elegance. Designed for confidence."
  },
  {
    image: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd53",
    title: "Modern Fashion",
    text: "Premium quality fashion for everyday life."
  },
  {
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050",
    title: "Style Redefined",
    text: "Luxury collections curated for you."
  },
  {
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "Exclusive Collection",
    text: "Discover the new trends in fashion."
  }
]

export default function HeroSlider() {

  const heroHeight = "h-[85vh]"

  return (
    <section className={`relative w-full ${heroHeight} overflow-hidden`}>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false
        }}
        speed={1200}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >

        {slides.map((slide, index) => (
          <SwiperSlide key={index}>

            <div className={`relative w-full ${heroHeight}`}>

              {/* IMAGE */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover scale-105 transition-transform duration-[7000ms] ease-linear"
              />

              {/* STRONGER GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

              {/* CONTENT */}
              <div className="absolute inset-0 flex items-center justify-center">

                <div className="text-center text-white px-6 max-w-3xl">

                  {/* LABEL */}
                  <span className="uppercase text-xs tracking-[0.35em] text-gray-300">
                    New Collection
                  </span>

                  {/* TITLE */}
                  <h1 className="mt-4 text-5xl md:text-7xl lg:text-8xl font-light tracking-wide leading-tight">
                    {slide.title}
                  </h1>

                  {/* SUBTEXT */}
                  <p className="mt-6 text-base md:text-lg text-gray-200 max-w-xl mx-auto">
                    {slide.text}
                  </p>

                  {/* BUTTONS */}
                  <div className="mt-8 flex justify-center gap-4 flex-wrap">

                    <Link
                      href="/products"
                      className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition duration-300"
                    >
                      Shop Now
                    </Link>

                    <Link
                      href="/products"
                      className="border border-white px-8 py-3 rounded-full hover:bg-white hover:text-black transition duration-300"
                    >
                      Explore
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          </SwiperSlide>
        ))}

      </Swiper>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/80 pointer-events-none">

        <span className="text-[10px] tracking-[0.25em]">
          SCROLL
        </span>

        <div className="mt-2 w-[1px] h-6 bg-white animate-pulse" />

      </div>

    </section>
  )
}