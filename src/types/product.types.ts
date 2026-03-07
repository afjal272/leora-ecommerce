export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  images: string[]   // gallery support
  category: string
  stock: number
}