export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import ProductsPage from "./ProductsPage" 

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading order details...</div>}>
      <ProductsPage />
    </Suspense>
  )
}