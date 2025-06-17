import { useApplicationStore } from "@/store/ApplicationStore";
import { Alert } from "@heroui/react";

export default function ApplicationVersion() {
  const applicationVersion = useApplicationStore(
    (state) => state.applicationVersion
  );
  const isUpdateAvailable = useApplicationStore(
    (state) => state.isUpdateAvailable
  );
  const onlineVersion = useApplicationStore((state) => state.onlineVersion);

  return (
    <div>
      {applicationVersion && isUpdateAvailable && (
        <Alert
          className="h-fit"
          color={isUpdateAvailable ? "danger" : "success"}
          variant="faded"
        >
          Current version : {applicationVersion}, Update available of version :{" "}
          {onlineVersion}
        </Alert>
      )}

      {applicationVersion && !isUpdateAvailable && (
        <Alert
          className="h-fit"
          color={isUpdateAvailable ? "danger" : "success"}
          variant="faded"
        >
          Current version : {applicationVersion}
        </Alert>
      )}
    </div>
  );
}
