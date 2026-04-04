export interface ProductVariant {
  color: string      // hex color like "#ff0000"
  image: string      // image for this color
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  images: string[]
  category: string
  stock: number

  variants?: ProductVariant[]   // color variants preview
}