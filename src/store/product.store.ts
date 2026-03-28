import { create } from "zustand"

type Product = {
  id: string
  slug: string
  name: string
  price: number
  description?: string
  category?: string
  stock: number
  image: string
  images?: string[]
}

type ProductStore = {
  products: Product[]

  setProducts: (products: Product[]) => void

  addProduct: (product: Product) => void

  deleteProduct: (id: string) => void
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],

  // ✅ backend se data aayega yaha
  setProducts: (products) => set({ products }),

  // ✅ UI fast update
  addProduct: (product) =>
    set((state) => ({
      products: [product, ...state.products],
    })),

  // ❌ abhi sirf local delete (backend baad me connect karenge)
  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),
}))