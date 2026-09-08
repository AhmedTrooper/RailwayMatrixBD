import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthorizationStoreInterface } from "@/interface/store/AuthorizationStore";
import { normalizeAuthToken } from "@/utils/http";

const AUTH_STORAGE_KEY = "railwaymatrix_auth";

export const useAuthorizationStore = create<AuthorizationStoreInterface>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string | null) =>
        set({ token: token ? normalizeAuthToken(token) : null }),

      uudid: "",
      setUUDId: (uudid: string | null) => set({ uudid: uudid?.trim() ?? "" }),

      ssdk: null,
      setSSDK: (ssdk: string | null) => set({ ssdk: ssdk?.trim() || null }),

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
