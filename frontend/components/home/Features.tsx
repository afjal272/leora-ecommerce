"use client"

import { Truck, ShieldCheck, Package } from "lucide-react"

export default function Features() {
  return (

    <section className="border-y bg-white">

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

          <div className="flex flex-col items-center gap-3">

            <Truck size={26} className="text-gray-800" />

            <h3 className="text-sm font-semibold tracking-wide">
              Free Shipping
            </h3>

            <p className="text-sm text-gray-500">
              Fast & reliable delivery on all orders.
            </p>

          </div>

          <div className="flex flex-col items-center gap-3">

            <Package size={26} className="text-gray-800" />

            <h3 className="text-sm font-semibold tracking-wide">
              Bulk & Wholesale
            </h3>

            <p className="text-sm text-gray-500">
              Special pricing available for large orders.
            </p>

          </div>

          <div className="flex flex-col items-center gap-3">

            <ShieldCheck size={26} className="text-gray-800" />

            <h3 className="text-sm font-semibold tracking-wide">
              Premium Quality
            </h3>

            <p className="text-sm text-gray-500">
              Carefully crafted products with premium materials.
            </p>

          </div>

        </div>

      </div>

    </section>

  )
}