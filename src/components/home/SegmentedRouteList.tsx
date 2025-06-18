import { SeatType } from "@/interface/store/SeatTypeInterface";
import { useJourneyStore } from "@/store/journeyStore";
import { useMatrixStore } from "@/store/matrixStore";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { ArrowDown } from "lucide-react";

export default function SegmentedRouteList() {
  const formattedDate = useJourneyStore((state) => state.formattedJourneyDate);
  const segmentedSeatArray = useMatrixStore(
    (state) => state.segmentedSeatArray
  );
  return (
    <div className="grid justify-self-center gap-4 max-h-[80vh] overflow-auto w-full  sm:col-span-2 pt-4 pb-4">
      {segmentedSeatArray.map((route, index) => (
        <div
          key={index}
          className="grid justify-items-center w-full justify-self-center p-2"
        >
          <Card className="w-full">
            <CardHeader className="text-[15px] grid">
              <p>{route.fromCity}</p>

              <ArrowDown />
              <p>{route.toCity}</p>
            </CardHeader>
            <CardBody className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-4">
              {route.seatsArr.map((seat: SeatType, idx: number) => (
                <div
                  key={idx}
                  className="w-fit p-2 mb-1 bg-red-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded shadow-sm"
                >
                  <div className="font-bold text-blue-600 dark:text-blue-400 truncate dark:bg-transparent">
                    {seat.type}
                  </div>
                  <div className="text-green-700 dark:text-green-400 font-medium dark:bg-transparent">
                    <span className="font-bold text-lg">
                      {seat.seat_counts.offline + seat.seat_counts.online}
                    </span>{" "}
                    Seats
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-semibold dark:bg-transparent">
                    {Number(seat.fare) + seat.vat_amount} TK
                  </div>
                  <a
                    href={`https://eticket.railway.gov.bd/booking/train/search?fromcity=${route.fromCity}&tocity=${route.toCity}&doj=${formattedDate}&class=${seat.type}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block px-3 py-1 text-xs font-bold text-white  bg-blue-600  rounded hover:bg-green-700"
                  >
                    Buy
                  </a>
                </div>
              ))}
            </CardBody>
          </Card>
          {index != segmentedSeatArray.length - 1 && <ArrowDown></ArrowDown>}
        </div>
      ))}
    </div>
  );
}
