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
import { useAuthorizationStore } from "@/store/AuthorizationStore";

export default function TrainForm() {
  const userTrainList = useTrainStore((state) => state.userTrainList);
  const token = useAuthorizationStore((state) => state.token);
  const ssdk = useAuthorizationStore((state) => state.ssdk);
  const uudid = useAuthorizationStore((state) => state.uudid);
  const isAuthorized = Boolean(token && ssdk && uudid);

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
    <div className="grid w-full justify-items-center gap-2 h-fit sm:grid-cols-2">
      <div className="trip-plan-form grid w-full justify-items-stretch gap-2 h-fit sm:col-span-2 sm:grid-cols-2">
        <OriginStationDropDown />
        <DestinationStationDropDown />
        <DatePickerComponent />
        {isAuthorized && (
          <Button
            variant="shadow"
            color="primary"
            className="p-7 font-bold w-full"
            onPress={() => {
              validateAndFetchTrain();
            }}
          >
            Find Trains
          </Button>
        )}

        {!isAuthorized && (
          <Button
            variant="shadow"
            color="primary"
            className="p-7 font-bold w-full"
            disabled
          >
            UnAuthorized
          </Button>
        )}
      </div>
      {!isEmpty(userTrainList) && <UserTrainListComponent />}

      {!isTrainFetchingLoading &&
        hasTrainBeenSearchedOnce &&
        isEmpty(userTrainList) && <UserTrainListEmptyAlert />}

      {isTrainFetchingLoading && <LoaderComponent />}

      {originStation &&
        destinationStation &&
        originStation === destinationStation && (
          <Alert color="warning" className="sm:col-span-2 w-full">
            Origin and Destination must be different!
          </Alert>
        )}

      {showProperJourneyInformationAlert && <ProperJourneyInformationAlert />}

      {(journeyDate ||
        userTrainName ||
        originStation ||
        destinationStation) && <JourneyInfo />}

      {userTrainName && !journeyDate && <OnlyTrainSelectionError />}

      <div className="mt-2 gap-3 w-full grid sm:grid-cols-2 sm:col-span-2">
        <MannualTrainSelection />
        <div className="sm:col-span-2">
          <DatePickerComponent />
        </div>
      </div>

      <div className="grid mt-2 gap-3 sm:col-span-2 w-full">
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
            {isAuthorized && (
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
            )}

            {!isAuthorized && (
              <Button
                className="self-center justify-self-center w-32 sm:w-52  p-7 font-bold  bg-red-500 sm:col-span-2"
                color="primary"
                disabled
              >
                UnAuthorized
              </Button>
            )}
          </div>
        }
      </div>
    </div>
  );
}
