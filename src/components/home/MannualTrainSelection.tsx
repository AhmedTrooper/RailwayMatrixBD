import { useJourneyStore } from "@/store/journeyStore";
import { useTrainStore } from "@/store/trainStore";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

export default function MannualTrainSelection() {
  const items = useJourneyStore((state) => state.formattedTrainList);
  const setUserTrainName = useTrainStore((state) => state.setUserTrainName);
  const userTrainName = useTrainStore((state) => state.userTrainName);
  const extractTrainModel = useTrainStore((state) => state.extractTrainModel);

  return (
    <Autocomplete
      label={userTrainName ? userTrainName : "Select Train Manually"}
      className="sm:col-span-2"
    >
      {items.map((item) => (
        <AutocompleteItem
          key={item.key}
          onPress={() => {
            setUserTrainName(item.label as string);
            extractTrainModel(item.label as string);
          }}
        >
          {item.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
