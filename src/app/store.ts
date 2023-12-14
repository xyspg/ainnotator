import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { persist, createJSONStorage } from 'zustand/middleware'


export const useUserStore = create((set) => ({
    user: null,
    updateUser: (user: User) => set(() => ({ user })),
}))


export const useOpenAIKeyStore = create(
    persist(
        (set, get) => ({
            apiKey: "",
            setKey: (apiKey: string) => set(() => ({ apiKey })),
        }),
        {
            name: 'user-openai-key',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)


