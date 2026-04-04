import { Suspense } from "react"
import OTPContent from "./OTPContent" 

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <OTPContent />
    </Suspense>
  )
}