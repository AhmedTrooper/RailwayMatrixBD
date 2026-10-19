import { useJourneyStore } from "@/store/journeyStore";
import { useTrainStore } from "@/store/trainStore";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

export default function MannualTrainSelection() {
  const items = useJourneyStore((state) => state.formattedTrainList);
  const setUserTrainName = useTrainStore((state) => state.setUserTrainName);
  const userTrainName = useTrainStore((state) => state.userTrainName);
  const extractTrainModel = useTrainStore((state) => state.extractTrainModel);

  const selectedKey = items.find((item) => item.label === userTrainName)?.key;

  return (
    <Autocomplete
      label={userTrainName ? userTrainName : "Select Train Manually"}
      className="sm:col-span-2"
      selectedKey={selectedKey === undefined ? null : String(selectedKey)}
      onSelectionChange={(key) => {
        if (key === null) {
          setUserTrainName(null);
          return;
        }
        const selected = items.find((item) => String(item.key) === String(key));
        if (!selected) return;
        const trainName = String(selected.label);
        setUserTrainName(trainName);
        extractTrainModel(trainName);
      }}
    >
      {items.map((item) => (
        <AutocompleteItem key={String(item.key)}>{item.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
