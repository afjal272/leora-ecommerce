export interface ProductVariant {
  color: string        // hex like "#ff0000"
  image: string        // image for this variant
}

export interface Product {
  id: string
  name: string
  slug: string

  // optional kyunki har product me nahi hota
  description?: string

  price: number

  // flexible image system
  image?: string
  images?: string[]

  category: string
  stock: number

  variants?: ProductVariant[]
}