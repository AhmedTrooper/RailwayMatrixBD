import { useJourneyStore } from "@/store/journeyStore";
import { DatePicker, DateValue } from "@heroui/react";

export default function DatePickerComponent() {
  const journeyDateGenerator = useJourneyStore(
    (state) => state.journeyDateGenerator
  );
  const pickedDate = useJourneyStore((state) => state.pickedDate);
  const setPickedDate = useJourneyStore((state) => state.setPickedDate);
  return (
    <DatePicker
      className="max-w-full"
      label="Journey Date"
      value={pickedDate}
      onChange={(newDate: DateValue | null) => {
        journeyDateGenerator(newDate);
        setPickedDate(newDate);
      }}
    />
  );
}
