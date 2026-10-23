import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function OriginStationDropDown() {
  const items = useJourneyStore((state) => state.originStationList);
  const setOriginStation = useJourneyStore((state) => state.setOriginStation);
  const originStation = useJourneyStore((state) => state.originStation);

  const selectedKey = items.find((item) => item.label === originStation)?.key;

  return (
    <Autocomplete
      label={originStation ? originStation : "Origin Station"}
      selectedKey={selectedKey === undefined ? null : String(selectedKey)}
      onSelectionChange={(key) => {
        if (key === null) {
          setOriginStation(null);
          return;
        }
        const selected = items.find((item) => String(item.key) === String(key));
        setOriginStation(selected ? String(selected.label) : null);
      }}
    >
      {items.map((item) => (
        <AutocompleteItem key={String(item.key)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
