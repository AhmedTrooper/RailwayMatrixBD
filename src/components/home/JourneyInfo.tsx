import { useJourneyStore } from "@/store/journeyStore";
import { useTrainStore } from "@/store/trainStore";
import { Alert } from "@heroui/alert";
import { Card, CardBody } from "@heroui/card";
import clsx from "clsx";
import { MapPin, PersonStanding } from "lucide-react";

export default function JourneyInfo() {
  const formattedJuourneyDate = useJourneyStore(
    (state) => state.formattedJourneyDate
  );
  const originStation = useJourneyStore((state) => state.originStation);
  const destinationStation = useJourneyStore(
    (state) => state.destinationStation
  );
  const userTrainName = useTrainStore((state) => state.userTrainName);

  return (
    <Card
      className={clsx("w-full sm:col-span-2 mt-6", {
        "border border-amber-600":
          userTrainName && !(userTrainName && formattedJuourneyDate),
      })}
    >
      <CardBody>
        <div className="grid sm:grid-cols-2 gap-4">
          {userTrainName && (
            <div className="text-green-600 font-bold mt-2 mb-2">
              <Alert color="success">{userTrainName}</Alert>
            </div>
          )}
          {formattedJuourneyDate && (
            <div className="mt-2 mb-2">
              <Alert color="success">{formattedJuourneyDate}</Alert>
            </div>
          )}

         {(originStation || destinationStation ) && <div className="grid sm:grid-cols-2 sm:col-span-2 gap-4">
            <div className="grid justify-items-stretch grid-cols-2">
              <PersonStanding /> {originStation}
            </div>
            <p className="grid justify-items-stretch grid-cols-2">
              <MapPin /> {destinationStation}
            </p>
          </div>}
        </div>
      </CardBody>
    </Card>
  );
}
