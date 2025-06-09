import { useTrainStore } from "@/store/trainStore";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ArrowDown, Disc, MapPin } from "lucide-react";
import { BsPeople } from "react-icons/bs";

export default function RouteInformation() {
  const userTrainRouteInformationList = useTrainStore(
    (state) => state.userTrainRouteInformationList
  );
  const trainRouteInformationListLength = userTrainRouteInformationList.length;

  return (
    <div className="grid gap-5 md:w-2/3 lg:w-3/5 justify-self-center">
      {userTrainRouteInformationList.map((route, index) => (
        <div
          key={index}
          className="w-full justify-items-center"
        >
          <Card className="w-full">
            <CardHeader className="">
              <span className="p-2">
               {index === 0 ? <BsPeople/> : index ===(trainRouteInformationListLength-1) ? <MapPin /> : <Disc/>}
              </span>
              {route.city}
            </CardHeader>
            <CardBody className="grid sm:grid-cols-2">
              {route.arrival_time && (
                <div>Arrival time : {route.arrival_time}</div>
              )}
              {route.duration && <div>Duration : {route.duration} min</div>}
              {route.halt && <div>Halt : {route.halt} min</div>}
            </CardBody>
          {(index===0 || index===(trainRouteInformationListLength -1)) &&  <CardFooter>
                {index===0 ? 'Starting Point' : 'Ending point'}
            </CardFooter>}
          </Card>
          <ArrowDown />
        </div>
      ))}
    </div>
  );
}
