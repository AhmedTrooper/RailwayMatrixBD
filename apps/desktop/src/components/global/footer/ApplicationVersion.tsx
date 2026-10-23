import { useApplicationStore } from "@/store/ApplicationStore";
import { Alert } from "@heroui/react";

export default function ApplicationVersion() {
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
    const release_url = updateMetadata?.release_url;
  const applicationVersion = useApplicationStore(
    (state) => state.applicationVersion
  );
  const isUpdateAvailable = useApplicationStore(
    (state) => state.isUpdateAvailable
  );
  const onlineVersion = useApplicationStore((state) => state.onlineVersion);

  return (
    <div>
      {applicationVersion && isUpdateAvailable && release_url && (
        <Alert
          className="h-fit"
          color={isUpdateAvailable ? "danger" : "success"}
          variant="faded"
        >
         <a target="_blank" href={release_url}> Current version : {applicationVersion}, Available version :{" "}
          {onlineVersion}</a>
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
