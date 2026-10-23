import type { Update } from "@tauri-apps/plugin-updater";
import { Metadata } from "../MetaData";

export interface ApplicationInformation {
  applicationVersion: string | null;
  setApplicationVersion: (v: string | null) => void;
  isUpdateAvailable: boolean;
  setIsUpdateAvailable: (s: boolean) => void;
  detectUpdate: () => void;
  installUpdate: () => void;
  updateInstalling: boolean;
  setUpdateInstalling: (s: boolean) => void;
  updateInstalled: boolean;
  setUpdateInstalled: (s: boolean) => void;
  pendingUpdate: Update | null;
  setPendingUpdate: (u: Update | null) => void;
  onlineVersion: string | null;
  setOnlineVersion: (v: string) => void;
  updateMetadata: Metadata | null;
  setUpdateMetadata: (m: Metadata) => void;
  errorFoundWhileUpdateChecking: boolean;
  setErrorFoundWhileUpdateChecking: (status: boolean) => void;
  fetchApplicationVersion: () => void;
  showWarningDialog: boolean;
  setShowWarningDialog: (status: boolean) => void;
}
