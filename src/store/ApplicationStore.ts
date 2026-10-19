import { Metadata } from "@/interface/MetaData";
import { ApplicationInformation } from "@/interface/store/ApplicationStore";
import { addToast } from "@heroui/react";
import { appFetch as fetch } from "@/utils/http";
import { create } from "zustand";
import { getVersion } from "@tauri-apps/api/app";

export const useApplicationStore = create<ApplicationInformation>(
  (set, get) => ({
    applicationVersion: null,
    metadataUrl:
      "https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/main/update/metadata.json",
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
    detectUpdate: async () => {
      try {
        const ApplicationStore = get();
        const setOnlineVersion = ApplicationStore.setOnlineVersion;
        const metadataUrl = ApplicationStore.metadataUrl;
        const setUpdateMetadata = ApplicationStore.setUpdateMetadata;
        const response = await fetch(metadataUrl);
        if (response.status === 200) {
          const data: Metadata = await response.json();
          setOnlineVersion(data.version);
          setUpdateMetadata(data);
        }
      } catch (error) {
        const ApplicationStore = get();
        ApplicationStore.setErrorFoundWhileUpdateChecking(true);
      } finally {
        const ApplicationStore = get();
        const applicationVersion = ApplicationStore.applicationVersion;
        const onlineVersion = ApplicationStore.onlineVersion;
        const errorFoundWhileUpdateChecking =
          ApplicationStore.errorFoundWhileUpdateChecking;
        const setShowWarningDialog = ApplicationStore.setShowWarningDialog;
        if (!errorFoundWhileUpdateChecking) {
          const setIsUpdateAvailable = ApplicationStore.setIsUpdateAvailable;
          // console.log(applicationVersion + " : " + onlineVersion);
          if (
            applicationVersion &&
            onlineVersion &&
            applicationVersion < onlineVersion
          ) {
            // console.log("Update Available!")
            setIsUpdateAvailable(true);
            setShowWarningDialog(true);
          }
        } else {
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
