import { Metadata } from "@/interface/MetaData";
import { ApplicationInformation } from "@/interface/store/ApplicationStore";
import { addToast } from "@heroui/react";
import { fetch } from "@tauri-apps/plugin-http";
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
        if (!errorFoundWhileUpdateChecking) {
          const setIsUpdateAvailable = ApplicationStore.setIsUpdateAvailable;
          console.log(applicationVersion + " : " + onlineVersion);
          if (
            applicationVersion &&
            onlineVersion &&
            applicationVersion < onlineVersion
          ) {
            setIsUpdateAvailable(true);
          }
        } else {
          addToast({
            title: "Error update checking",
            description:
              "Error occurred while application was checking for update",
            color: "danger",
            timeout: 500,
          });
        }
      }
    },
    fetchApplicationVersion: async () => {
      try {
        const ApplicationStore = get();
        const setApplicationVersion = ApplicationStore.setApplicationVersion;
        const appVersion = await getVersion();
        setApplicationVersion(appVersion);
      } catch (e) {
        addToast({
          title: "Version Error",
          description: "Application version information retrival failed!",
          color: "danger",
          timeout: 500,
        });
      }
    },
  })
);
