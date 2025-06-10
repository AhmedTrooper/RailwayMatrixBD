import { useEffect } from "react";
import clsx from "clsx";
import { ArrowDown, X } from "lucide-react";
import { useTrainStore } from "@/store/trainStore";
import { Spinner } from "@heroui/react";
import { useJourneyStore } from "@/store/journeyStore";
import { useMatrixStore } from "@/store/matrixStore";
import { isEmpty } from "lodash";

export default function MatrixBox() {
  const routeList = useTrainStore((state) => state.routeList);
  const formattedDate = useJourneyStore((state) => state.formattedJourneyDate);
  const createMatrix = useMatrixStore((state) => state.createMatrix);
  const isLoading = useMatrixStore((state) => state.isLoadingTicketFetching);
  const trainData = useMatrixStore((state) => state.trainData);
  const ticketFound = useMatrixStore((state) => state.ticketFound);

  useEffect(() => {
    if (!isEmpty(routeList)) {
      createMatrix();
    }
  }, [routeList]);

  return (
    <div className="p-2 md:p-4 max-w-[85vw] mx-auto cursor-pointer">
      {isLoading ? (
        <div className="text-center py-6 text-gray-500 flex items-center justify-center gap-2">
          <Spinner />
          Loading ticket availability...
        </div>
      ) : trainData.length > 0 && ticketFound ? (
        <div className="overflow-x-auto max-h-[80vh] dark:bg-zinc-900 rounded shadow border dark:border-zinc-700">
          <table className="min-w-full table-auto border-collapse dark:bg-zinc-900">
            <thead>
              <tr>
                <th className="sticky top-0 left-0  h-12 w-32 z-50 font-bold dark:bg-zinc-900 text-white border border-white dark:border-zinc-700 text-center bg-blue-600">
                  <div className="flex items-center justify-center  text-sm dark:bg-zinc-900">
                    From{" "}
                    <ArrowDown
                      size={16}
                      className="ml-1"
                    />
                  </div>
                </th>
                {routeList.map((city, idx) => (
                  <th
                    key={`head-${idx}`}
                    className={clsx(
                      "sticky top-0 font-bold text-white text-xs truncate p-2 z-50 dark:bg-zinc-900",
                      idx % 2 === 0 ? "bg-green-700" : "bg-blue-600"
                    )}
                    title={city}
                  >
                    {city.replace(/_/g, " ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trainData.map((row, i) => (
                <tr key={i}>
                  <td
                    className={clsx(
                      "sticky left-0 font-bold text-white text-xs truncate p-2 border dark:border-zinc-700   z-40 shadow-sm shadow-black",
                      i % 2 === 0
                        ? "bg-green-700 dark:bg-zinc-900"
                        : "bg-blue-600 dark:bg-zinc-900"
                    )}
                    title={routeList[i]}
                  >
                    {routeList[i]}
                  </td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={clsx(
                        "p-2 text-xs border border-gray-200 min-w-[100px] max-w-[150px] dark:bg-zinc-900 dark:border-zinc-700",
                        j % 2 === 0 ? "bg-green-100" : "bg-blue-50"
                      )}
                    >
                      {Array.isArray(cell) && cell.length > 0 ? (
                        cell.map((item, k) => {
                          const total =
                            item.seat_counts.online + item.seat_counts.offline;
                          if (total <= 0) return null;

                          return (
                            <div
                              key={k}
                              className="w-full p-2 mb-1  dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded shadow-sm"
                            >
                              <div className="font-bold text-blue-600 dark:text-blue-400 truncate dark:bg-transparent">
                                {item.type}
                              </div>
                              <div className="text-green-700 dark:text-green-400 font-medium dark:bg-transparent">
                                <span className="font-bold text-lg">
                                  {total}
                                </span>{" "}
                                Seats
                              </div>
                              <div className="text-gray-700 dark:text-gray-300 font-semibold dark:bg-transparent">
                                {Number(item.fare) + item.vat_amount} TK
                              </div>
                              <a
                                href={`https://eticket.railway.gov.bd/booking/train/search?fromcity=${routeList[i]}&tocity=${routeList[j]}&doj=${formattedDate}&class=${item.type}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block px-3 py-1 text-xs font-bold text-white  bg-blue-600  rounded hover:bg-green-700"
                              >
                                Buy
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-center dark:bg-zinc-900 text-gray-400 dark:text-zinc-500 h-16">
                          <X size={20} />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
