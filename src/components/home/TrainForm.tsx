import { TrainList } from "../../constants/TrainData";
import { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import DatePicker from "./DatePicker";
import { fetch } from "@tauri-apps/plugin-http";
import SelectedDate from "./SelectedDate";
import { Info } from "lucide-react";

export default function TrainForm() {
  const {
    setSelectedTrainName,
    selectedTrainName,
    setSelectedTrainModel,
    selectedTrainModel,
    selectedDate,
    setRouteData,
    setShouldFetch,
    setTrainData,
    setRouteListInfo,
    routeData,
    routeListInfo,
    setIsMatrixCreated,
    setTicketFound,
    setNumberOfSeatsFound,
  } = useContext(DataContext);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [routeData, routeListInfo]);

  const selectTrain = (tName: string) => {
    setSelectedTrainName(tName);
    extractTrainModel(tName);
    setIsOpen(false);
    setSearchQuery("");
  };

  function extractTrainModel(selectedTrainName: string) {
    const match = selectedTrainName.match(/\((\d+)\)$/);
    if (match) setSelectedTrainModel(match[1]);
  }

  const filteredTrains = TrainList.filter((train) =>
    train.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // function to find  route information

  async function getTickets(selectedModel: string, selectedDate: string) {
    try {
      setRouteListInfo([]);
      setIsMatrixCreated(false);
      setTicketFound(false);
      setNumberOfSeatsFound(0);
      const response = await fetch(
        "https://railspaapi.shohoz.com/v1.0/web/train-routes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            departure_date_time: selectedDate,
          }),
        }
      );

      if (response.status == 200) {
        const routeDataObject = await response.json();
        setRouteData(routeDataObject);
        setRouteListInfo(routeDataObject!.data!.routes);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-5 mt-0">
      <h2 className="text-lg mb-3 text-green-600 font-bold ">
        {selectedTrainName || (
          <p className="text-red-600">No train is selected!</p>
        )}
      </h2>

      <div className="grid grid-cols-12 justify-items-center content-center items-center">
        <Info className="text-red-600 w-5" />
        <p className="text-sm mt-2 mb-2 col-span-10 p-2 text-red-500 ">
          If you know the name of the train you have to use, you can select the
          train directly from <span className="text-green-600">dropdown below</span>, otherwise don't change it...
        </p>
      </div>

      <div
        className="relative w-4/5"
        ref={dropdownRef}
      >
        <button
          type="button"
          className="
            w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600
            flex justify-between items-center
          "
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedTrainName || "Manually select train"}
          <span className="ml-2">&#9662;</span>
        </button>

        {isOpen && (
          <div
            className="
              absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg
              max-h-72 overflow-auto flex flex-col
            "
            role="listbox"
            tabIndex={-1}
          >
            <input
              type="text"
              placeholder="Search trains..."
              className="px-4 py-2 border-b border-gray-300 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />

            <ul className="max-h-60 overflow-auto">
              {filteredTrains.length > 0 ? (
                filteredTrains.map((trainName, index) => (
                  <li
                    key={index}
                    role="option"
                    aria-selected={trainName === selectedTrainName}
                    tabIndex={0}
                    className={`
                      cursor-pointer px-4 py-2 hover:bg-green-100
                      ${
                        trainName === selectedTrainName
                          ? "bg-green-200 font-semibold"
                          : ""
                      }
                    `}
                    onClick={() => {
                      selectTrain(trainName);
                      setRouteListInfo([]);
                      setIsMatrixCreated(false);
                      setTicketFound(false);
                      setNumberOfSeatsFound(0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        selectTrain(trainName);
                      }
                    }}
                  >
                    {trainName}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-600">No trains found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <DatePicker />

      <button
        className="
    bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300
    text-white font-semibold rounded-lg px-6 py-3
    shadow-md transition duration-300 ease-in-out
    focus:outline-none
    active:bg-green-800
    w-full sm:w-auto
    m-5 
    cursor-pointer
    disabled:bg-red-700
  "
        onClick={() => {
          setTrainData(null);
          getTickets(selectedTrainModel, selectedDate);
          setTimeout(() => {
            setShouldFetch(true);
          }, 2000);
        }}
        disabled={!(selectedDate && selectedTrainModel)}
      >
        Find Ticket
      </button>

      {
        !selectedDate && !selectedTrainModel && <div className="bg-red-600 items-center content-center  grid-cols-12 grid p-1 rounded-sm text-white  m-2 text-sm">
          <Info className="col-span-2 w-5"/>
          <p className="col-span-10">Select both train and date</p>
           </div>
      }

      <SelectedDate />
    </div>
  );
}
