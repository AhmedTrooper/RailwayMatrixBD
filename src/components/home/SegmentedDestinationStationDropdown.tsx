import  { useMemo } from "react";
import { useTrainStore } from "@/store/trainStore";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { useMatrixStore } from "@/store/matrixStore";

export default function SegmentedDestinationStationDropdown() {
    const routeList = useTrainStore(state => state.routeList);
        const setSegmentedDestinationStation = useMatrixStore(state=>state.setSegmentedDestinationStation);
    

    const formattedRouteList = useMemo(() => 
        routeList.map((label, index) => ({
            key: index,
            label: label
        })), 
    [routeList]);

    return (
        <div>
            <Autocomplete label="Destination Station">
                {formattedRouteList.map(item => (
                    <AutocompleteItem key={item.key} onPress={() => setSegmentedDestinationStation(item.label as string)}>
                        {item.label}
                    </AutocompleteItem>
                ))}
            </Autocomplete>
        </div>
    );
}
