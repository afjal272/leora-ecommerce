"use client"

import { useOrderStore } from "@/store/order.store"
import { Package, IndianRupee, TrendingUp, Clock, CheckCircle2, Receipt } from "lucide-react"

export default function AdminDashboard() {

  const { orders } = useOrderStore()

  const totalOrders = orders.length

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.total,
    0
  )

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(totalRevenue / totalOrders)
      : 0

  const latestOrder =
    orders.length > 0 ? orders[0].id : "No Orders"

  return (

    <div className="space-y-8">

      {/* PAGE TITLE */}

      <div>
        <h1 className="text-2xl font-semibold">
          Dashboard Overview
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Monitor your store performance
        </p>
      </div>

      {/* STATS GRID */}

      <div className="grid grid-cols-3 gap-6">

        {/* TOTAL ORDERS */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <Package size={22} />
          </div>

        </div>

        {/* REVENUE */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              ₹{totalRevenue}
            </h2>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <IndianRupee size={22} />
          </div>

        </div>

        {/* AVG ORDER */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Avg Order Value
            </p>

            <h2 className="text-2xl font-semibold mt-1">
              ₹{averageOrderValue}
            </h2>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <TrendingUp size={22} />
          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Pending Orders
            </p>

            <h2 className="text-2xl font-semibold text-yellow-600 mt-1">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-yellow-100 p-3 rounded-lg">
            <Clock size={22} />
          </div>

        </div>

        {/* DELIVERED */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Delivered Orders
            </p>

            <h2 className="text-2xl font-semibold text-green-600 mt-1">
              {deliveredOrders}
            </h2>
          </div>

          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle2 size={22} />
          </div>

        </div>

        {/* LATEST ORDER */}

        <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Latest Order
            </p>

            <h2 className="text-lg font-semibold mt-1">
              {latestOrder}
            </h2>
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <Receipt size={22} />
          </div>

        </div>

      </div>

    </div>

  )
}