import { Alert } from "@heroui/alert";
export default function ProperJourneyInformationAlert() {
  return (
    <div className="sm:col-span-2 mt-5 gap-2 grid sm:grid-cols-2">
      <Alert
        variant="bordered"
        color="warning"
      >
        Please ensure all fields are filled properly: the Date is filled, the
        Origin station and Destination station are filled, and they are not the
        same.
      </Alert>

     

     <Alert variant="bordered" color="success">
  Or you can manually select your train from the dropdown below.
</Alert>

    </div>
  );
}
