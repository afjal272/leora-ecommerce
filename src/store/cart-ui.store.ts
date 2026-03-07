import { create } from "zustand"

interface CartUIState {
  open: boolean
  openCart: () => void
  closeCart: () => void
}

export const useCartUIStore = create<CartUIState>((set) => ({
  open: false,

  openCart: () => set({ open: true }),

  closeCart: () => set({ open: false }),
}))