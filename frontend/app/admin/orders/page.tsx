"use client"
 
import { OrderStatus } from "@/store/order.store"
import { useOrderStore } from "@/store/order.store"

export default function AdminOrdersPage() {
  const { orders, updateStatus, deleteOrder } =
    useOrderStore()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Orders Management
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">
          No orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    Order ID: {order.id}
                  </p>

                  <p className="text-sm text-gray-500">
                    Date: {order.createdAt}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">
                    ₹{order.total}
                  </p>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                       e.target.value as OrderStatus
                      )
                    }
                    className="mt-2 border rounded p-1 text-sm"
                  >
                    <option value="Pending">
                      Pending
                    </option>
                    <option value="Confirmed">
                      Confirmed
                    </option>
                    <option value="Shipped">
                      Shipped
                    </option>
                    <option value="Delivered">
                      Delivered
                    </option>
                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="mt-4 border-t pt-4">
                <p className="font-medium mb-2">
                  Items:
                </p>

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-gray-600"
                  >
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </div>

              {/* Address */}
              <div className="mt-4 text-sm text-gray-500">
                Shipping To:{" "}
                {order.address.fullName},{" "}
                {order.address.city},{" "}
                {order.address.state}
              </div>

              <button
                onClick={() =>
                  deleteOrder(order.id)
                }
                className="mt-4 text-red-600 text-sm"
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}