import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthorizationStoreInterface } from "@/interface/store/AuthorizationStore";

const AUTH_STORAGE_KEY = "railwaymatrix_auth";

export const useAuthorizationStore = create<AuthorizationStoreInterface>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) => set({ token }),

      uudid: "",
      setUUDId: (uudid: string | null) => set({ uudid: uudid ?? "" }),

      ssdk: null,
      setSSDK: (ssdk: string | null) => set({ ssdk }),

      resetAuthData: () => set({ token: null, uudid: "", ssdk: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: unknown) => {
        const state =
          persistedState as Partial<AuthorizationStoreInterface> | null;
        return {
          token: state?.token ?? null,
          uudid: state?.uudid ?? "",
          ssdk: state?.ssdk ?? null,
        } as AuthorizationStoreInterface;
      },
    }
  )
);
