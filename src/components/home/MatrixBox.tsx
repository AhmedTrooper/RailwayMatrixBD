import { Fragment, useContext, useEffect, useState } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { DataContext } from "../../context/DataContext";
import clsx from "clsx";
import { isEmpty } from "lodash";
import NoSeatMessage from "./NoSeatMessage";
import DatePicker from "./DatePicker";
import { ArrowDownAZ, ArrowRight, Info } from "lucide-react";

export default function MatrixBox() {
  const {
    routeList,
    formatedDate,
    selectedTrainName,
    trainData,
    setTrainData,
    isMatrixCreated,
    setIsMatrixCreated,
    ticketFound,
    setTicketFound,
    numberOfSeatsFound,
    setNumberOfSeatsFound,
  } = useContext(DataContext);

  const [loading, setLoading] = useState(false);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (loading) {
      setElapsed(0);
      interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const createMatrix = async () => {
    try {
      setLoading(true);
      setIsMatrixCreated(false);
      setTicketFound(false);
      setNumberOfSeatsFound(0);

      const size = routeList.length;
      const dataMatrix: any[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null)
      );

      const fetchTasks: Promise<void>[] = [];
      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          const from = routeList[i];
          const to = routeList[j];
          if (from === to) continue;

          const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${from}&to_city=${to}&date_of_journey=${formatedDate}&seat_class=SHULOV`;
          const task = fetch(tempUrl)
            .then((res) => res.json())
            .then((jsonData) => {
              const trainList = jsonData?.data?.trains || [];
              const train = trainList.find(
                (t: any) => t?.trip_number === selectedTrainName
              );
              const seatType = train?.seat_types;
              if (seatType) {
                if (dataMatrix[i][j] == null) {
                  dataMatrix[i][j] = seatType;
                  dataMatrix[j][i] = null;
                  //counts seats for one direction only.....


                   if (!isEmpty(seatType)) {
                  const seatAvailable = seatType.map((seat: any) => {
                    if (
                      seat.seat_counts["online"] + seat.seat_counts["offline"] >
                      0
                    )
                      return true;
                    return 0;
                  });
                  if (seatAvailable) {
                    setTicketFound(true);
                    setNumberOfSeatsFound(()=>numberOfSeatsFound + 1);
                  }
                }



                }
              }
            })
            .catch((err) => {
              console.error(`Error fetching ${from} -> ${to}:`, err);
            });

          fetchTasks.push(task);
        }
      }

      await Promise.all(fetchTasks);
      setTrainData(dataMatrix);
    } catch (e) {
      console.error("Matrix fetch error:", e);
    } finally {
      setLoading(false);
      setIsMatrixCreated(true);
    }
  };

  return (
    <Fragment>
      <div className="p-4 bg-white max-w-[95vw] justify-content-center justify-items-center grid ">
        <button
          onClick={createMatrix}
          className=" bg-green-600 shadow-gray-500 shadow-md text-white w-fit px-4 py-2 mt-5 mb-5 justify-self-center self-center rounded hover:bg-green-700 cursor-pointer"
        >
          {!isMatrixCreated ? (
            "Create Matrix"
          ) : (
            <p>
              Create Matrix Again
              <br />
              (for{" "}
              <span className="text-red-500 font-bold ">{formatedDate}</span>)
            </p>
          )}
        </button>

        {isMatrixCreated && <DatePicker />}

        {isMatrixCreated && (
          <p className="w-[60vw] justify-self-center text-[15px] mt-2 mb-5">
            <span>
              <Info className=" text-green-600" />
            </span>
            You can create the matrix again for {formatedDate} or changing the
            date!
          </p>
        )}

        {/* {numberOfSeatsFound > 0 && (
          <button className="bg-green-600 shadow-gray-500 shadow-md text-white w-fit px-4 py-2 mt-5 mb-10 justify-self-center self-center rounded hover:bg-green-700 cursor-pointer">
            Seat(s) found for{" "}
            <span className="text-xl font-bold">{numberOfSeatsFound}</span>{" "}
            destination
          </button>
        )} */}

        {loading && (
          <div className="mb-4 text-green-600 font-medium animate-pulse">
            Creating matrix... ⏳ {elapsed}s elapsed
          </div>
        )}

        {ticketFound && trainData && trainData.length > 0 ? (
          <div
            className="p-3 rounded shadow-sm shadow-gray-500"
            style={{
              width: "100%",
              height: "80vh",
              overflow: "auto",
              boxSizing: "border-box",
              scrollbarGutter: "stable both-edges",
            }}
          >
            <div
              className="grid shadow-sm shadow-gray-500 p-2"
              style={{
                gridTemplateColumns: `repeat(${
                  routeList.length + 1
                }, minmax(100px, 1fr))`,
                width: "max-content",
              }}
            >
              <div className="sticky border grid-cols-2 gap-2 content-center border-white bg-green-600  top-0 left-0 grid items-center text-white justify-items-center z-30 h-12 w-full font-bold">
                <div className="boredr border-white text-[15px]">
                  From
                  <ArrowDownAZ />
                </div>
                <div className="grid grid-cols-2">
                  To
                  <ArrowRight />
                </div>
              </div>

              {routeList.map((city: any, idx: number) => (
                <div
                  key={`head-${idx}`}
                  className={clsx(
                    "sticky top-0 z-20 font-bold  border border-white text-center text-white text-xs  p-1 truncate grid content-center",
                    {
                      "bg-amber-500": idx % 2 === 0,
                      "bg-green-600": idx % 2 === 1,
                    }
                  )}
                  title={city}
                >
                  {city.replace(/_/g, " ")}
                </div>
              ))}

              {trainData.map((row: any, i: any) => (
                <Fragment key={i}>
                  <div
                    className={clsx(
                      "sticky left-0 z-10  grid content-center font-bold text-white border border-gray-300 text-center text-xs  p-1 truncate",
                      {
                        "bg-amber-500": i % 2 === 0,
                        "bg-green-600": i % 2 === 1,
                      }
                    )}
                    style={{ gridColumn: "1 / 2" }}
                    title={routeList[i]}
                  >
                    {routeList[i].replace(/_/g, " ")}
                  </div>

                  {row.map((cell: any, j: number) => (
                    <div
                      key={j}
                      className={clsx(
                        " p-3 gap-1.5 flex flex-col content-center items-center justify-center text-xs min-h-[100px] max-w-full",
                        {
                          "border border-white": true,
                          "bg-green-300": j % 2 === 1,
                          "bg-amber-300": j % 2 === 0,
                        }
                      )}
                    >
                      {cell ? (
                        cell.map((item: any, k: number) => {
                          const total =
                            item.seat_counts.online + item.seat_counts.offline;
                          if (total <= 0) return null;
                          return (
                            <div
                              key={k}
                              className={clsx(
                                "bg-white border border-white rounded px-2 py-1 text-[10px] text-center w-full"
                              )}
                            >
                              <div
                                className="font-semibold text-green-600 truncate"
                                title={item.type}
                              >
                                {item.type}
                              </div>
                              <div className="text-gray-700 font-semibold">
                                {Number(item.fare) + item.vat_amount} TK
                              </div>
                              <div className="text-green-700 font-medium">
                                <span className="font-semibold">{total}</span>{" "}
                                tickets
                              </div>
                              <a
                                href={`https://eticket.railway.gov.bd/booking/train/search?fromcity=${routeList[i]}&tocity=${routeList[j]}&doj=${formatedDate}&class=${item.type}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-white px-2 py-1 rounded font-bold bg-green-600 hover:bg-green-700"
                              >
                                Buy
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-gray-400"></div>
                      )}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        ) : !loading && isMatrixCreated ? (
          <NoSeatMessage />
        ) : null}
      </div>
    </Fragment>
  );
}
