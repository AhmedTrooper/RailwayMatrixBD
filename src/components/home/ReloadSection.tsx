import { RefreshCcw } from "lucide-react";

export default function ReloadSection() {
  return (
    <div className="mt-10 grid justify-items-center content-center p-2">
      <button className="cursor-pointer" onClick={() => window.location.reload()}>
        <RefreshCcw className="text-green-600" />
      </button>
    </div>
  );
}
