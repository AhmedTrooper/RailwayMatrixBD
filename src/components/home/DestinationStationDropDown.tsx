import { useJourneyStore } from "@/store/journeyStore";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function DestinationStationDropDown() {
  const items = useJourneyStore((state) => state.destinationStationList);
    const destinationStation = useJourneyStore((state) => state.destinationStation);

  
  const setDestinationStation = useJourneyStore((state) => state.setDestinationStation);
  return (
    <Autocomplete label={destinationStation ? destinationStation : "Destination Station"} onChange={()=>setDestinationStation(null)}>
      {items.map((item) => (
        <AutocompleteItem key={item.key} onPress={()=>setDestinationStation(item.label as string)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
