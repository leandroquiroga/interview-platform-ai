import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name?: string;
  email: string;
}

interface UserState {
  user: User | null;
  error: string | null;
  setUser: (user: User | null) => void;
}


export const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      error: null,
      setUser: (user) => set({ user, error: null }),
    }),
    {
      name: "user-storage", // Nombre para el almacenamiento en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);