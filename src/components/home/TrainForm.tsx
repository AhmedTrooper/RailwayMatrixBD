import { addToast, Alert, Button } from "@heroui/react";
import OriginStationDropDown from "./OriginStationDropdown";
import DestinationStationDropDown from "./DestinationStationDropDown";
import DatePickerComponent from "./DatePickerComponent";
import JourneyInfo from "./JourneyInfo";
import { useTrainStore } from "@/store/trainStore";
import { isEmpty } from "lodash";
import UserTrainListComponent from "./UserTrainListComponent";
import UserTrainListEmptyAlert from "./UserTrainListEmptyAlert";
import LoaderComponent from "./LoaderComponent";
import { useJourneyStore } from "@/store/journeyStore";
import MannualTrainSelection from "./MannualTrainSelection";
import OnlyTrainSelectionError from "./OnlyTrainSelectionError";
import clsx from "clsx";
import ProperJourneyInformationAlert from "./ProperJourneyInformationAlert";

export default function TrainForm() {
  const userTrainList = useTrainStore((state) => state.userTrainList);

  const hasTrainBeenSearchedOnce = useTrainStore(
    (state) => state.hasTrainBeenSearchedOnce
  );

  const isTrainFetchingLoading = useTrainStore(
    (state) => state.isTrainFetchingLoading
  );

  const setShowProperJourneyInformationAlert = useJourneyStore(
    (state) => state.setShowProperJourneyInformationAlert
  );

  const showProperJourneyInformationAlert = useJourneyStore(
    (state) => state.showProperJourneyInformationAlert
  );

  const journeyDate = useJourneyStore((state) => state.journeyDate);

  const originStation = useJourneyStore((state) => state.originStation);

  const destinationStation = useJourneyStore(
    (state) => state.destinationStation
  );

  const userTrainName = useTrainStore((state) => state.userTrainName);

  const fetchUserTrainInformation = useTrainStore(
    (state) => state.fetchUserTrainInformation
  );

  const validateAndFetchTrain = useTrainStore(
    (state) => state.validateAndFetchTrain
  );

  return (
    <div className="grid justify-items-center sm:grid-cols-2  gap-2 h-fit md:w-3/5">
     
      <div className="trip-plan-form grid justify-items-center sm:w-96 sm:col-span-2 sm:grid-cols-2  gap-2 h-fit">
 <OriginStationDropDown />
      <DestinationStationDropDown />
      <DatePickerComponent />
      <Button
        variant="shadow"
        color="primary"
        className="p-7 font-bold w-2/3 "
        onPress={() => {
          validateAndFetchTrain();
        }}
      >
        Find Trains
      </Button>
      </div>
      {!isEmpty(userTrainList) && <UserTrainListComponent />}

      {!isTrainFetchingLoading &&
        hasTrainBeenSearchedOnce &&
        isEmpty(userTrainList) && <UserTrainListEmptyAlert />}

      {isTrainFetchingLoading && <LoaderComponent />}

      {originStation &&
        destinationStation &&
        originStation === destinationStation && (
          <Alert
            color="warning"
            className="sm:col-span-2 w-full sm:w-96"
          >
            Origin and Destination must be different!
          </Alert>
        )}

      {showProperJourneyInformationAlert && <ProperJourneyInformationAlert />}

      {(journeyDate ||
        userTrainName ||
        originStation ||
        destinationStation) && <JourneyInfo />}

      {userTrainName && !journeyDate && <OnlyTrainSelectionError />}

      <div className="mt-4 gap-4 w-full sm:w-96 grid sm:grid-cols-2 sm:col-span-2">
        <MannualTrainSelection />
        <div className="sm:col-span-2"><DatePickerComponent /></div>
      </div>

      <div
        className={clsx(
          "grid mt-4 gap-4 sm:col-span-2  w-60 sm:w-96",
          {}
        )}
      >
        {!userTrainName && (
          <Alert color="success">
            Select your train from this dropdown menu if you haven't found one
            yet
          </Alert>
        )}

        {
          <div
            className={clsx("w-full  grid  items-center content-center p-2", {
              "sm:col-span-2 w-3/5 justify-self-center": userTrainName,
            })}
          >
            <Button
              className="self-center justify-self-center w-32 sm:w-52  p-7 font-bold  bg-red-500 sm:col-span-2"
              color="primary"
              onPress={() => {
                setShowProperJourneyInformationAlert(false);

                if (userTrainName && journeyDate) {
                  fetchUserTrainInformation();
                } else {
                  addToast({
                    title: "Date or Train Name error",
                    description: `Make sure you set both journey date and train name correctly...`,
                    color: "danger",
                    timeout: 3000,
                  });
                }
              }}
            >
              Find Tickets
            </Button>
          </div>
        }
      </div>
    </div>
  );
}
