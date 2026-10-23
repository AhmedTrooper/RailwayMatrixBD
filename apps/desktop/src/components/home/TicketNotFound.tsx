import { Alert } from "@heroui/alert";
import { X } from "lucide-react";

export default function TicketNotFound() {
  return (
    <div className="w-full mt-2">
      <Alert
        color="danger"
        className="flex items-center gap-2"
      >
        <X size={16} />
        <span>No ticket found</span>
      </Alert>
    </div>
  );
}
