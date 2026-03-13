"use client"

import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1200",
    slug: "tshirts"
  },
  {
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200",
    slug: "accessories"
  },
  {
    name: "Bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200",
    slug: "bags"
  },
  {
    name: "Sneakers",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200",
    slug: "accessories"
  }
]

export default function CategorySection() {

  return (
    <section className="max-w-[1480px] mx-auto px-6 lg:px-8 py-20">

      <div className="text-center mb-12">

        <h2 className="text-3xl font-semibold">
          Featured Collections
        </h2>

        <p className="text-gray-500 mt-2 text-sm">
          Upgrade your style with our curated sets. Choose confidence.
        </p>

      </div>

      {/* UMINO STYLE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT BIG */}
        <CategoryCard category={categories[0]} />

        {/* MIDDLE STACK */}
        <div className="flex flex-col gap-6">
          <CategoryCard category={categories[1]} small />
          <CategoryCard category={categories[2]} small />
        </div>

        {/* RIGHT BIG */}
        <CategoryCard category={categories[3]} />

      </div>

    </section>
  )
}


function CategoryCard({ category, small }: any) {

  return (

    <Link
      href={`/products?category=${category.slug}`}
      className={`group relative overflow-hidden rounded-2xl ${
        small ? "h-[320px]" : "h-[660px]"
      }`}
    >

      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition duration-700 group-hover:scale-110"
      />

      {/* overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

      {/* pill button */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">

        <span className="bg-white px-6 py-2 rounded-full text-sm font-medium shadow-md">
          {category.name}
        </span>

      </div>

    </Link>

  )
}