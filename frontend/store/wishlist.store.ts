import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WishlistState {
  items: string[]
  toggleWishlist: (id: string) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (id) => {
        const { items } = get()

        if (items.includes(id)) {
          set({
            items: items.filter((item) => item !== id),
          })
        } else {
          set({
            items: [...items, id],
          })
        }
      },
    }),
    {
      name: "leora-wishlist",
    }
  )
)