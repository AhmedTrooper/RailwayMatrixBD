import { ApplicationInformation } from "@/interface/store/ApplicationStore";
import { create } from "zustand";

export const useApplicationStore = create<ApplicationInformation>((set) => ({
  applicationVersion: null,
  metadataUrl:
    "https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/main/update/metadata.json",
  setApplicationVersion: (v: string | null) =>
    set({
      applicationVersion: v,
    }),
}));
