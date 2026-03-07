import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useProductStore } from "./product.store"

interface CartItem {
  id: string
  quantity: number
}

interface CartState {
  items: CartItem[]

  addToCart: (id: string) => void
  removeFromCart: (id: string) => void

  increaseQty: (id: string) => void
  decreaseQty: (id: string) => void

  clearCart: () => void

  getTotal: () => number
  getItemsCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (id) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === id)

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { id, quantity: 1 }],
          }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get()
        const { products } = useProductStore.getState()

        return items.reduce((total, item) => {
          const product = products.find((p) => p.id === item.id)

          if (!product) return total

          return total + product.price * item.quantity
        }, 0)
      },

      getItemsCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: "leora-cart",
    }
  )
)