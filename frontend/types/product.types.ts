export interface ProductVariant {
  color: string
  image: string
}

export interface Product {
  id: string
  name: string

  // ✅ FIX (flexible banaya)
  slug?: string

  description?: string

  price: number

  image?: string
  images?: string[]

  category?: string
  stock?: number

  variants?: ProductVariant[]
}