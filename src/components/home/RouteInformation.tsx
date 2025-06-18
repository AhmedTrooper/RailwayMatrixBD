import { useTrainStore } from "@/store/trainStore";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { ArrowDown, Disc, MapPin, MapPinHouse } from "lucide-react";
import { BsPeople } from "react-icons/bs";

export default function RouteInformation() {
  const userTrainRouteInformationList = useTrainStore(
    (state) => state.userTrainRouteInformationList
  );
  const trainRouteInformationListLength = userTrainRouteInformationList.length;

  return (
    <div className="grid gap-5 w-60 sm:w-96 justify-self-center max-h-[60vh] overflow-auto p-4">
      {userTrainRouteInformationList.map((route, index) => (
        <div
          key={index}
          className="w-full justify-items-center"
        >
          <Card className="w-full">
            <CardHeader className="">
              <span className="p-2">
                {index === 0 ? (
                  <BsPeople />
                ) : index === trainRouteInformationListLength - 1 ? (
                  <MapPin />
                ) : (
                  <Disc />
                )}
              </span>
              {route.city}
            </CardHeader>
            <CardBody className="grid sm:grid-cols-2">
              {route.arrival_time && (
                <div><span className="text-green-700">Arrival time</span> : {route.arrival_time}</div>
              )}
              {route.departure_time && (
                <div><span className="text-red-700">Departure time </span>: {route.departure_time}</div>
              )}

              {route.duration && <div><span className="text-blue-700">Duration</span> : {route.duration} min</div>}
              {route.halt && <div>Halt : {route.halt} min</div>}
            </CardBody>
            {(index === 0 || index === trainRouteInformationListLength - 1) && (
              <CardFooter>
                {index === 0 ? <span className="text-violet-600">Starting Point</span> : <span className="text-orange-700">Ending point</span>}
              </CardFooter>
            )}
          </Card>
          {!(index === trainRouteInformationListLength - 1) && <ArrowDown />}
          {index === trainRouteInformationListLength - 1 && (
            <MapPinHouse className="text-green-600  mt-4 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}
