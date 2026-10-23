import { Alert } from "@heroui/alert";
export default function UserTrainListEmptyAlert() {
  return (
    <div className="sm:col-span-2 grid sm:grid-cols-2 gap-3 mt-2 w-full">
      <Alert
        variant="bordered"
        color="danger"
      >
        No Train is found on your route
      </Alert>
      <Alert
        variant="bordered"
        color="success"
      >
        You can manually select your train from dropdown below
      </Alert>
    </div>
  );
}
