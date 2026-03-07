"use client"

import Link from "next/link"

import { useWishlistStore } from "@/store/wishlist.store"
import { useProductStore } from "@/store/product.store"
import { useCartStore } from "@/store/cart.store"

export default function WishlistPage() {
  const { items, toggleWishlist } = useWishlistStore()
  const { products } = useProductStore()
  const addToCart = useCartStore((state) => state.addToCart)

  const wishlistProducts = products.filter((product) =>
    items.includes(product.id)
  )

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-32 text-center">
        <h1 className="text-3xl font-semibold mb-6">
          Your Wishlist is Empty
        </h1>

        <Link
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-20">

      <h1 className="text-3xl font-semibold mb-12">
        Your Wishlist
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {wishlistProducts.map((product) => (

          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
          >

            <Link href={`/products/${product.slug}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
            </Link>

            <div className="p-5">

              <h3 className="font-medium">
                {product.name}
              </h3>

              <div className="mt-2 font-semibold text-lg">
                ₹{product.price}
              </div>

              <div className="flex gap-3 mt-4">

                <button
                  onClick={() => addToCart(product.id)}
                  className="flex-1 border border-black py-2 rounded-full hover:bg-black hover:text-white transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="text-sm text-red-500"
                >
                  Remove
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}