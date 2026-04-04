
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Address {
  id: string
  fullName: string
  phone: string
  city: string
  state: string
  pincode: string
  addressLine: string
}

interface AddressState {
  addresses: Address[]
  addAddress: (address: Address) => void
  deleteAddress: (id: string) => void
  updateAddress: (id: string, updated: Address) => void
  clearAddresses: () => void
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),

      deleteAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter(
            (a) => a.id !== id
          ),
        })),

      updateAddress: (id, updated) =>
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? updated : addr
          ),
        })),

      clearAddresses: () =>
        set({
          addresses: [],
        }),
    }),
    {
      name: "leora-addresses",
    }
  )
)