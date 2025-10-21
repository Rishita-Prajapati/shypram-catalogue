import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  companyName?: string
  phone?: string
}

interface UserAuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    password: string
    companyName?: string
    phone?: string
  }) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => void
}

export const useUserAuthStore = create<UserAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication - in real app, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        // Demo users
        const demoUsers = [
          {
            id: "1",
            name: "John Smith",
            email: "john@abcmfg.com",
            companyName: "ABC Manufacturing Ltd",
            phone: "+91 70169 63340",
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@xyzind.com",
            companyName: "XYZ Industries",
            phone: "",
          },
        ]

        const user = demoUsers.find((u) => u.email === email)
        if (user && password === "demo123") {
          set({
            user,
            isAuthenticated: true,
          })
          return true
        }
        return false
      },

      register: async (userData) => {
        // Mock registration - in real app, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

        const newUser: User = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          companyName: userData.companyName,
          phone: userData.phone,
        }

        set({
          user: newUser,
          isAuthenticated: true,
        })
        return true
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      updateProfile: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },
    }),
    {
      name: "user-auth-storage",
    },
  ),
)
