import  { useMemo } from "react";
import { useTrainStore } from "@/store/trainStore";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useMatrixStore } from "@/store/matrixStore";

export default function SegmentedOriginStationDropdown() {
    const routeList = useTrainStore(state => state.routeList);
    const setSegmentedOriginStation = useMatrixStore(state=>state.setSegmentedOriginStation);

    const formattedRouteList = useMemo(() => 
        routeList.map((label, index) => ({
            key: index,
            label: label
        })), 
    [routeList]);

    return (
        <div>
            <Autocomplete label="Origin Station">
                {formattedRouteList.map(item => (
                    <AutocompleteItem key={item.key}  onPress={() => setSegmentedOriginStation(item.label as string)}>
                        {item.label}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
