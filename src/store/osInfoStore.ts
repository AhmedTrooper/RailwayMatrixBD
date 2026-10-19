import { create } from "zustand";
import { platform } from "@tauri-apps/plugin-os";

interface OsInfoState {
  osName: string | null;
  isMobileOS: boolean;
  setOSName: (os: string) => void;
  setIsMobileOS: (osStatus: boolean) => void;
  detectMobileOS: () => void;
}

const useOsInfoStore = create<OsInfoState>((set) => ({
  osName: null,
  isMobileOS: false,
  setOSName: (os) => set({ osName: os }),
  setIsMobileOS: (status) => set({ isMobileOS: status }),
  detectMobileOS: () => {
    try {
      if (typeof platform !== "function") throw new Error("not tauri");
      const currentOS = platform();
      set({ osName: currentOS });
      set({ isMobileOS: currentOS === "android" || currentOS === "ios" });
    } catch {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileOS = /android|iphone|ipad|mobile/.test(userAgent);
      set({ osName: isMobileOS ? "android" : "macos", isMobileOS });
    }
  },
}));

export default useOsInfoStore;
