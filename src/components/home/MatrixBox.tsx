
import { Fragment, useContext, useEffect, useState } from "react";
import { fetch } from "@tauri-apps/plugin-http";
import { DataContext } from "../../context/DataContext";

export default function MatrixBox() {
  const { routeList, formatedDate, selectedTrainName,trainData, setTrainData } = useContext(DataContext);
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
              const train = trainList.find((t: any) => t?.trip_number === selectedTrainName);
              const seatType = train?.seat_types;
              if (seatType) {
                // dataMatrix[i][j] = seatType;
                // dataMatrix[j][i] = seatType;
                if(dataMatrix[i][j] ==null){
                    dataMatrix[i][j] = seatType;
                dataMatrix[j][i] = null;

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
    }
  };

  return (
    <Fragment>
      <div className="p-4 bg-gray-50 max-w-[95vw] max-h-[90vh] grid overflow-auto">
        <button
          onClick={createMatrix}
          className="bg-blue-600 text-white w-fit px-4 py-2 mb-4 justify-self-center self-center rounded hover:bg-blue-700 cursor-pointer"
        >
          Create Matrix
        </button>

        {loading && (
          <div className="mb-4 text-blue-600 font-medium animate-pulse">
            Loading data... ⏳ {elapsed}s elapsed
          </div>
        )}

        {trainData && trainData.length > 0 ? (
          <div
            className="border rounded bg-white shadow"
            style={{
              width: "100%",
              height: "80vh",
              overflow: "auto",
              boxSizing: "border-box",
              scrollbarGutter: "stable both-edges",
            }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${routeList.length + 1}, minmax(100px, 1fr))`,
                width: "max-content",
              }}
            >
              <div className="sticky top-0 left-0 bg-gray-200 border border-gray-300 z-30 h-12 w-full" />

              {routeList.map((city: any, idx: number) => (
                <div
                  key={`head-${idx}`}
                  className="sticky top-0 z-20 bg-gray-200 border border-gray-300 text-center text-xs font-semibold p-1 truncate"
                  title={city}
                >
                  {city.replace(/_/g, " ")}
                </div>
              ))}

              {trainData.map((row:any, i:any) => (
                <Fragment key={i}>
                  <div
                    className="sticky left-0 z-10 bg-orange-600 text-white border border-gray-300 text-center text-xs font-semibold p-1 truncate"
                    style={{ gridColumn: "1 / 2" }}
                    title={routeList[i]}
                  >
                    {routeList[i].replace(/_/g, " ")}
                  </div>

                  {row.map((cell:any, j:number) => (
                    <div
                      key={j}
                      className="border border-gray-200 p-1 flex flex-col items-center justify-center text-xs min-h-[100px] max-w-full"
                    >
                      {cell ? (
                        cell.map((item: any, k: number) => {
                          const total = item.seat_counts.online + item.seat_counts.offline;
                          if (total <= 0) return null;
                          return (
                            <div
                              key={k}
                              className="bg-white border border-gray-300 rounded px-2 py-1 text-[10px] text-center w-full"
                            >
                              <div className="font-semibold text-green-600 truncate" title={item.type}>
                                {item.type}
                              </div>
                              <div className="text-gray-700">{Number(item.fare) + item.vat_amount} TK</div>
                              <div className="text-blue-700 font-medium">{total} tickets</div>
                              <a
                                href={`https://eticket.railway.gov.bd/booking/train/search?fromcity=${routeList[i]}&tocity=${routeList[j]}&doj=${formatedDate}&class=${item.type}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 inline-block text-white px-2 py-1 rounded bg-blue-600 hover:bg-blue-700"
                              >
                                Buy
                              </a>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-gray-400">—</div>
                      )}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center p-4 text-gray-500">No data available</div>
        ) : null}
      </div>
    </Fragment>
  );
}
