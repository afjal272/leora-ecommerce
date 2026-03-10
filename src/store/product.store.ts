import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { products as initialProducts } from "@/mock/products"
import { ProductVariant } from "@/types/product.types"

export interface Product {
  id: string
  name: string
  price: number
  image: string
  images: string[]
  description: string
  slug: string
  category: string
  stock: number

  // ⭐ Color variants for preview
  variants?: ProductVariant[]
}

interface ProductState {
  products: Product[]

  addProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  reduceStock: (id: string, quantity: number) => void
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({

      products: initialProducts,

      addProduct: (product) => {

        const safeProduct: Product = {
          ...product,

          // limit max images
          images: product.images ? product.images.slice(0, 15) : [],

          // ensure variants always defined
          variants: product.variants ?? [],
        }

        set((state) => ({
          products: [safeProduct, ...state.products],
        }))
      },

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // ⭐ Reduce stock after order
      reduceStock: (id, quantity) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? {
                  ...product,
                  stock: Math.max(product.stock - quantity, 0),
                }
              : product
          ),
        })),

    }),
    {
      name: "leora-products",
      storage: createJSONStorage(() => localStorage),
    }
  )
)