import { useApplicationStore } from "@/store/ApplicationStore";
import { addToast, Alert } from "@heroui/react";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect } from "react";

export default function ApplicationVersion() {
  const applicationVersion = useApplicationStore(
    (state) => state.applicationVersion
  );
  const setApplicationVersion = useApplicationStore(
    (state) => state.setApplicationVersion
  );

  const fetchApplicationVersion = async () => {
    try {
      const appVersion = await getVersion();
      setApplicationVersion(appVersion);
      addToast({
        title: "Version Info",
        description: `Application version is : ${appVersion}`,
        color: "success",
        timeout: 200,
      });
    } catch (e) {
      addToast({
        title: "Version Error",
        description: "Application version information retrival failed!",
        color: "danger",
        timeout: 200,
      });
    }
  };

  useEffect(() => {
    fetchApplicationVersion();
  });

  return (
    <div>
      {applicationVersion && (
        <Alert color="success">{applicationVersion}</Alert>
      )}
    </div>
  );
}
