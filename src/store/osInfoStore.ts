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
  const currentOS = platform();
  set({ osName: currentOS });
  if (currentOS === "android" || currentOS === "ios") {
    set({ isMobileOS: true });
  } else {
    set({ isMobileOS: false });
  }
},
}));

export default useOsInfoStore;
