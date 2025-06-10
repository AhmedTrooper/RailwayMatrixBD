import { useTrainStore } from "@/store/trainStore";
import { Button } from "@heroui/react";
import { isEmpty } from "lodash";
import RouteInformation from "./RouteInformation";
import NothingToShowIfNoRouteInformation from "./NothingToShowIfNoRouteInformation";
import { ChevronDown, ChevronUp } from "lucide-react";
import TrainInformation from "./TrainInformation";

export default function TrainDetails() {
  const userTrainRouteInformationList = useTrainStore(
    (state) => state.userTrainRouteInformationList
  );
  const showRouteInformation = useTrainStore(
    (state) => state.showRouteInformation
  );
  const setShowRouteInformation = useTrainStore(
    (state) => state.setShowRouteInformation
  );

  const trainInformaton = useTrainStore((state)=>state.trainInformaton);

  return (
    <div className="w-full grid">
      {trainInformaton && <TrainInformation/>}
      <Button
        color={!showRouteInformation ? "primary" : "default"}
        className="w-fit p-4 justify-self-center mt-4 mb-4"
        onPress={() => setShowRouteInformation(!showRouteInformation)}
      >
        {showRouteInformation ? <ChevronUp /> : <ChevronDown />}
      </Button>
      {showRouteInformation && !isEmpty(userTrainRouteInformationList) && (
        <RouteInformation />
      )}
      {showRouteInformation && isEmpty(userTrainRouteInformationList) && (
        <NothingToShowIfNoRouteInformation />
      )}

      {showRouteInformation && (
        <Button
          color={!showRouteInformation ? "primary" : "default"}
          className="w-fit p-4 justify-self-center mt-4 mb-4"
          onPress={() => setShowRouteInformation(!showRouteInformation)}
        >
          {showRouteInformation ? <ChevronUp /> : <ChevronDown />}
        </Button>
      )}
    </div>
  );
}
