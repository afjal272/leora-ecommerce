import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: string
  name: string
  mobile?: string
  email?: string
}

interface AuthState {
  user: User | null
  token: string | null

  setAuth: (data: { user: User; token: string }) => void
  logout: () => void

  updateName: (name: string) => void
  name: string

  // ✅ ADD THIS
  login: (user: User, token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      name: "",

      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
          name: data.user.name,
        }),

      // ✅ ADD THIS (wrapper over setAuth)
      login: (user, token) =>
        set({
          user,
          token,
          name: user.name,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          name: "",
        }),

      updateName: (name) => {
        const currentUser = get().user
        if (!currentUser) return

        set({
          name,
          user: { ...currentUser, name },
        })
      },
    }),
    {
      name: "leora-auth",
    }
  )
)