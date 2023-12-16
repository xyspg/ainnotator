import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create((set) => ({
  user: null,
  updateUser: (user: User) => set(() => ({ user })),
}));

export const useOpenAIKeyStore = create(
  persist(
    (set, get) => ({
      apiKey: "",
      setKey: (apiKey: string) => set(() => ({ apiKey })),
    }),
    {
      name: "user-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useMetaDataStore = create(
  persist(
    (set, get) => ({
      metaData: { guide_shown: false, version: '0.0.1' },
      setMetaData: (metaData: any) => set(() => ({ metaData })),
    }),
    {
      name: "meta-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
