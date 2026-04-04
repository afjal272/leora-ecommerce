import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  quantity: number
  name: string
  price: number
  image: string
}

interface CartState {
  items: CartItem[]

  addToCart: (product: Omit<CartItem, "quantity">) => void
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

      addToCart: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { ...product, quantity: 1 }],
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
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
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