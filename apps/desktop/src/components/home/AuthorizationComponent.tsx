import { useAuthorizationStore } from "@/store/AuthorizationStore";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Alert, Button, Input } from "@heroui/react";
import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { ClipboardPaste, Trash2 } from "lucide-react";

export default function AuthorizationComponent() {
  const token = useAuthorizationStore((state) => state.token);
  const setToken = useAuthorizationStore((state) => state.setToken);
  const ssdk = useAuthorizationStore((state) => state.ssdk);
  const setSSDK = useAuthorizationStore((state) => state.setSSDK);
  const uudid = useAuthorizationStore((state) => state.uudid);
  const setUUDId = useAuthorizationStore((state) => state.setUUDId);
  const resetAuthData = useAuthorizationStore((state) => state.resetAuthData);

  const handlePaste = async (setter: (value: string) => void) => {
    try {
      const text =
        typeof readText === "function"
          ? await readText()
          : await navigator.clipboard.readText();
      if (text) {
        setter(text);
      }
    } catch (error) {
      // console.error("Failed to read clipboard:", error);
    }
  };

  return (
    <div>
      <Card className="w-full">
        <CardHeader>Fill the form</CardHeader>
        <CardBody className="grid gap-4">
          <Input
            label="Token"
            type="password"
            value={token ?? ""}
            onChange={(e) => setToken(e.target.value)}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handlePaste(setToken)}
              >
                <ClipboardPaste size={18} />
              </Button>
            }
          />
          <Input
            label="SSDK"
            type="password"
            value={ssdk ?? ""}
            onChange={(e) => setSSDK(e.target.value)}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handlePaste(setSSDK)}
              >
                <ClipboardPaste size={18} />
              </Button>
            }
          />
          <Input
            label="UUDID"
            type="password"
            value={uudid ?? ""}
            onChange={(e) => setUUDId(e.target.value)}
            endContent={
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handlePaste(setUUDId)}
              >
                <ClipboardPaste size={18} />
              </Button>
            }
          />

          {!(token && ssdk && uudid) && (
            <Alert color="warning" variant="bordered">
              Token, SSDK (x-device-key), and UUDID (x-device-id) are all
              required. Copy them from eticket.railway.gov.bd local storage.
            </Alert>
          )}

          <div
            style={{ marginTop: 12 }}
            className="text-xs text-gray-500 space-y-1"
          >
            <div>
              <span className="font-semibold">Token:</span>{" "}
              {token ? "(set)" : "(not set)"}
            </div>
            <div>
              <span className="font-semibold">SSDK:</span>{" "}
              {ssdk ? "(set)" : "(not set)"}
            </div>
            <div>
              <span className="font-semibold">UUDID:</span>{" "}
              {uudid ? "(set)" : "(not set)"}
            </div>
          </div>

          <Button
            color="danger"
            variant="flat"
            className="mt-4"
            startContent={<Trash2 size={18} />}
            onPress={resetAuthData}
          >
            Clear All Data
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
