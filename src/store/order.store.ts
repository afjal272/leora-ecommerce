import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Address } from "./address.store"

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled"

export interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  address: Address
  createdAt: string
  status: OrderStatus
}

interface OrderState {
  orders: Order[]
  addOrder: (order: Omit<Order, "status">) => void
  updateStatus: (id: string, status: OrderStatus) => void
  deleteOrder: (id: string) => void
  clearOrders: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],

      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              status: "Pending",
            },
            ...state.orders,
          ],
        })),

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        })),

      deleteOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "leora-orders",
    }
  )
)