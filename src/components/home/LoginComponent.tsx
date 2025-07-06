import { useAuthorizationStore } from "@/store/AuthorizationStore";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Alert, Button, Checkbox, Input } from "@heroui/react";

export default function LoginComponent() {
  const fetchToken = useAuthorizationStore((state) => state.fetchToken);
  const setMobileNumber = useAuthorizationStore(
    (state) => state.setMobileNumber
  );
  const setLoginPassword = useAuthorizationStore(
    (state) => state.setLoginPassword
  );
  const mobileNumber = useAuthorizationStore((state) => state.mobileNumber);
  const loginPassword = useAuthorizationStore((state) => state.loginPassword);
  const isLoggedIn = useAuthorizationStore((state) => state.isLoggedIn);
  const editPasswordEnable = useAuthorizationStore(
    (state) => state.editPasswordEnable
  );
  const editPassword = useAuthorizationStore(
    (state) => state.editPassword
  );
  return (
    <Card className="p-4">
      {!isLoggedIn && (
        <CardHeader>You must login for ticket finding!</CardHeader>
      )}

      {isLoggedIn && (
        <CardHeader className="grid">
          <Alert color="success">You are already loged in!</Alert>
          <div className="m-2 p-2">
            <Button
              onPress={editPassword}
              color={editPasswordEnable ? "danger" : "primary"}
            >
              {!editPasswordEnable ? "Enable Re-Login" : "Disable Re-Login"}
            </Button>
          </div>
        </CardHeader>
      )}

      <CardBody className="grid gap-4">
        <Input
          type="text"
          placeholder="Mobile number"
          onChange={(e) => setMobileNumber(e.target.value.trim())}
          value={mobileNumber ? mobileNumber : ""}
        />
        {!editPasswordEnable && !isLoggedIn && (
          <Input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setLoginPassword(e.target.value.trim())}
            value={loginPassword ? loginPassword : ""}
            disabled={
              loginPassword && loginPassword !== "" && isLoggedIn ? true : false
            }
          />
        )}

        {editPasswordEnable && (
          <Input
            type="password"
            placeholder="Re enter your password"
            onChange={(e) => setLoginPassword(e.target.value.trim())}
          />
        )}

        {!editPasswordEnable && !isLoggedIn && (
          <Button
            color="primary"
            onPress={fetchToken}
          >
            Login
          </Button>
        )}
        {editPasswordEnable && (
          <Button
            color="primary"
            onPress={fetchToken}
          >
            Re-Login
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
