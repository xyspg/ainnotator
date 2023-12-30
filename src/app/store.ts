import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create((set) => ({
  user: null,
  updateUser: (user: User) => set(() => ({ user })),
}));

type RefererStore = {
    referer: string;
    updateReferer: (referer: string) => void;
};

export const useRefererStore = create<RefererStore>((set) => ({
    referer: "",
    updateReferer: (referer: string) => set(() => ({ referer })),
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

export const useMetaDataStore = create<any>(
  persist(
    (set, get) => ({
      metaData: { guide_shown: false, version: '0.0.1', cookie_shown: false },
      setMetaData: (metaData: any) => set(() => ({ metaData })),
    }),
    {
      name: "meta-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
