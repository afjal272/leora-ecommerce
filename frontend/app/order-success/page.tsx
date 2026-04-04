export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import OrderSuccessContent from "./OrderSuccessContent" 

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  )
}