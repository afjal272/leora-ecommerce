"use client"

import Link from "next/link"
import Image from "next/image"

type Category = {
  name: string
  image: string
  slug: string
}

type CategoryCardProps = {
  category: Category
  big?: boolean
}

const categories: Category[] = [
  {
    name: "Clothing",
    image: "https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=1200",
    slug: "tshirts"
  },
  {
    name: "Bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1200",
    slug: "bags"
  },
  {
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1200",
    slug: "accessories"
  },
  {
    name: "Sneakers",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1200",
    slug: "accessories"
  }
]

export default function CategorySection() {

  return (

    <section className="max-w-[1480px] mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">

      {/* Header */}
      <div className="text-center mb-10 md:mb-12">

        <h2 className="text-2xl md:text-3xl font-semibold">
          Featured Collections
        </h2>

        <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl mx-auto">
          Upgrade your style with our curated sets. Choose confidence,
          embrace your unique look.
        </p>

      </div>


      {/* MOBILE LAYOUT */}
      <div className="flex gap-4 md:hidden">

        <div className="flex flex-col gap-4 w-1/2">

          <CategoryCard category={categories[0]} big />

          <CategoryCard category={categories[2]} />

        </div>

        <div className="flex flex-col gap-4 w-1/2">

          <CategoryCard category={categories[1]} />

          <CategoryCard category={categories[3]} big />

        </div>

      </div>


      {/* DESKTOP LAYOUT (ORIGINAL) */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">

        <CategoryCard category={categories[0]} big />

        <div className="flex flex-col gap-6">
          <CategoryCard category={categories[1]} />
          <CategoryCard category={categories[2]} />
        </div>

        <CategoryCard category={categories[3]} big />

      </div>

    </section>

  )

}


function CategoryCard({ category, big }: CategoryCardProps) {

  return (

    <Link
      href={`/products?category=${category.slug}`}
      className={`group relative overflow-hidden rounded-xl
      ${big ? "h-[260px] md:h-[700px]" : "h-[160px] md:h-[338px]"}
      `}
    >

      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width:768px) 50vw, 33vw"
        className="object-cover transition duration-700 ease-out group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">

        <span className="bg-white px-5 py-1.5 rounded-full text-xs md:text-sm font-medium shadow-md">
          {category.name}
        </span>

      </div>

    </Link>

  )

}