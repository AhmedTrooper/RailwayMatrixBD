import { useJourneyStore } from "@/store/journeyStore";
import { DatePicker, DateValue } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";

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
      //@ts-ignore
      value={pickedDate ? pickedDate : today(getLocalTimeZone())}
      minValue={today(getLocalTimeZone())}
      onChange={(newDate: DateValue | null) => {
        journeyDateGenerator(newDate);
        setPickedDate(newDate);
      }}
    />
  );
}
