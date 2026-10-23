import { Metadata } from "@/interface/MetaData";
import { ApplicationInformation } from "@/interface/store/ApplicationStore";
import { addToast } from "@heroui/react";
import { create } from "zustand";
import { getVersion } from "@tauri-apps/api/app";
import { check, Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { platform } from "@tauri-apps/plugin-os";

const RELEASES_URL =
  "https://github.com/AhmedTrooper/RailwayMatrixBD/releases/latest";

export const useApplicationStore = create<ApplicationInformation>(
  (set, get) => ({
    applicationVersion: null,
    setApplicationVersion: (v: string | null) =>
      set({
        applicationVersion: v,
      }),
    errorFoundWhileUpdateChecking: false,
    setErrorFoundWhileUpdateChecking: (status: boolean) =>
      set({ errorFoundWhileUpdateChecking: status }),
    updateMetadata: null,
    setUpdateMetadata: (m: Metadata) => set({ updateMetadata: m }),
    onlineVersion: null,
    setOnlineVersion: (v: string) => set({ onlineVersion: v }),
    setIsUpdateAvailable: (s: boolean) => set({ isUpdateAvailable: s }),
    isUpdateAvailable: false,
    pendingUpdate: null,
    setPendingUpdate: (u: Update | null) => set({ pendingUpdate: u }),
    updateInstalling: false,
    setUpdateInstalling: (s: boolean) => set({ updateInstalling: s }),
    updateInstalled: false,
    setUpdateInstalled: (s: boolean) => set({ updateInstalled: s }),
    detectUpdate: async () => {
      try {
        // browser dev mode has no tauri runtime, nothing to check
        if (typeof window === "undefined" || !("__TAURI_INTERNALS__" in window))
          return;
        // the updater plugin is desktop only, mobile builds can't self-update this way
        const currentOS = platform();
        if (currentOS === "android" || currentOS === "ios") return;

        const ApplicationStore = get();
        const update = await check();
        if (!update) return;

        ApplicationStore.setPendingUpdate(update);
        ApplicationStore.setOnlineVersion(update.version);
        // keep the old Metadata shape so menu bar, footer and the update page keep working
        ApplicationStore.setUpdateMetadata({
          version: update.version,
          release_date: update.date ?? "",
          features: [],
          fixed_errors: [],
          notes: update.body ?? null,
          release_url: RELEASES_URL,
          author: null,
          severity: "low",
          platforms: [],
        });
        ApplicationStore.setIsUpdateAvailable(update.available);
        ApplicationStore.setShowWarningDialog(true);
      } catch (error) {
        const ApplicationStore = get();
        ApplicationStore.setErrorFoundWhileUpdateChecking(true);
      } finally {
        const ApplicationStore = get();
        if (ApplicationStore.errorFoundWhileUpdateChecking) {
          addToast({
            title: "Error update checking",
            description:
              "Error occurred while application was checking for update",
            color: "danger",
            timeout: 2000,
          });
        }
      }
    },
    installUpdate: async () => {
      const ApplicationStore = get();
      const update = ApplicationStore.pendingUpdate;
      if (!update || ApplicationStore.updateInstalling) return;
      ApplicationStore.setUpdateInstalling(true);
      try {
        await update.downloadAndInstall();
        ApplicationStore.setUpdateInstalled(true);
        await relaunch();
      } catch (error) {
        addToast({
          title: "Update failed",
          description: "Error occurred while downloading/installing the update",
          color: "danger",
          timeout: 5000,
        });
      } finally {
        ApplicationStore.setUpdateInstalling(false);
      }
    },
    fetchApplicationVersion: async () => {
      try {
        const ApplicationStore = get();
        const setApplicationVersion = ApplicationStore.setApplicationVersion;
        const appVersion =
          typeof getVersion === "function" ? await getVersion() : "0.1.0";
        setApplicationVersion(appVersion);
      } catch (e) {
        const ApplicationStore = get();
        ApplicationStore.setApplicationVersion("0.1.0");
      }
    },
    showWarningDialog: false,
    setShowWarningDialog: (value) => set({ showWarningDialog: value }),
  })
);
