import { useTrainStore } from "@/store/trainStore";
import SegmentedOriginStationDropdown from "./SegmentedOriginStationDropdown";
import { isEmpty } from "lodash";
import SegmentedDestinationStationDropdown from "./SegmentedDestinationStationDropdown";
import { Button } from "@heroui/react";
import { useMatrixStore } from "@/store/matrixStore";
import SegmentedRouteList from "./SegmentedRouteList";
import SegmentedRouteNotFound from "./SegmentedRouteNotFound";

export default function SegmentedRoute(){
        const routeList = useTrainStore(state => state.routeList);
       const segmentedRouteFinder =  useMatrixStore(state=>state.segmentedRouteFinder)
              const segmentedSeatArray =  useMatrixStore(state=>state.segmentedSeatArray);
              const segmentedRouteFound =  useMatrixStore(state=>state.segmentedRouteFound);
              useMatrixStore(state=>state.showTicketFoundBox);

    
    
    return(<div
     className="segmented-route w-66 sm:w-96 sm:grid-cols-2 grid p-4  justify-items-center  rounded-md  gap-4 mt-4 mb-4">
        <h1 className="text-blue-600 font-bold text-xl text-center sm:col-span-2">Check Ticket Availability</h1>
{!isEmpty(routeList) && <SegmentedOriginStationDropdown/>}
{!isEmpty(routeList) && <SegmentedDestinationStationDropdown/>}
<Button color="primary" className="p-5 w-40 h-18 font-bold sm:col-span-2" onPress={()=>segmentedRouteFinder()}>Check Availability</Button>
{!isEmpty(segmentedSeatArray) && segmentedRouteFound && <SegmentedRouteList/>}
{isEmpty(segmentedSeatArray) && !segmentedRouteFound && <SegmentedRouteNotFound/>}
    </div>);
}