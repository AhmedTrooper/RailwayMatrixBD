import { useTrainStore } from "@/store/trainStore";
import SegmentedOriginStationDropdown from "./SegmentedOriginStationDropdown";
import { isEmpty } from "lodash";
import SegmentedDestinationStationDropdown from "./SegmentedDestinationStationDropdown";
import { Button } from "@heroui/react";
import { useMatrixStore } from "@/store/matrixStore";

export default function SegmentedRoute(){
        const routeList = useTrainStore(state => state.routeList);
       const segmentedRouteFinder =  useMatrixStore(state=>state.segmentedRouteFinder)
              const segmentedSeatArray =  useMatrixStore(state=>state.segmentedSeatArray)

    
    
    return(<div
     className="segmented-route sm:w-auto sm:grid-cols-2 grid p-4  justify-items-center  rounded-md w-full gap-4 mt-4 mb-4">
        <h1 className="text-blue-600 font-bold text-xl text-center sm:col-span-2">Check Ticket Availability</h1>
{!isEmpty(routeList) && <SegmentedOriginStationDropdown/>}
{!isEmpty(routeList) && <SegmentedDestinationStationDropdown/>}
<Button color="primary" className="p-5 w-40 h-18 font-bold sm:col-span-2" onPress={()=>segmentedRouteFinder()}>Check Availability</Button>
<Button onPress={()=> console.log(segmentedSeatArray) }>Show</Button>
    </div>);
}