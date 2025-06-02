import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";

export default function SelectedDate() {
  const { selectedDate, formatedDate } = useContext(DataContext);

  useEffect(() => {}, [selectedDate, formatedDate]);

  return (
    <div className="p-4 border rounded-md bg-gray-50 max-w-sm mx-auto text-center">
      <p>
        <strong>Selected date:</strong> {selectedDate || "No date selected"}
      </p>
      <p>
        <strong>Formatted date:</strong> {formatedDate || "N/A"}
      </p>
    </div>
  );
}
