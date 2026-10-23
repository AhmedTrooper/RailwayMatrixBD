import DummyMatrixBox from "@/components/home/DummyMatrixBox";
import LoginComponent from "@/components/home/AuthorizationComponent";
import MatrixBox from "@/components/home/MatrixBox";
import SegmentedRoute from "@/components/home/SegmentedRoute";
import TicketNotFound from "@/components/home/TicketNotFound";
import TicketNumber from "@/components/home/TicketNumber";
import TrainDetails from "@/components/home/TrainDetails";
import TrainForm from "@/components/home/TrainForm";
import UserIsReadyToFindTicket from "@/components/home/UserIsReadyToFindTicket";
import { useJourneyStore } from "@/store/journeyStore";
import { useMatrixStore } from "@/store/matrixStore";
import { useTrainStore } from "@/store/trainStore";
import { isEmpty } from "lodash";
import { useEffect } from "react";

export default function Home() {
  let showTicketFoundBox = useMatrixStore((state) => state.showTicketFoundBox);
  let showTicketNotFoundBox = useMatrixStore(
    (state) => state.showTicketNotFoundBox
  );
  const routeList = useTrainStore((state) => state.routeList);

  let dummyMatrixVisible = useMatrixStore((state) => state.dummyMatrixVisible);
  let hasSearchedForTicket = useMatrixStore(
    (state) => state.hasSearchedForTicket
  );
  const journeyDate = useJourneyStore((state) => state.journeyDate);
  const userTrainName = useTrainStore((state) => state.userTrainName);

  useEffect(() => {}, [hasSearchedForTicket]);

  return (
    <div className="mx-auto grid w-full max-w-7xl justify-items-center gap-4 p-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:items-start lg:grid-cols-[380px_minmax(0,1fr)]">
      <div className="grid w-full content-start gap-3">
        <LoginComponent />
      </div>
      <div className="grid w-full min-w-0 content-start gap-3">
        <TrainForm />
        {journeyDate && userTrainName && <UserIsReadyToFindTicket />}
        {showTicketNotFoundBox && <TicketNotFound />}
        {showTicketFoundBox && <TicketNumber />}
        {!isEmpty(routeList) && showTicketFoundBox && <SegmentedRoute />}
        <TrainDetails />
      </div>
      {/* the ticket matrix is wide, so it gets its own full-width row */}
      <div className="grid w-full min-w-0 content-start gap-3 md:col-span-2">
        {dummyMatrixVisible && <DummyMatrixBox />}
        {<MatrixBox />}
      </div>
    </div>
  );
}
