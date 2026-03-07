import { create } from "zustand"
import { persist } from "zustand/middleware"

type UserRole = "user" | "admin"

interface AuthState {
  user: string | null
  name: string
  role: UserRole
  login: (email: string) => void
  logout: () => void
  updateName: (name: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      name: "",
      role: "user",

      login: (email) =>
        set(() => ({
          user: email,
          name: email.split("@")[0], // default display name
          role:
            email.toLowerCase() === "admin@leora.com"
              ? "admin"
              : "user",
        })),

      logout: () =>
        set(() => ({
          user: null,
          name: "",
          role: "user",
        })),

      updateName: (name) =>
        set(() => ({
          name,
        })),
    }),
    {
      name: "leora-auth",
    }
  )
)