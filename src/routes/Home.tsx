import DummyMatrixBox from "@/components/home/DummyMatrixBox";
import MatrixBox from "@/components/home/MatrixBox";
import TicketNotFound from "@/components/home/TicketNotFound";
import TicketNumber from "@/components/home/TicketNumber";
import TrainDetails from "@/components/home/TrainDetails";
import TrainForm from "@/components/home/TrainForm";
import UserIsReadyToFindTicket from "@/components/home/UserIsReadyToFindTicket";
import { useJourneyStore } from "@/store/journeyStore";
import { useMatrixStore } from "@/store/matrixStore";
import { useTrainStore } from "@/store/trainStore";
import { useEffect } from "react";

export default function Home() {
  let showTicketFoundBox = useMatrixStore((state) => state.showTicketFoundBox);
  let showTicketNotFoundBox = useMatrixStore((state) => state.showTicketNotFoundBox);

  let dummyMatrixVisible = useMatrixStore((state) => state.dummyMatrixVisible);
  let hasSearchedForTicket = useMatrixStore(
    (state) => state.hasSearchedForTicket
  );
  const journeyDate = useJourneyStore((state) => state.journeyDate);
  const userTrainName = useTrainStore((state) => state.userTrainName);

  useEffect(() => {}, [hasSearchedForTicket]);

  return (
    <div className="p-4  grid justify-items-center gap-2">
      <TrainForm />
     { <TrainDetails/>}
      {journeyDate && userTrainName && <UserIsReadyToFindTicket />}
      {showTicketNotFoundBox && <TicketNotFound />}
      {dummyMatrixVisible && <DummyMatrixBox />}
      {showTicketFoundBox && <TicketNumber />}
      {<MatrixBox />}
    </div>
  );
}
