import { TrainList } from "../../constants/TrainData";
import { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../../context/DataContext";
import DatePicker from "./DatePicker";
import { fetch } from "@tauri-apps/plugin-http";
import SelectedDate from "./SelectedDate";

export default function BusForm() {
  const {
    setSelectedTrainName,
    selectedTrainName,
    setSelectedTrainModel,
    selectedTrainModel,
    selectedDate,
    setRouteData,
    setShouldFetch,
    setTrainData
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
  }, []);

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

  async function getTickets(selectedModel: string, selectedDate: string) {
    try {
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

      if (response.status == 200) setRouteData(await response.json());
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full p-5 mt-20">
      <h2 className="text-lg mb-3">
        {selectedTrainName || "No train selected"}
      </h2>

      <div
        className="relative w-4/5"
        ref={dropdownRef}
      >
        <button
          type="button"
          className="
            w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-left
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
            flex justify-between items-center
          "
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          {selectedTrainName || "Select a train"}
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
                      cursor-pointer px-4 py-2 hover:bg-blue-100
                      ${
                        trainName === selectedTrainName
                          ? "bg-blue-200 font-semibold"
                          : ""
                      }
                    `}
                    onClick={() => selectTrain(trainName)}
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
                <li className="px-4 py-2 text-gray-500">No trains found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <DatePicker />

      <button
        className="
    bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
    text-white font-semibold rounded-lg px-6 py-3
    shadow-md transition duration-300 ease-in-out
    focus:outline-none
    active:bg-blue-800
    w-full sm:w-auto
    m-5 
    cursor-pointer
  "
        onClick={() => {
          setTrainData(null);
          getTickets(selectedTrainModel, selectedDate);
          setTimeout(() => {
            setShouldFetch(true);
          }, 2000);
        }}
        disabled={!(selectedDate && selectTrain)}
      >
        Find Ticket
      </button>

      <SelectedDate />
    </div>
  );
}
