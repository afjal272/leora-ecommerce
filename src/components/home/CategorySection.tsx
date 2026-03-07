"use client"

import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    name: "Bags",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    slug: "bags"
  },
  {
    name: "Perfumes",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    slug: "perfumes"
  },
  {
    name: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    slug: "tshirts"
  },
  {
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1511556670410-f0f4e6c8c5b1",
    slug: "accessories"
  }
]

export default function CategorySection() {

  return (
    <section className="max-w-[1400px] mx-auto px-6 lg:px-8 py-16">

      <h2 className="text-3xl font-semibold mb-10">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((cat) => (

          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group relative overflow-hidden rounded-xl"
          >

            <div className="relative aspect-square">

              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">

              <h3 className="text-white text-lg font-semibold">
                {cat.name}
              </h3>

            </div>

          </Link>

        ))}

      </div>

    </section>
  )
}