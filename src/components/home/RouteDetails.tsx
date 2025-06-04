import { useContext, Fragment, useState } from "react";
import { DataContext } from "../../context/DataContext";
import clsx from "clsx";

export default function RouteDetails() {
  const { routeData, routeListInfo } = useContext(DataContext);
  const { train_name, days, total_duration } = routeData.data;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Fragment>
      <div className="w-4/5 justify-self-center box-border p-4 bg-white rounded shadow overflow-x-hidden">
        <header
          className="text-center p-2 cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            ["Enter", " "].includes(e.key) ? setIsOpen(!isOpen) : null
          }
        >
          <h1 className="text-xl font-bold text-green-700 flex justify-center items-center gap-1">
            {train_name}
            <svg
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </h1>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Days:</span> {days.join(", ")}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Duration:</span> {total_duration}
          </p>
        </header>

        {isOpen && (
          <div className="relative  pl-6 mt-3 overflow-x-hidden">
            {routeListInfo.map((stop: any, index: number) => {
              const isLast = index === routeListInfo.length - 1;
              return (
                <div
                  key={index}
                  className="relative py-3 px-1 pb-10"
                >
                  <span
                    className={clsx(
                      "absolute -left-3 top-4 w-3 h-3 bg-green-600 shadow-sm shadow-black",
                      {
                        "rounded-none": index === 0,
                        "rotate-45": index !== 0 && !isLast,
                        "clip-path-[polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)]":
                          isLast,
                      }
                    )}
                  ></span>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm w-full">
                    <h2 className="font-semibold text-gray-800">{stop.city}</h2>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                      <div>
                        <span className="font-semibold">
                          {index !== 0 ? "Arrival:" : "Starting Point"}
                        </span>{" "}
                        {stop.arrival_time ?? null}
                      </div>
                      {(stop.departure_time || isLast) && (
                        <div>
                          <span className="font-semibold">
                            {isLast ? "Ending Point" : "Departure time:"}
                          </span>{" "}
                          {stop.departure_time ?? null}
                        </div>
                      )}
                      {stop.halt && stop.halt !== "---" && (
                        <div>
                          <span className="font-semibold">Halt:</span>{" "}
                          {stop.halt ?? <i className="text-gray-400">-</i>} min
                        </div>
                      )}
                      {stop.Duration && (
                        <div>
                          <span className="font-semibold">Duration:</span>{" "}
                          {stop.duration ?? <i className="text-gray-400">-</i>}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isLast && (
                    <div className="absolute left-0 top-6 w-px bg-green-600 h-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Fragment>
  );
}
