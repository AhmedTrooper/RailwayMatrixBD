import { useApplicationStore } from "@/store/ApplicationStore";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/react";
import { isEmpty } from "lodash";

export default function UpdatePage() {
  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const installUpdate = useApplicationStore((state) => state.installUpdate);
  const updateInstalling = useApplicationStore(
    (state) => state.updateInstalling
  );
  const updateInstalled = useApplicationStore((state) => state.updateInstalled);
  if (!updateMetadata) return null;
  return (
    <div className="mt-0 p-4 grid">
      <Card className="w-fit justify-self-center self-center">
        <CardHeader>Version : {updateMetadata.version}</CardHeader>
        <CardBody>
          {updateMetadata.author && <p>Author : {updateMetadata.author}</p>}
          {!isEmpty(updateMetadata.release_date) && (
            <p>Release Date : {updateMetadata.release_date}</p>
          )}
          {!isEmpty(updateMetadata.features) && (
            <div className="border p-2 border-zinc-900 rounded-md dark:border-zinc-700 mt-2">
              Features:
              <ul>
                {updateMetadata.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {!isEmpty(updateMetadata.fixed_errors) && (
            <div className="border p-2 border-zinc-900 rounded-md dark:border-zinc-700 mt-2">
              Fixed errors:
              <ul>
                {updateMetadata.fixed_errors.map((fxError, index) => (
                  <li key={index}>{fxError}</li>
                ))}
              </ul>
            </div>
          )}
          {!isEmpty(updateMetadata.platforms) && (
            <div>
              Supported Platforms :
              <ul>
                {updateMetadata.platforms.map((platform, index) => (
                  <li key={index}>{platform}</li>
                ))}
              </ul>
              <p>Severity : {updateMetadata.severity}</p>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex-col gap-2 items-start">
          {updateMetadata.notes && <p>Notes : {updateMetadata.notes}</p>}
          <Button
            color="success"
            className="w-full"
            isDisabled={updateInstalling || updateInstalled}
            onPress={() => installUpdate()}
          >
            {updateInstalled
              ? "Update installed — restarting..."
              : updateInstalling
              ? "Downloading and installing..."
              : "Download and install"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
