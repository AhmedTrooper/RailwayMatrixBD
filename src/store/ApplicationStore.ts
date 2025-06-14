import { ApplicationInformation } from "@/interface/store/ApplicationStore";
import { create } from "zustand";

export const useApplicationStore = create<ApplicationInformation>((set) => ({
  applicationVersion: null,
  setApplicationVersion: (v: string | null) =>
    set({
      applicationVersion: v,
    }),
}));
