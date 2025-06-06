import { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import { stationList } from "../../constants/StationList";
import { fetch } from "@tauri-apps/plugin-http";
import { isEmpty } from "lodash";
import DatePicker from "./DatePicker";
import { Info, Loader } from "lucide-react";
import clsx from "clsx";
import SelectedDate from "./SelectedDate";

export default function Journeyform() {
  const {
    startingPoint,
    setStartingPoint,
    destinationPoint,
    setDestinationPoint,
    formatedDate,
    trainList,
    setTrainList,
    searchedTrainOnce,
    setSearchedTrainOnce,
    selectedTrainName,
    setSelectedTrainName,
    isSearchingTrain,
    setIsSearchingTrain,
    setSelectedTrainModel,
    setRouteListInfo,
    setIsMatrixCreated,
    setTicketFound,
  } = useContext(DataContext);

  const [startQuery, setStartQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);

  const startRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startRef.current &&
        !startRef.current.contains(event.target as Node)
      ) {
        setStartOpen(false);
      }
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setDestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStart = stationList.filter((item) =>
    item.toLowerCase().includes(startQuery.toLowerCase())
  );

  const filteredDest = stationList.filter((item) =>
    item.toLowerCase().includes(destQuery.toLowerCase())
  );

  const fetchTrain = async () => {
    try {
      setSelectedTrainName(null);
      setSearchedTrainOnce(false);
      setTrainList([]);
      setIsSearchingTrain(true);
      setRouteListInfo([]);
      setIsMatrixCreated(false);
      setTicketFound(false);
      const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${startingPoint}&to_city=${destinationPoint}&date_of_journey=${formatedDate}&seat_class=SHULOV`;

      let response = await fetch(tempUrl);
      let responseObject = await response.json();
      let trains = responseObject!.data!.trains.map((train: any) =>
        train!.trip_number.trim()
      );
      setTrainList(trains);
      setSearchedTrainOnce(true);
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsSearchingTrain(false);
    }
  };

  function extractTrainModel(selectedTrainName: string) {
    const match = selectedTrainName.match(/\((\d+)\)$/);
    if (match) setSelectedTrainModel(match[1]);
  }

  return (
    <div className="gap-4 grid  m-2 mt-0 justify-items-center  w-[80vw] p-2 justify-self-center">
      {/* Starting Point Dropdown */}
      <h1 className="justify-self-star text-green-600 font-bold ">
        Origin Station:{" "}
        {startingPoint && <span className="font-bold">{startingPoint}</span>}
      </h1>
      <div
        className="w-full relative"
        ref={startRef}
      >
        <button
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer"
          onClick={() => setStartOpen(!startOpen)}
        >
          {startingPoint || "Starting Point"}
          <span className="float-right">&#9662;</span>
        </button>
        {startOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            <input
              type="text"
              placeholder="Search origin station..."
              className="px-4 py-2 w-full border-b border-gray-300 focus:outline-none"
              value={startQuery}
              onChange={(e) => setStartQuery(e.target.value)}
              autoFocus
            />
            <ul className="max-h-60 overflow-auto">
              {filteredStart.length > 0 ? (
                filteredStart.map((item, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer px-4 py-2 hover:bg-green-100"
                    onClick={() => {
                      setStartingPoint(item.trim());
                      setSearchedTrainOnce(false);
                      setTrainList([]);
                      setStartOpen(false);
                      setStartQuery("");
                      setRouteListInfo([]);
                      setIsMatrixCreated(false);
                      setTicketFound(false);
                       setSelectedTrainName(null);
                      setSelectedTrainModel(null);
                    }}
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-600">No stations found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Destination Point Dropdown */}
      <h1 className="justify-self-star text-green-600 font-bold ">
        Destination Station:{" "}
        {destinationPoint && (
          <span className="font-bold">{destinationPoint}</span>
        )}
      </h1>

      <div
        className="w-full relative"
        ref={destRef}
      >
        <button
          className="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left cursor-pointer"
          onClick={() => setDestOpen(!destOpen)}
        >
          {destinationPoint || "Destination Point"}
          <span className="float-right">&#9662;</span>
        </button>
        {destOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1">
            <input
              type="text"
              placeholder="Search destination..."
              className="px-4 py-2 w-full border-b border-gray-300 focus:outline-none"
              value={destQuery}
              onChange={(e) => setDestQuery(e.target.value)}
              autoFocus
            />
            <ul className="max-h-60 overflow-auto">
              {filteredDest.length > 0 ? (
                filteredDest.map((item, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer px-4 py-2 hover:bg-green-100"
                    onClick={() => {
                      setDestinationPoint(item.trim());
                      setSearchedTrainOnce(false);
                      setTrainList([]);
                      setDestOpen(false);
                      setDestQuery("");
                      setRouteListInfo([]);
                      setIsMatrixCreated(false);
                      setTicketFound(false);
                       setSelectedTrainName(null);
                      setSelectedTrainModel(null);
                    }}
                  >
                    {item}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-600">No stations found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {startingPoint &&
        destinationPoint &&
        startingPoint === destinationPoint && (
          <div className="grid grid-cols-12 text-sm gap-2 bg-red-500 text-white font-semibold p-1 rounded-sm shadow-md shadow-black">
            <span className="p-2 col-span-2">
              <Info className="text-[10px] w-[18px] text-white" />
            </span>
            <p className="col-span-10 grid h-fit bg-blue-500 self-center justify-self-start">
              Change Origin station or Destination station. Both can't be
              same...
            </p>
          </div>
        )}

      {/* Date picker...... */}

      <DatePicker />

      {startingPoint && destinationPoint && (
        <h1 className="mt-4 text-center font-semibold">
          {startingPoint} ➝ {destinationPoint}
        </h1>
      )}

      {/* Train finding button..... */}

      <SelectedDate />

      <button
        disabled={!startingPoint || !destinationPoint || !formatedDate}
        onClick={fetchTrain}
        className="bg-green-600 disabled:disabled:bg-red-700  cursor-pointer p-3 text-white font-bold rounded-sm shadow-md shadow-black"
      >
        Search Trains
      </button>

      {!isEmpty(trainList) && (
        <div className="grid gap-5 border border-gray-300 p-2 max-h-[50vh] overflow-auto rounded-md ">
          <h1 className="font-semibold">
            <span className="text-green-600 text-xl">{trainList!.length}</span>{" "}
            train(s) found!
          </h1>
          {trainList.map((train: any, index: any) => (
            <p
              key={index}
              className={clsx(
                "border font-semibold border-gray-300 rounded-sm p-3 text-sm w-full text-center shadow-black cursor-pointer justify-self-center transition-colors duration-200",
                {
                  "bg-green-600 text-white font-bold":
                    train === selectedTrainName,
                  "hover:bg-green-300 hover:text-black":
                    train !== selectedTrainName,
                }
              )}
              onClick={() => {
                setSelectedTrainName(train.trim());
                extractTrainModel(train.trim());
                setRouteListInfo([]);
                setIsMatrixCreated(false);
                setTicketFound(false);

              }}
            >
              {train.toString()}
            </p>
          ))}
        </div>
      )}

      {isEmpty(trainList) && !searchedTrainOnce && (
        <h1 className="text-red-600 font-semibold mt-10">
          {isSearchingTrain ? (
            <Loader className="text-green-600 " />
          ) : (
            "No train is searched yet!"
          )}
        </h1>
      )}

      {isEmpty(trainList) && searchedTrainOnce && (
        <h1 className="text-red-600 font-semibold text-sm">
          Sorry, No train is available for
          <span className="text-green-600"> {startingPoint}</span> to
          <span className="text-green-600"> {destinationPoint}</span> route!
        </h1>
      )}
    </div>
  );
}
