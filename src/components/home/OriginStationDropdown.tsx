import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function OriginStationDropDown() {
  const items = useJourneyStore((state) => state.originStationList);
  const setOriginStation = useJourneyStore((state) => state.setOriginStation);
  const originStation = useJourneyStore((state) => state.originStation);

  return (
    <Autocomplete
      label={originStation ? <h1>{originStation}</h1> : "Origin Station"}
    >
      {items.map((item) => (
        <AutocompleteItem
          key={item.key}
          onPress={() => setOriginStation(item.label as string)}
        >
          {item.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
