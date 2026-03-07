"use client"

import Link from "next/link"
import { Heart } from "lucide-react"

import { Product } from "@/types/product.types"
import { useCartStore } from "@/store/cart.store"
import { useCartUIStore } from "@/store/cart-ui.store"
import { useWishlistStore } from "@/store/wishlist.store"

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {

  const addToCart = useCartStore((state) => state.addToCart)
  const openCart = useCartUIStore((state) => state.openCart)

  const { items, toggleWishlist } = useWishlistStore()

  const isWishlisted = items.includes(product.id)

  const handleAddToCart = () => {
    addToCart(product.id)
    openCart()
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  return (

    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative">

      {/* Wishlist */}

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-3 right-3 z-10 bg-white shadow p-2 rounded-full hover:scale-110 transition"
      >
        <Heart
          size={16}
          className={
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-500"
          }
        />
      </button>

      <Link href={`/products/${product.slug}`}>

        <div className="relative bg-gray-50 h-[260px] overflow-hidden flex items-center justify-center">

          <img
            src={images[0]}
            alt={product.name}
            className="absolute w-full h-full object-contain p-6 transition duration-500 group-hover:opacity-0 group-hover:scale-105"
          />

          {images[1] && (
            <img
              src={images[1]}
              alt={product.name}
              className="absolute w-full h-full object-contain p-6 opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-105"
            />
          )}

        </div>

      </Link>

      <div className="p-4">

        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {product.category}
        </p>

        <p className="text-lg font-semibold mt-2 text-black">
          ₹{product.price}
        </p>

        <button
          onClick={handleAddToCart}
          className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 py-2.5 text-sm font-medium rounded-lg transition"
        >
          Add to cart
        </button>

      </div>

    </div>
  )
}