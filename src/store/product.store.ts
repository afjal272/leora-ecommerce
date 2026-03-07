import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

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
      products: [],

      addProduct: (product) => {
        const safeProduct: Product = {
          ...product,
          images: product.images ? product.images.slice(0, 15) : [],
        }

        set((state) => ({
          products: [safeProduct, ...state.products],
        }))
      },

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // ⭐ NEW FUNCTION
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