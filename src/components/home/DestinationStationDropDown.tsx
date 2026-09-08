import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function DestinationStationDropDown() {
  const items = useJourneyStore((state) => state.destinationStationList);
  const destinationStation = useJourneyStore(
    (state) => state.destinationStation
  );

  const setDestinationStation = useJourneyStore(
    (state) => state.setDestinationStation
  );
  const selectedKey = items.find(
    (item) => item.label === destinationStation
  )?.key;

  return (
    <Autocomplete
      label={destinationStation ? destinationStation : "Destination Station"}
      selectedKey={selectedKey === undefined ? null : String(selectedKey)}
      onSelectionChange={(key) => {
        if (key === null) {
          setDestinationStation(null);
          return;
        }
        const selected = items.find((item) => String(item.key) === String(key));
        setDestinationStation(selected ? String(selected.label) : null);
      }}
    >
      {items.map((item) => (
        <AutocompleteItem key={String(item.key)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
