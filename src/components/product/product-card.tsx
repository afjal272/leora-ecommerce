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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addToCart(product.id)
    openCart()
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image]

  return (
    <div className="group bg-white rounded-xl overflow-hidden transition-all duration-300">
      {/* IMAGE AREA */}
      <div className="relative bg-gray-100 aspect-[4/5] w-full overflow-hidden rounded-t-xl">
        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 z-20 bg-white shadow p-2 rounded-full hover:scale-110 transition"
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

        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {/* Image 1 */}
          <img
            src={images[0]}
            alt={product.name}
            className={`absolute w-full h-full object-cover transition duration-500 group-hover:scale-110 ${
              images[1] ? "group-hover:opacity-0" : ""
            }`}
          />

          {/* Image 2 */}
          {images[1] && (
            <img
              src={images[1]}
              alt={product.name}
              className="absolute w-full h-full object-cover opacity-0 transition duration-500 group-hover:opacity-100 group-hover:scale-110"
            />
          )}
        </Link>

        {/* ADD TO CART */}
        <div className="absolute bottom-5 left-0 w-full px-5 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-3 rounded-full text-sm font-medium border hover:bg-black hover:text-white transition pointer-events-auto shadow-sm"
          >
            Add to cart
          </button>
        </div>
      </div>

      {/* PRODUCT INFO */}
      <div className="pt-4 pb-5 px-2">
        <h3 className="text-sm font-medium text-gray-900">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mt-1">
          {product.category}
        </p>
        <p className="mt-2 font-semibold text-black">
          ₹{product.price}
        </p>
      </div>
    </div>
  )
}