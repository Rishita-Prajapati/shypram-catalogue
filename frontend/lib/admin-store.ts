import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdminStore {
  isAuthenticated: boolean
  adminUser: {
    name: string
    email: string
  } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      adminUser: null,

      login: async (email: string, password: string) => {
        // Simple mock authentication - in real app, this would call an API
        if (email === "admin@shypramrubber.com" && password === "admin123") {
          set({
            isAuthenticated: true,
            adminUser: {
              name: "Admin User",
              email: "admin@shypramrubber.com",
            },
          })
          return true
        }
        return false
      },

      logout: () => {
        set({
          isAuthenticated: false,
          adminUser: null,
        })
      },
    }),
    {
      name: "admin-auth-storage",
    },
  ),
)
